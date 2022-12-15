module.exports = {
  friendlyName: 'Get user socials',
  description: 'The helper function maps an array of social network links from user to objects for proper database insertion.',
  inputs: {
    links: {
      type: 'ref',
      required: true,
    },
    userId: {
      type: 'number',
      required: true,
    },
  },
  exits: {
    success: {
      outputFriendlyName: 'User socials',
    },
  },
  fn: async function (inputs) {
    const socialNetworks = await SocialNetwork.find();
    const split = inputs.links.split('\n');

    const linkObjects = split.reduce((prev, cur) => {
      if (!sails.helpers.isSocialLink(cur)) {
        return prev;
      }

      const networkName = cur
        .split('/')
        .find((url) => sails.helpers.isSocialLink(url))
        ?.toLowerCase()
        .split('.').at(-2);

      return [
        ...prev,
        {
          url: cur,
          user: inputs.userId,
          social_network: socialNetworks
            .find((item) => item.name.toLowerCase() === networkName)
            .id,
        }
      ];
    }, []);
    
    return linkObjects;
  }
};
