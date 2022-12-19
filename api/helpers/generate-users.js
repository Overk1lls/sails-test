const fs = require('fs');

module.exports = {
  sync: true,
  friendlyName: 'Generate users',
  description: 'A helper function to generate a number of user, and insert them into the database.',
  inputs: {
    amount: {
      type: 'number',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  usersFile: './api/db/users.txt',
  linksFile: './api/db/links.txt',
  defaultNumToGenerate: 100000,
  fn: function (inputs) {
    const amount = inputs?.amount ? +inputs.amount : this.defaultNumToGenerate;
    const newLinks = [];
    const newUsers = [];

    const userStream = fs.createWriteStream(this.usersFile);
    const linkStream = fs.createWriteStream(this.linksFile);

    for (let i = 1; i <= amount; i++) {
      const { name, id } = sails.helpers.generateSocialNetwork();

      const link = {
        url: `http://${name.toLowerCase()}.com/${i}`,
        socialNetwork: id,
        user: i,
      }
      const user = {
        firstname: 'name' + i,
        lastname: 'last' + i,
        email: `test${i}@gmail.com`,
        phone: '+380' + i,
        links: [i],
      }

      newLinks.push(link);
      newUsers.push(user);

      userStream.write(JSON.stringify(user) + '\n');
      linkStream.write(JSON.stringify(link) + '\n');
    }

    userStream.close();
    linkStream.close();

    return { newLinks, newUsers };
  }
};
