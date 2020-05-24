const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;
mongoose.set("useFindAndModify", false);
const itemSchema = new Schema({
  email: String,
  name: String,
  avatarURL: String,
  password: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: String,
});
itemSchema.plugin(mongoosePaginate);
const itemModel = mongoose.model("collection_for_hws", itemSchema);
module.exports = itemModel;
