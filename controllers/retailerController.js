const RetailerStore = require('../stores/retailerStore');

module.exports = class RetailerController {
  static async findUser(req, res, next) {
    try {
      const user = await RetailerStore.findUser(req.params.businessId);
      if (user) {
        return res.json(user);
      }
      return res.status(404).send({
        message: 'User not found',
      });
    } catch (err) {
      res.status(500).send({
        message: 'User retrieval error',
        error: err,
      });
      return next(err);
    }
  }
};
