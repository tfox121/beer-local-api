const ProducerUser = require('../models/producerUser');
const User = require('../models/user');
const Order = require('../models/order') 

module.exports = class UserStore {
  // find user according to id and role
  static async findByProducerId(producerId) {
    return ProducerUser.findOne({ producerId });
  }

  static async getProducers() {
    const producers = await ProducerUser.find({});
    const users = await User.find({ role: 'producer' })

    return producers.map((producer, index) => {
      return { ...producer._doc, ...users[index]._doc}
    })
  }

  static async findBySub(sub) {
    const producer = await ProducerUser.findOne({ sub });
    const user = await User.findOne({ sub })
    return { ...user._doc, ...producer._doc }
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

  static async addBlogPost(sub, blogData, { title, author }) {
    const producer = await ProducerUser.findOne({ sub });
    console.log("PRODUCER", producer)
    producer.blog.unshift({ blogData, title, author })
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
  }};
