// const AWS = require('aws-sdk');

// const cloudFront = new AWS.CloudFront({ region: 'eu-west-2' });

// const parameters = {
//   DistributionId: 'E1TSEVNB7W8R7X', /* required */
//   InvalidationBatch: { /* required */
//     CallerReference: new Date().toString(), /* required */
//     Paths: { /* required */
//       Quantity: 1, /* required */
//       Items: ['/images/google-oauth2|111022946565379782477'],
//     },
//   },
// };

const convert = 'google-oauth2|111022946565379782477';

const test = 'google-oauth2%7C111022946565379782477';

console.log(test === encodeURI(convert));

// cloudFront.createInvalidation(parameters, (e, d) => {
//   if (e) console.log(e, e.stack); // an error occurred
//   else console.log('SUCCESS?', d); // successful response
// });
