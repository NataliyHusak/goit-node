const express = require("express");
const authActions = require("../controllers/actions");
const router = express.Router();

router.post(
  "/auth/register",
  validations.validateRequest,
  authActions.createUser
);
router.post("/auth/login", validations.validateRequest, authActions.login);
router.post("/auth/logout", validations.validateRequest, authActions.logout);
router.get(
  "/users/current",
  validations.validateRequest,
  authActions.currentUsers
);
