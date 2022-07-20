const mongoose = require("mongoose");

const RequestSchema = mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    // status: {
    //   type: String,
    //   enum: ["PENDING", "ACCEPTED", "REJECTED"],
    //   default: "PENDING",
    // },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;
