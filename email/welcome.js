const mjml2html = require('mjml');

exports.welcomeEmail = (primaryContactName, businessName, supportEmail, options) => mjml2html(`
  <mjml>
    <mj-body background-color="#ffffff">
      <mj-section background-color="#ffffff" padding-bottom="0px" padding-top="0">
        <mj-column vertical-align="top" width="100%">
          <mj-image src="https://beerlocal-dev.s3.eu-west-2.amazonaws.com/emailHeader.jpg" alt="" align="center" border="none" width="600px" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="0"></mj-image>
        </mj-column>
      </mj-section>
      <mj-section background-color="#598392" padding-bottom="0px" padding-top="0">
        <mj-column vertical-align="top" width="100%">
          <mj-text align="left" color="#EFF6E0" font-size="35px" font-weight="bold" font-family="open Sans Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="10px" padding-top="50px">Welcome aboard!</mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#598392" padding-bottom="20px" padding-top="5px">
        <mj-column vertical-align="middle" width="100%">
          <mj-text align="left" color="#EFF6E0" font-size="22px" font-family="open Sans Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px"><span style="color:#EEF7FC">Hi ${primaryContactName},</span><br /><br /> Thanks for bringing ${businessName} to BeerLocal.</mj-text>
          <mj-text align="left" color="#EFF6E0" font-size="15px" line-height="20px" font-family="open Sans Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px">We&apos;re really excited you&apos;ve decided to give us a try. In case you have any questions, feel free to reach out to us at ${supportEmail}. Otherwise, check out the website by following the link below.</mj-text>
          <mj-button align="left" font-size="22px" font-weight="bold" background-color="#ffffff" border-radius="10px" color="#124559" font-family="open Sans Helvetica, Arial, sans-serif" rel="noreferrer" target="_blank" href="http://localhost:3000">Go!</mj-button>
          <mj-text align="left" color="#EEF7FC" font-size="15px" font-family="open Sans Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px">Thanks, <br /><br /> The BeerLocal Team</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`, options);
