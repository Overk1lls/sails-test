/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getUsers: async (req, res) => {
    const { limit, skip } = req.query;

    const users = await User.find().limit(limit).skip(skip);

    return res.json(users);
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
};
