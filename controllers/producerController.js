const ProducerStore = require('../stores/producerStore');
const UserStore = require('../stores/userStore');

module.exports = class ProducerController {
  static async findById(req, res, next) {
    try {
      const producer = await ProducerStore.findById(req.params.producerId);
      const user = await UserStore.findUser(producer.sub)
      console.log('PRODUCER RETRIEVED');
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

  static async getAll(req, res, next) {
    try {
      const producers = await ProducerStore.getAll()
      return res.json(producers);
    } catch (err) {
      res.status(500).send({
        message: 'Producers retrieval error',
        error: err,
      });
      return next(err);
    }
  }

  static async updateProfileOptions(req, res, next) {
    try {
      // console.log(req.body)
      const producer = await ProducerStore.updateProfileOptions(req.user.sub, req.body)
      const user = await UserStore.findUser(producer.sub)
      console.log("PROFILE")
      if (user && producer) {
        return res.json({ producer, user });
      }
    } catch (err) {
      res.status(500).send({
        message: 'Profile options update error',
        error: err,
      });
      return next(err);
    }
  }

  static async updateProfile(req, res, next) {
    console.log("UPDATING PROFILE")
    try {
      const producer = await ProducerStore.updateProfile(req.user.sub, req.body)
      const user = await UserStore.findUser(producer.sub)
      if (user && producer) {
        return res.json({ producer, user });
      }
    } catch (err) {
      res.status(500).send({
        message: 'Profile update error',
        error: err,
      });
      return next(err);
    }
  }

  static async updateStock(req, res, next) {
    try {
      const producer = await ProducerStore.updateStock(req.user.sub, req.body);
      console.log(producer.stock);
      return res.json(producer.stock);
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

  static async editBlogPost(req, res, next) {
    try {
      const producer = await ProducerStore.editBlogPost(req.user.sub, req.body.id, req.body.rawBlogData, req.body.blogMeta)
      return res.json(producer)
    } catch(err) {
      res.status(500).send({
        message: 'Blog edit error',
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
