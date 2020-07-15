const AWS = require('aws-sdk');

const s3 = new AWS.S3({ region: 'eu-west-2' });

exports.putImage = (req, res) => {
  const userId = req.user.sub;
  const { extension, type, productId } = req.body;
  console.log(extension, type, productId);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Fields: {
      key: type === 'product'
        ? `${userId}/${type}/${productId}.${extension}`
        : `${userId}/${type}.${extension}`,
    },
  };
  s3.createPresignedPost(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Image put error',
        error: err,
      });
    }
    return res.json(data);
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
