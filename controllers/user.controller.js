const path = require("path");
const fsPromises = require("fs").promises;
const shortId = require("shortid");
const authActions = require("./authActions");
const actions = require("./actions");
const multer = require("multer");
const { createAvatar } = require("../helpers/avatar-builder");

exports.createUser = async (req, res, next) => {
  try {
    const { password, email, name, subscription } = req.body;
    const isEmail = await actions.findEmail(email);
    if (!isEmail) {
      const userAvatar = await createAvatar(email);
      const id = shortId();
      const avatarFileName = `${id}__${name}.png`;
      const avatarPath = path.join(
        __dirname,
        `../public/images/${avatarFileName}`
      );
      await fsPromises.writeFile(avatarPath, userAvatar);
      const avatarURL = `http://localhost:3001/images/${avatarFileName}`;

      const passwordHash = await authActions.passwordHash(password);
      const user = await actions.createUser(
        passwordHash,
        email,
        name,
        subscription,
        avatarURL
      );

      const token = authActions.createToken(user._id);
      await actions.findAndUpdate(user._id, { token });
      return res.status(201).json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } else {
      return res.status(400).json({
        message: "Email in use",
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.loginUser = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await actions.findEmail(email);
    if (!user) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }
    const isPasswordValid = await authActions.validationPassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }
    const token = authActions.createToken(user._id);
    await actions.findAndUpdate(user._id, { token: token });
    return res.status(200).send(token);
  } catch (error) {
    next(error);
  }
};
exports.logout = async (req, res, next) => {
  try {
    const user = await actions.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await actions.findAndUpdate(req.user._id, { token: null });
    return res.status(200).json({
      message: "Logout success",
    });
  } catch (error) {
    next(error);
  }
};
exports.validateToken = async (req, res, next) => {
  try {
    const token = req.get("authorization").replace("Bearer ", "");

    let userId;
    try {
      userId = authActions.verifyToken(token).id;
      const user = await actions.findById(userId);

      if (!user) {
        return res.status(401).json({ message: "Not authorized" });
      }

      if (user.token !== token) {
        return res.status(401).json({ message: "Not authorized" });
      }

      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  } catch (error) {
    next(error);
  }
};
exports.currentUser = async (req, res, next) => {
  try {
    const user = await actions.findById(req.body.id);
    const { email, subscription } = user;
    return res.status(200).json({
      email: email,
      subscription: subscription,
    });
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
    next(error);
  }
};
exports.listContacts = async (req, res, next) => {
  try {
    const { page, limit, sort } = req.query;
    const item = await actions.findAll(page, limit, sort);
    return res.status(200).json(item.docs);
  } catch (error) {
    next(error);
  }
};
exports.getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const user = await actions.findById(contactId);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};
exports.removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const item = await actions.findAndDelete({ _id: contactId });
    if (item) {
      return res.status(200).send({ message: "contact deleted" });
    } else {
      return res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};
exports.updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const newProperties = req.body;
    const user = await actions.findAndUpdate(contactId, newProperties);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};
exports.writeAvatar = () => {
  const storage = multer.diskStorage({
    destination: "public/images",
    filename: (req, file, cb) => {
      const { name, ext } = path.parse(file.originalname);
      cb(null, name + "__" + shortId() + ext);
    },
  });
  const upload = multer({ storage: storage });
  return upload.single("avatar");
};
exports.multerHandler = () => {
  const upload = multer();
  return upload.any();
};
exports.updateAllFieldsContact = async (req, res, next) => {
  try {
    const contactId = req.user.id;
    const newProperties = req.body;
    if (req.files.length) {
      const newAvatar = req.files[0].buffer;
      const avatarFileName = path.basename(req.user.avatarURL);
      const avatarPath = path.join(
        __dirname,
        `../public/images/${avatarFileName}`
      );
      await fsPromises.writeFile(avatarPath, newAvatar);
    }

    await actions.findAndUpdate(contactId, newProperties);
    return res.status(200).json({
      avatarURL: req.user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};
