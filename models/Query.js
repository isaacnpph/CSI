const mongoose = require("mongoose");
const QuerySchema = new mongoose.Schema({
  addedIn: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  keyword: {
    type: String,
    required: true
  },
  addedBy: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Query = mongoose.model("Query", QuerySchema);
