const ProducerStore = require('../stores/producerStore');

module.exports = class ProducerController {
  static async findUser(req, res, next) {
    try {
      const user = await ProducerStore.findUser(req.params.producerId);
      console.log('PRODUCER RETRIEVED', user);
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

  static async updateStock(req, res, next) {
    try {
      const user = await ProducerStore.updateStock(req.user.sub, req.body);
      console.log(user.stock);
      return res.send(user.stock);
    } catch (err) {
      res.status(500).send({
        message: 'Stock update error',
        error: err,
      });
      return next(err);
    }
  }
};
