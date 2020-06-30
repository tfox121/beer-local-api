const User = require('../models/user');

module.exports = class AuthStore {
  // add new user to database
  // static async createGoogleUser({ id, displayName, name, emails, photos }) {
  //   console.log('Creating user');
  //   const newUser = new User({
  //     socialId: id,
  //     displayName,
  //     name,
  //     email: emails[0] && emails[0].value,
  //     googleProfilePicture: photos[0] && photos[0].value,
  //   });
  //   return newUser.save();
  // }

  // find user by social social id
  static async getUser(id) {
    return User.findById(id).exec();
  }

  // add new user if they don't exist or update if they do
  static async googleFindUpdateCreate({
    id,
    displayName,
    name,
    emails,
    photos,
  }) {
    const updates = {
      socialId: id,
      displayName,
      name,
      email: emails[0] && emails[0].value,
      googleProfilePicture: photos[0] && photos[0].value,
    };
    return User.findOneAndUpdate(id, updates, { upsert: true });
  }

  static async auth0FindUpdateCreate({
    id,
    displayName,
    name,
    emails,
    picture,
    locale,
  }) {
    const updates = {
      oauth_id: id,
      displayName,
      name,
      email: emails[0] && emails[0].value,
      picture,
      locale,
    };
    return User.findOneAndUpdate({ oauth_id: id }, updates, { upsert: true });
  }
};
