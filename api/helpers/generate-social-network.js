module.exports = {
  sync: true,
  friendlyName: 'Generate social network',
  description: '',
  inputs: {},
  exits: {
    success: {
      description: 'All done.',
    },
  },
  fn: function () {
    const randNum = Math.floor(Math.random() * 4 + 1);

    switch (randNum) {
      case 2:
        return { name: 'Facebook', id: 2 };
      case 3:
        return { name: 'Linkedin', id: 3 };
      case 4:
        return { name: 'Github', id: 4 };
      default:
        return { name: 'Twitter', id: 1 };
    }
  }
};
