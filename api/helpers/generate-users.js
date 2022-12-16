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
  fn: function (inputs) {
    const amount = inputs?.amount ? +inputs.amount : 100000;
    const newLinks = [];
    const newUsers = [];

    for (let i = 1; i <= amount; i++) {
      const { name, id } = sails.helpers.generateSocialNetwork();

      newLinks.push({
        url: `http://${name.toLowerCase()}.com/${i}`,
        socialNetwork: id,
        user: i,
      });
      newUsers.push({
        firstname: 'name' + i,
        lastname: 'last' + i,
        email: `test${i}@gmail.com`,
        phone: '+380' + i,
        links: [i],
      });
    }

    return { newLinks, newUsers };
  }
};
