const RetailerStore = require('../stores/retailerStore');

exports.findUser = async (req, res) => {
  try {
    const user = await RetailerStore.findUser(req.params.businessId);
    if (user) {
      res.json({ user });
      return;
    }
    res.status(404).send({
      message: 'User not found',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'User retrieval error',
      error: err,
    });
  }
};

exports.getProducerFeed = async (req, res) => {
  try {
    const producers = await RetailerStore.getProducerFeed(req.user.sub);
    res.json(producers);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Producers retrieval error',
      error: err,
    });
  }
};
