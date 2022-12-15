module.exports = {
  sync: true,
  friendlyName: 'Is social link',
  description: 'The helper function returns a boolean value to indicate whether the passed URL is the social network link or not.',

  inputs: {
    url: {
      type: 'string',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: function (inputs) {
    const { url } = inputs;

    return /facebook|github|twitter|linkedin/ig.test(url);
  }
};
