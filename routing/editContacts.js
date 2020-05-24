const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const validations = require("../controllers/validation");

router.post(
  "/register",
  validations.validateRequest,
  userController.createUser
);

router.post("/login", validations.validateSignIn, userController.loginUser);

router.post("/logout", userController.validateToken, userController.logout);

router.post("/avatar", userController.writeAvatar(), (req, res) =>
  console.log(res.send("Avatar was added"))
);

router.delete("/:contactId", userController.removeContact);

router.patch(
  "/avatars",
  userController.validateToken,
  userController.multerHandler(),
  userController.updateAllFieldsContact
);

router.patch(
  "/:contactId",
  userController.validateToken,
  userController.updateContact
);

module.exports = router;
