const ProducerStore = require('../stores/producerStore');
const UserStore = require('../stores/userStore');

exports.findById = async (req, res, next) => {
  try {
    const producer = await ProducerStore.findById(req.params.businessId);
    const user = await UserStore.findUser(producer.sub);
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
};

exports.getAvatar = async (req, res) => {
  try {
    const avatar = await ProducerStore.getAvatar(req.params.businessId);
    res.set('Content-Type', avatar.contentType);
    res.send(avatar.data);
  } catch (err) {
    res.status(500).json({
      message: 'Avatar retrieval error',
      error: err,
    });
  }
};
exports.getBanner = async (req, res) => {
  try {
    const banner = await ProducerStore.getBanner(req.params.businessId);
    res.set('Content-Type', banner.contentType);
    res.send(banner.data);
  } catch (err) {
    res.status(500).json({
      message: 'Banner retrieval error',
      error: err,
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const producers = await ProducerStore.getAll();
    res.json(producers);
  } catch (err) {
    res.status(500).json({
      message: 'Producers retrieval error',
      error: err,
    });
  }
};

exports.updateProfileOptions = async (req, res) => {
  try {
    // console.log(req.body)
    const producer = await ProducerStore.updateProfileOptions(req.user.sub, req.body);
    const user = await UserStore.findUser(producer.sub);
    console.log('PROFILE');
    if (user && producer) {
      res.json({ producer, user });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Profile options update error',
      error: err,
    });
  }
};

exports.updateProfile = async (req, res) => {
  console.log('UPDATING PROFILE');
  try {
    const producer = await ProducerStore.updateProfile(req.user.sub, req.body);
    const user = await UserStore.findUser(producer.sub);
    if (user && producer) {
      res.json({ producer, user });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Profile update error',
      error: err,
    });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const producer = await ProducerStore.updateStock(req.user.sub, req.body);
    res.json(producer.stock);
  } catch (err) {
    res.status(500).json({
      message: 'Stock update error',
      error: err,
    });
  }
};

exports.addBlogPost = async (req, res) => {
  try {
    const producer = await ProducerStore.addBlogPost(
      req.user.sub,
      req.body.rawBlogData,
      req.body.blogMeta,
    );
    res.json(producer);
  } catch (err) {
    res.status(500).json({
      message: 'Blog posting error',
      error: err,
    });
  }
};

exports.editBlogPost = async (req, res) => {
  try {
    const producer = await ProducerStore.editBlogPost(
      req.user.sub,
      req.body.id,
      req.body.rawBlogData,
      req.body.blogMeta,
    );
    res.json(producer);
  } catch (err) {
    res.status(500).json({
      message: 'Blog edit error',
      error: err,
    });
  }
};
