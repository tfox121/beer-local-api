/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const { CONTACT_EMAIL } = require('../constants');
const { welcomeEmail } = require('./welcome.js');
const { orderRetailer } = require('./orderRetailer');

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
  // proxy: 'http://user:pass@localhost:8080', // optional proxy, default is false
};

const mjmlConfigDefault = {
  keepComments: false,
  beautify: false,
  minify: true,
  validationLevel: 'strict',
};

// exports.sendOrderEmail = (from, to, order) => {
//   const nodemailerMailgun = nodemailer.createTransport(mg(auth));

//   nodemailerMailgun.sendMail({
//     from: `beerLocal - ${from.businessName} <${from.salesEmail}>`,
//     to: to.purchasingEmail, // An array if you have multiple recipients.
//     cc: '',
//     bcc: '',
//     subject: `Order Confirmed SO-${order.orderNumber.toString().padStart(6, '0')}`,
//     // 'h:Reply-To': 'reply2this@company.com',
//     // You can use "html:" to send HTML email content. It's magic!
//     html: `<b>
//     Thanks for the order ${this.toString.businessName}.
//     Your order is confirmed.
//     </b>
//     <br>
//     Your order:
//     <br>
//     <ul>
//     ${order.items.map((orderItem) => (
//     `<li>${orderItem.orderQuant}x ${orderItem.name} - ${PACK_SIZES[orderItem.packSize]} - £${Number(orderItem.price).toFixed(2)}</li>`
//   ))}
//     </ul>
//     <br>
//     Estimated total: £{Number(order.items.reduce((acc, val) => { acc += (val.orderChange !== 'delete' && val.price * val.orderQuant); return acc; }, 0)).toFixed(2)}
//     `,
//     // You can use "text:" to send plain-text content. It's oldschool!
//     // text: 'Mailgun rocks, pow pow!'
//   }, (err, info) => {
//     if (err) {
//       console.log('Error', err);
//     } else {
//       console.log('Response', info);
//     }
//   });
// };

exports.sendWelcomeEmail = (to) => {
  const nodemailerMailgun = nodemailer.createTransport(mg(auth));

  console.log('TO:', to);

  const mjmlOptions = {
    ...mjmlConfigDefault,
  };

  try {
    const { html, errors } = welcomeEmail(
      to.primaryContactName, to.businessName, CONTACT_EMAIL, mjmlOptions,
    );

    console.log('HTML ERRORS:', errors);

    nodemailerMailgun.sendMail({
      from: `beerLocal <${CONTACT_EMAIL}>`,
      to: to.purchasingEmail || to.salesEmail, // An array if you have multiple recipients.
      cc: '',
      bcc: '',
      subject: 'Welcome to BeerLocal',
      // 'h:Reply-To': 'reply2this@company.com',
      // You can use "html:" to send HTML email content. It's magic!
      html,
    // You can use "text:" to send plain-text content. It's oldschool!
    // text: 'Mailgun rocks, pow pow!'
    }, (err, info) => {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('Response', info);
      }
    });
  } catch (err) {
    console.error(err);
  }
};

exports.sendRetailerOrderEmail = (to, order, producer) => {
  const nodemailerMailgun = nodemailer.createTransport(mg(auth));

  console.log('TO:', to);

  const mjmlOptions = {
    ...mjmlConfigDefault,
  };

  const orderTotal = order.items.reduce((acc, val) => { acc += (val.orderChange !== 'delete' && val.price * val.orderQuant); return acc; }, 0);

  try {
    const { html, errors } = orderRetailer(
      producer.avatarSource,
      producer.bannerSource,
      producer.businessName,
      order.items,
      order.orderNumber,
      order.createdAt,
      orderTotal,
      order._id,
      mjmlOptions,
    );

    console.log('HTML ERRORS:', errors);

    nodemailerMailgun.sendMail({
      from: `${producer.businessName} - BeerLocal <${producer.salesEmail}>`,
      to: to.purchasingEmail, // An array if you have multiple recipients.
      cc: '',
      bcc: '',
      subject: `Order Confirmed - SO-${order.orderNumber.toString().padStart(6, '0')}`,
      // 'h:Reply-To': 'reply2this@company.com',
      // You can use "html:" to send HTML email content. It's magic!
      html,
      // You can use "text:" to send plain-text content. It's oldschool!
      // text: 'Mailgun rocks, pow pow!'
    }, (err, info) => {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('Response', info);
      }
    });
  } catch (err) {
    console.error(err);
  }
};

exports.sendProducerOrderEmail = (to, order, retailer) => {
  const nodemailerMailgun = nodemailer.createTransport(mg(auth));

  console.log('TO:', to);

  const mjmlOptions = {
    ...mjmlConfigDefault,
  };

  try {
    const { html, errors } = orderRetailer(
      retailer.avatarSource,
      retailer.businessName,
      order.items,
      order.orderNumber,
      order.createdAt,
      order.items.reduce((acc, val) => { acc += (val.orderChange !== 'delete' && val.price * val.orderQuant); return acc; }, 0),
      order._id,
      mjmlOptions,
    );

    console.log('HTML ERRORS:', errors);

    nodemailerMailgun.sendMail({
      from: `${retailer.businessName} - BeerLocal <${retailer.purchasingEmail}>`,
      to: to.salesEmail, // An array if you have multiple recipients.
      cc: '',
      bcc: '',
      subject: `New Order - SO-${order.orderNumber.toString().padStart(6, '0')}`,
      // 'h:Reply-To': 'reply2this@company.com',
      // You can use "html:" to send HTML email content. It's magic!
      html,
      // You can use "text:" to send plain-text content. It's oldschool!
      // text: 'Mailgun rocks, pow pow!'
    }, (err, info) => {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('Response', info);
      }
    });
  } catch (err) {
    console.error(err);
  }
};
