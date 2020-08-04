const mjml2html = require('mjml');
const moment = require('moment');

const { PACK_SIZES } = require('../constants');

exports.orderProducer = (avatarSource, businessName, orderItems, orderNumber, orderDate, orderTotal, orderId, options) => mjml2html(`
  <mjml>
    <mj-head>
      <mj-style>
        .white-background img {
          background-color: white !important;
          min-width: 120px;
          max-width: 120px;
          max-height: 120px;
          border-radius: 100px;
        }
      </mj-style>
    </mj-head>
    <mj-body background-color="#ffffff">
        <mj-hero
        mode="fixed-height"
        height="190px"
        background-height="190px"
        background-url="https://beerlocal-dev.s3.eu-west-2.amazonaws.com/emailHeader.jpg"
        background-color="#2a3448"
        padding-left="10px"
        padding-right="10px"
        padding-top="20px"
        padding-bottom="20px"
        >
        <!-- <mj-image css-class="white-background" border-radius="100px" width="150px" height="150px" src="https://beerlocal-dev.s3.eu-west-2.amazonaws.com/blank-avatar.webp" border="2px solid white" alt="" ></mj-image> -->
      </mj-hero>
      <mj-section background-color="#598392" padding-bottom="5px" padding-top="0">
        <mj-column width="100%">
          <mj-divider border-color="#ffffff" border-width="2px" border-style="solid" padding-left="0px" padding-right="0px" padding-bottom="60px" padding-top="0"></mj-divider>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="0px">
            <span style="font-size:20px; font-weight:bold">An order has been submitted for approval.</span>
            <br/>
            <br/>
            <span style="font-size:15px">${businessName} has placed an order. Please find a summary below.</span>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#598392" padding-bottom="15px">
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Order Number</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">#SO-${orderNumber.toString().padStart(6, '0')}</mj-text>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Order Date</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${moment(orderDate).format('LL')}</mj-text>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Estimated Total</strong></mj-text>
          <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">£${orderTotal.toFixed(2)}</mj-text>
        </mj-column>
      </mj-section>
      
      ${orderItems.map((orderItem) => (
    `<mj-section background-color="#124559" padding-bottom="15px">
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="0px" padding-bottom="0px" padding-top="10px">${orderItem.name} (${PACK_SIZES[orderItem.packSize]})</mj-text>
      </mj-column>
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${orderItem.orderQuant}</mj-text>
      </mj-column>
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">£${orderItem.price.toFixed(2)}</mj-text>
      </mj-column>
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">£${(orderItem.price * orderItem.orderQuant).toFixed(2)}</mj-text>
      </mj-column>
    </mj-section>`
  ))}
      <mj-section background-color="#598392" padding-bottom="0px" padding-top="0">
        <mj-column width="100%">
          <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-top="28px">
            <span style="font-size:15px">Please either confirm or reject the order by following the 'View Online' link below and clicking the appropriate button.</span>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#598392">
        <mj-column width="50%">
          <mj-button background-color="#ffae00" color="#FFF" font-size="14px" align="center" font-weight="bold" border="none" padding="15px 30px" border-radius="10px" href="${process.env.CLIENT_URL}/order/${orderId}" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="10px">View Online</mj-button>
        </mj-column>
        <mj-column width="50%">
          <mj-button background-color="#ffae00" color="#FFF" font-size="14px" align="center" font-weight="bold" border="none" padding="15px 30px" border-radius="10px" href="${process.env.CLIENT_URL}/sales/orders" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="12px">My Orders</mj-button>
        </mj-column>
      </mj-section>
      <mj-section background-color="#598392" padding-bottom="5px" padding-top="0">
        <mj-column width="100%">
          <mj-divider border-color="#ffffff" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
          <mj-text align="center" color="#FFF" font-size="15px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="20px">Best,
            <br/>
            <br/>
            <span style="font-size:15px">The BeerLocal Team</span></mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `, options);
