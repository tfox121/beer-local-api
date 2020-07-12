const Order = require('../models/order');

exports.getOrders = async (sub, role) => Order.find({ [`${role}Sub`]: sub });

exports.getOrder = async (orderId) => Order.findById(orderId);

exports.placeOrder = async (retailerSub, producerSub, items) => {
  const newOrder = new Order({ retailerSub, producerSub, items });
  return newOrder.save();
};

exports.editOrder = async (orderId, orderChanges) => {
  const order = await Order.findById(orderId);
  Object.keys(orderChanges).forEach((property) => {
    order[property] = orderChanges[property];
  });
  return order.save();
};

exports.addOrderMessage = async (orderId, sub, role, messageData) => {
  const order = await Order.findById(orderId);
  if (role === 'producer') {
    order.retailerNotification = true;
  } else {
    order.producerNotification = true;
  }
  order.messages.unshift({ author: sub, content: messageData.content });
  return order.save();
};
