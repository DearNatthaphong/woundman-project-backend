const cloudinary = require('../config/cloudinary');

exports.upload = async (path, publicId) => {
  const option = {
    use_filename: true,
    overwrite: true,
    unique_filename: false
  };

  if (publicId) {
    option.public_id = publicId;
  }

  const res = await cloudinary.uploader.upload(path, option);
  //   console.log(res);
  return res.secure_url;
};

// https://res.cloudinary.com/dsmhwz5jr/image/upload/v1694441461/169444145865132035375.jpg
exports.getPublicId = (url) => {
  const splitSlash = url.split('/');
  return splitSlash[splitSlash.length - 1].split('.')[0];
};
