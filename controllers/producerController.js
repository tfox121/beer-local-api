const ProducerStore = require('../stores/producerStore');
const RetailerStore = require('../stores/retailerStore');
const UserStore = require('../stores/userStore');

const geoJsonContainsCoords = require('../lib/geoJsonContainsCoords');

// exports.getAvatar = async (req, res) => {
//   try {
//     const avatar = await ProducerStore.getAvatar(req.params.businessId);
//     res.set('Content-Type', avatar.contentType);
//     res.send(avatar.data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: 'Avatar retrieval error',
//       error: err,
//     });
//   }
// };

// exports.getBanner = async (req, res) => {
//   try {
//     const banner = await ProducerStore.getBanner(req.params.businessId);
//     res.set('Content-Type', banner.contentType);
//     res.send(banner.data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: 'Banner retrieval error',
//       error: err,
//     });
//   }
// };

exports.getAll = async (req, res) => {
  try {
    const producers = await ProducerStore.getAll();
    res.json(producers);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Producers retrieval error',
      error: err,
    });
  }
};

exports.updateProfile = async (req, res) => {
  console.log('UPDATING PROFILE', req.body);
  try {
    const producer = await ProducerStore.updateProfile(req.user.sub, req.body);
    const user = await UserStore.findBySub(producer.sub);
    if (user && producer) {
      res.json({ producer, user });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Profile update error',
      error: err,
    });
  }
};

exports.updateProfileOptions = async (req, res) => {
  try {
    // console.log(req.body)
    const producer = await ProducerStore.updateProfileOptions(req.user.sub, req.body);
    const user = await UserStore.findBySub(producer.sub);
    console.log('PROFILE');
    if (user && producer) {
      res.json({ producer, user });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Profile options update error',
      error: err,
    });
  }
};

exports.addPromotion = async (req, res) => {
  try {
    const producer = await ProducerStore.addPromotion(req.user.sub, req.body);
    res.json({ promotions: producer.promotions });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Promotion add error',
      error: err,
    });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    const producer = await ProducerStore.deletePromotion(req.user.sub, req.params.id);
    res.json({ promotions: producer.promotions });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Promotion delete error',
      error: err,
    });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const producer = await ProducerStore.updateStock(req.user.sub, req.body);
    res.json({ stock: producer.stock });
  } catch (err) {
    console.error(err);
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
    res.json({ blog: producer.blog });
  } catch (err) {
    console.error(err);
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
    res.json({ blog: producer.blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Blog edit error',
      error: err,
    });
  }
};

exports.getNearbyRetailers = async (req, res) => {
  try {
    const producer = await ProducerStore.findBySub(req.user.sub);
    const retailers = await RetailerStore.getAll();
    const filteredRetailers = retailers
      .filter((retailer) => geoJsonContainsCoords(producer.distributionAreas, retailer.location));
    res.json({ retailers: filteredRetailers });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Retailers fetch error',
      error: err,
    });
  }
};
