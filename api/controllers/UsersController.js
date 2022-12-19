/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const { createWriteStream, readFileSync } = require('fs');
const PDFDoc = require('pdfkit');
const { usersFile, linksFile, defaultNumToGenerate } = require('../helpers/generate-users');

const pdfFileName = 'usersData.pdf';

module.exports = {
  getUsers: async (req, res) => {
    const { limit, skip } = req.query;

    const users = await User.find().limit(limit).skip(skip);

    return res.json(users);
  },
  getUsersInPDF: async (req, res) => {
    try {
      const doc = new PDFDoc({ compress: false });

      const destination = createWriteStream(pdfFileName);

      doc.pipe(destination);

      await User
        .stream()
        .meta({ enableExperimentalDeepTargets: true })
        .populate('links')
        .eachBatch(async (users) => {
          doc.list(Object.values(users).map((u) => JSON.stringify(u)), { listType: 'numbered' });
        });

      doc.end();

      destination.on('finish', () => {
        res.status(201).download(sails.helpers.getAppRootDir() + '/usersData.pdf');
      });
    } catch (error) {
      res.serverError(error);
    }
  },
  createUser: async (req, res) => {
    const { firstname, lastname, email, phone, city, address, links } = req.body;

    try {
      const newUser = await User
        .create({
          firstname,
          lastname,
          email,
          phone,
          city,
          address,
        })
        .fetch();

      const socials = await sails.helpers.getUserSocials.with({
        links,
        userId: newUser.id,
      });

      await Link.createEach(socials);

      /**
       * @type {{id: number, url: string, user: number}[]}
       */
      const createdLinks = await Link.find().populate('socialNetwork');
      await User.addToCollection(newUser.id, 'links').members(createdLinks.map((l) => l.id));

      const createdUsers = await User.find().populate('links');

      return res.status(201).json(createdUsers);
    } catch (error) {
      if (error.code === 'E_UNIQUE') {
        return res.badRequest('User already exists!');
      }
      return res.serverError(error);
    }
  },
  generateUsers: async (req, res) => {
    try {
      const amount = req.query?.n ? +req.query.n : defaultNumToGenerate;
      const insertChunk = amount > 10000 ? 10000 : amount;

      const links = readFileSync(linksFile)
        .toString()
        .replace(/\r\n/g, '\n')
        .split('\n')
        .splice(0, amount);
      const users = readFileSync(usersFile)
        .toString()
        .replace(/\r\n/g, '\n')
        .split('\n')
        .splice(0, amount);

      const parsedLinks = links.map((l) => JSON.parse(l));
      const parsedUsers = users.map((l) => JSON.parse(l));

      await sails.getDatastore().transaction(async (db) => {
        await User.destroy({}).usingConnection(db);
        await Link.destroy({}).usingConnection(db);

        for (let i = 0; i < amount; i += insertChunk) {
          let chunk = parsedLinks.slice(i, i + insertChunk);
          await Link.createEach(chunk).usingConnection(db);

          chunk = parsedUsers.slice(i, i + insertChunk);
          await User.createEach(chunk).usingConnection(db);
        }
      });

      return res.status(201).ok(amount + ' users were generated and inserted.');
    } catch (error) {
      return res.serverError(error);
    }
  }
};
