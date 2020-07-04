const ProducerStore = require('../stores/producerStore');
const RetailerStore = require('../stores/retailerStore');
const UserStore = require('../stores/userStore');

module.exports = class ProducerController {
  static async findByProducerId(req, res, next) {
    try {
      const producer = await ProducerStore.findByProducerId(req.params.producerId);
      const user = await UserStore.findUser(producer.sub)
      console.log('PRODUCER RETRIEVED', producer, user);
      if (user && producer) {
        return res.json({ producer, user });
      }
      return res.status(404).send({
        message: 'Producer not found',
      });
    } catch (err) {
      res.status(500).send({
        message: 'Producer retrieval error',
        error: err,
      });
      return next(err);
    }
  }

  static async getProducers(req, res, next) {
    try {
      const producers = await ProducerStore.getProducers()
      return res.json(producers);
    } catch (err) {
      res.status(500).send({
        message: 'Producers retrieval error',
        error: err,
      });
      return next(err);
    }
  }

  static async updateStock(req, res, next) {
    try {
      const user = await ProducerStore.updateStock(req.user.sub, req.body);
      console.log(user.stock);
      return res.json(user.stock);
    } catch (err) {
      res.status(500).send({
        message: 'Stock update error',
        error: err,
      });
      return next(err);
    }
  }

  static async addBlogPost(req, res, next) {
    try {
      const producer = await ProducerStore.addBlogPost(req.user.sub, req.body.rawBlogData, req.body.blogMeta)
      return res.json(producer)
    } catch (err) {
      res.status(500).send({
        message: 'Blog posting error',
        error: err,
      });
      return next(err);
    }
  }

  static async editOrderStatus(req, res, next) {
    try {
      const order = await ProducerStore.editOrderStatus(req.body)
      console.log(order)
      return res.json(order)
    } catch (err) {
      res.status(500).send({
        message: 'Order update error',
        error: err,
      });
      return next(err);
    }
  }
};
