const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const getContacts = require("./router/getContacts");
const editContacts = require("./router/editContacts");
require("dotenv").config();

const URLdb = process.env.URLdb;
const PORT = process.env.PORT;

const myServer = class myMongoDBServer {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandler();
    await this.initDataBase();
    this.startListening();
  }
  initServer = () => {
    this.server = express();
  };
  initMiddlewares = () => {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(cors());
    this.server.use(morgan("combined"));
  };
  initRoutes = () => {
    this.server.use(express.static("public"));
    this.server.use("/contacts", getContacts);
    this.server.use("/contacts", editContacts);
    this.server.use("/auth", editContacts);
    this.server.use("/users", getContacts);
    this.server.use("/users", editContacts);
  };
  initErrorHandler = () => {
    this.server.use((err, req, res, next) => {
      console.error("Error:", err.message);
      res.status(500).send("Something wrong");
    });
  };
  initDataBase = async () => {
    try {
      await mongoose.connect(URLdb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Database connection successful");
    } catch (error) {
      console.log("Connecting error:", error.message);
      process.exit(1);
    }
  };
  startListening = () => {
    this.server.listen(3001, () => {
      console.log("server listening on port:", PORT);
    });
  };
};


new myServer().start();