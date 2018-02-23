import { Promise } from "meteor/promise";
import { Facebook, FacebookApiException } from "fb";

const options = {
  version: "v2.11",
  client_id: Meteor.settings.facebook.clientId,
  client_secret: Meteor.settings.facebook.clientSecret
};

const _fb = new Facebook(options);

const UsersHelpers = {
  supervise({ userId }) {
    check(userId, String);
    logger.info("UsersHelpers.supervise: called", { userId });
    const user = Meteor.users.findOne(userId);
  },
  exchangeFBToken({ token }) {
    check(token, String);
    const response = Promise.await(
      _fb.api(
        "oauth/access_token",
        Object.assign(
          {
            grant_type: "fb_exchange_token",
            fb_exchange_token: token
          },
          options
        )
      )
    );
    return { result: response.access_token };
  },
  getUserAdAccounts({ token }) {
    check(token, String);
    let response = Promise.await(
      _fb.api("me/adaccounts", {
        fields: ["account_id", "users"],
        access_token: token
      })
    );
    // Filter admin accounts only
    const user = this.getUserByToken({ token });
    const result = response.data.filter(adAccount => {
      // return adAccount.users.data.find(u => {
      //   return (
      //     u.id == user.services.facebook.id && u.permissions.indexOf(1) !== -1
      //   );
      // });
      return true;
    });
    return { result };
  },
  getUserByToken({ token }) {
    check(token, String);
    return Meteor.users.findOne({
      "services.facebook.accessToken": token
    });
  }
};

exports.UsersHelpers = UsersHelpers;
