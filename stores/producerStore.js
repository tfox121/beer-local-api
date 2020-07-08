const ProducerUser = require('../models/producerUser');
const User = require('../models/user');
const Order = require('../models/order') 

module.exports = class UserStore {
  // find user according to id and role
  static async findById(producerId) {
    return ProducerUser.findOne({ producerId });
  }

  static async findBySub(sub) {
    const producer = await ProducerUser.findOne({ sub });
    const user = await User.findOne({ sub })
    return { ...user._doc, ...producer._doc }
  }

  static async getAll() {
    const producers = await ProducerUser.find({});
    const users = await User.find({ role: 'producer' })

    return producers.map((producer, index) => {
      return { ...producer._doc, ...users[index]._doc}
    })
  }

  static async updateProfile(sub, updates) {
    return ProducerUser.findOneAndUpdate({ sub }, updates,
      {
        new: true,
      },
    );
  }

  static async updateProfileOptions(sub, optionsChange) {
    const producer = await ProducerUser.findOne({ sub });
    producer.profileOptions[optionsChange.name] = optionsChange.payload
    return producer.save()
  }

  static async updateStock(sub, stockData) {
    return ProducerUser.findOneAndUpdate(
      { sub },
      {
        stock: stockData,
      },
      {
        new: true,
      },
    );
  }

  static async addBlogPost(sub, blogData, { title, author, display }) {
    const producer = await ProducerUser.findOne({ sub });
    producer.blog.unshift({ blogData, title, author, display })
    return producer.save()
  }

  static async editBlogPost(sub, id, blogData, { title, author, display }) {
    const producer = await ProducerUser.findOne({ sub })
    producer.blog.id(id).blogData = blogData
    producer.blog.id(id).title = title
    producer.blog.id(id).author = author
    producer.blog.id(id).display = display
    producer.blog.id(id).modified = Date.now()
    return producer.save()
  }

  static async editOrderStatus({ _id, status }) {
    return Order.findOneAndUpdate(
      { _id },
      {
        status,
        modified: Date.now(),
      },
      {
        new: true,
      },
    )
  }

  static async addOrRemoveFollow(sub, follower) {
    const producer = await ProducerUser.findOne({ sub })
    producer.followingRetailers.unshift({ sub: follower })
    return producer.save()
  }
};
