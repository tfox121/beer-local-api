const AWS = require('aws-sdk');

const s3 = new AWS.S3({ region: 'eu-west-2' });

const cloudFront = new AWS.CloudFront({ region: 'eu-west-2' });

exports.putImage = (req, res) => {
  const { sub } = req.user;
  const { type, productId } = req.body;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Fields: {
      key: type === 'product'
        ? `${sub}/${type}/${productId}.png`
        : `${sub}/${type}.png`,
    },
  };
  s3.createPresignedPost(params, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        message: 'Image put error',
        error: err,
      });
      return;
    }
    res.json(data);

    const parameters = {
      DistributionId: 'E1TSEVNB7W8R7X',
      InvalidationBatch: {
        CallerReference: new Date().toString(),
        Paths: {
          Quantity: 1,
          Items: [
            type === 'product'
              ? `/${encodeURI(sub)}/${type}/${productId}.png`
              : `/${encodeURI(sub)}/${type}.png`,
          ],
        },
      },
    };

    cloudFront.createInvalidation(parameters, (e, d) => {
      if (e) console.log(e, e.stack); // an error occurred
      else console.log(d); // successful response
    });
  });
};

// exports.getOwnImage = (req, res) => {
//   const userId = req.user.sub;

//   const params = { Bucket: process.env.AWS_BUCKET_NAME, Key: `${userId}/avatar.jpg` };

//   s3.getSignedUrl('getObject', params, (err, data) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({
//         message: 'Image get error',
//         error: err,
//       });
//     }
//     return res.json({ url: data });
//   });
// };
