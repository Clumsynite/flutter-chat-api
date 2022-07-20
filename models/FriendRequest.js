const mongoose = require("mongoose");

const FriendRequestSchema = mongoose.Schema(
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

const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);

module.exports = FriendRequest;
