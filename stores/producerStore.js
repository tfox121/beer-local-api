const producerUser = require('../models/producerUser');

module.exports = class UserStore {
  // find user according to id and role
  static async findUser(producerId) {
    return producerUser.findOne({ producerId });
  }

  static async updateStock(sub, stockData) {
    const userData = await producerUser.findOneAndUpdate(
      sub,
      {
        stock: stockData,
      },
      {
        new: true,
      },
    );
    return userData;
  }
};
