/* eslint-disable no-underscore-dangle */
const UserStore = require('../stores/userStore');
const OrderStore = require('../stores/orderStore');
const ProducerStore = require('../stores/producerStore');
const RetailerStore = require('../stores/retailerStore');
const { NOTIFICATION_TYPES } = require('../constants');
const { sendRetailerOrderEmail, sendProducerOrderEmail } = require('../email/email');

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
          const user = await UserStore.findBySub(order.producerSub);
          return { ...producer, ...user };
        }));
        res.json({ orders: orders.reverse(), businesses: producers.reverse() });
      }
    } else {
      res.status(404).json({
        message: 'No orders found',
      });
    }
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({
      message: 'Order fetch error',
      error: err,
    });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const newOrder = await OrderStore.placeOrder(
      req.user.sub, req.body.producerSub, req.body.orderItems,
    );
    UserStore.addNotification(
      req.body.producerSub,
      NOTIFICATION_TYPES.newOrder,
      newOrder._id,
      req.user.sub,
    );
    const producer = await ProducerStore.findBySub(req.body.producerSub);
    const retailer = await RetailerStore.findBySub(req.user.sub);
    sendProducerOrderEmail(producer, newOrder, retailer);
    res.json({ order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Order placement error',
      error: err,
    });
  }
};

exports.editOrder = async (req, res) => {
  try {
    console.log('EDIT');
    const order = await OrderStore.editOrder(req.params.orderId, req.body, req.role);
    const retailer = await RetailerStore.findBySub(order.retailerSub);
    const producer = await ProducerStore.findBySub(order.producerSub);

    const notifiedSub = req.role === 'producer' ? order.retailerSub : order.producerSub;
    if (order.status === 'Cancelled') {
      await UserStore.deleteNotificationsById(notifiedSub, order._id);
    }
    UserStore.addNotification(
      notifiedSub,
      NOTIFICATION_TYPES.orderStatusChange,
      order._id,
      req.user.sub,
    );
    if (req.role === 'producer') {
      console.log('PRODUCER');
      if (order.status === 'Confirmed') {
        console.log('SENDING EMAIL');
        sendRetailerOrderEmail(retailer, order, producer);
      }
      res.json({ order, business: retailer });
    }

    if (req.role === 'retailer') {
      res.json({ order, business: producer });
    }
  } catch (err) {
    console.log(err.message);
    if (err.message === 'This order is no longer active') {
      res.status(409).json({
        message: 'This order is no longer actice',
      });
      return;
    }
    res.status(500).json({
      message: 'Order update error',
      error: err,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await OrderStore.deleteOrder(req.params.orderId);
    // const notifiedSub = req.role === 'producer' ? order.retailerSub : order.producerSub;
    // UserStore.addNotification(
    //   notifiedSub,
    //   NOTIFICATION_TYPES.orderStatusChange,
    //   order._id,
    //   req.user.sub,
    // );
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Order delete error',
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
    OrderStore.editOrder(req.params.orderId, req.role === 'producer' ? { retailerNotification: true } : { producerNotification: true });

    UserStore.addNotification(
      notifiedSub,
      NOTIFICATION_TYPES.newOrderMessage,
      order._id,
      req.user.sub,
    );
    if (req.role === 'producer') {
      const purchaser = await RetailerStore.findBySub(order.retailerSub);
      res.json({ order, business: purchaser });
    }
    if (req.role === 'retailer') {
      const producer = await ProducerStore.findBySub(order.producerSub);
      res.json({ order, business: producer });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Order add message error',
      error: err,
    });
  }
};
