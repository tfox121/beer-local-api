/* eslint-disable no-underscore-dangle */
const UserStore = require('../stores/userStore');
const OrderStore = require('../stores/orderStore');
const ProducerStore = require('../stores/producerStore');
const RetailerStore = require('../stores/retailerStore');
const User = require('../models/user');
const { notificationTypes } = require('../constants');

exports.getOrders = async (req, res) => {
  try {
    const orders = await OrderStore.getOrders(req.user.sub, req.role);
    if (orders || orders.length) {
      if (req.role === 'producer') {
        const purchasers = await Promise.all(orders.map(async (order) => {
          const purchaser = await RetailerStore.findBySub(order.retailerSub);
          return purchaser;
        }));
        res.json({ orders: orders.reverse(), businesses: purchasers.reverse() });
      }
      if (req.role === 'retailer') {
        const producers = await Promise.all(orders.map(async (order) => {
          const producer = await ProducerStore.findBySub(order.producerSub);
          return producer;
        }));
        res.json({ orders: orders.reverse(), businesses: producers.reverse() });
      }
    } else {
      res.status(404).json({
        message: 'No orders found',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Order fetch error',
      error: err,
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await OrderStore.getOrder(req.params.orderId);
    if (order) {
      if (req.role === 'producer') {
        const purchaser = await RetailerStore.findBySub(order.retailerSub);
        res.json({ order, business: purchaser });
      }
      if (req.role === 'retailer') {
        const producer = await ProducerStore.findBySub(order.producerSub);
        res.json({ order, business: producer });
      }
    } else {
      res.status(404).json({
        message: 'Order not found',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Order fetch error',
      error: err,
    });
  }
};

exports.placeOrder = async (req, res, next) => {
  try {
    const newOrder = await OrderStore.placeOrder(
      req.user.sub, req.body.producerSub, req.body.orderItems,
    );

    UserStore.addNotification(req.body.producerSub, notificationTypes.newOrder, newOrder._id, req.user.sub);
    return res.json(newOrder);
  } catch (err) {
    res.status(500).send({
      message: 'Order placement error',
      error: err,
    });
    return next(err);
  }
};

exports.editOrder = async (req, res) => {
  try {
    const order = await OrderStore.editOrder(req.params.orderId, req.body);
    const notifiedSub = req.role === 'producer' ? order.retailerSub : order.producerSub;
    UserStore.addNotification(
      notifiedSub,
      notificationTypes.orderStatusChange,
      order._id,
      req.user.sub,
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: 'Order update error',
      error: err,
    });
  }
};

exports.addOrderMessage = async (req, res) => {
  try {
    const order = await OrderStore.addOrderMessage(
      req.params.orderId,
      req.user.sub,
      req.role,
      req.body,
    );
    const notifiedSub = req.role === 'producer' ? order.retailerSub : order.producerSub;

    UserStore.addNotification(
      notifiedSub,
      notificationTypes.newOrderMessage,
      order._id,
      req.user.sub,
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: 'Order add message error',
      error: err,
    });
  }
};
