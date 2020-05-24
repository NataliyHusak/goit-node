const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class AuthActions {
  constructor() {
    this.COUNT_FACTOR = 7;
  }
  createToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET);

  passwordHash = (password) => bcrypt.hash(password, this.COUNT_FACTOR);

  verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

  validationPassword = (password, originalPassword) =>
    bcrypt.compare(password, originalPassword);
}
module.exports = new AuthActions();
