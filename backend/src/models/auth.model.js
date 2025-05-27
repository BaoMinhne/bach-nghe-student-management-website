const knex = require("../database/knex");

const auth = {
  login: async (username, password) => {
    const user = await knex("system_user")
      .where("user_username", username)
      .andWhere("user_pass", password)
      .select("user_username", "user_role", "user_status", "user_id")
      .limit(1);

    if (user.length > 0) {
      return user[0];
    }
    return null;
  },

  checkAccount: async (username) => {
    const user = await knex("system_user")
      .where("user_name", username)
      .select("user_name")
      .first();
    return user || null;
  },

  register: async (RegisterData) => {
    return knex("userInfo").insert({
      user_name: RegisterData.username,
      user_passwd: RegisterData.password,
      user_phoneNum: RegisterData.userPhone,
    });
  },
};

module.exports = auth;
