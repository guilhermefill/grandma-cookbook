const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      lowercase:true,
    },
    password: {
      type: String,
      required: true,
    },
    cookbook:[{type: Schema.Types.ObjectId, ref:'Recipe'}],
    avatar: {
      type: String,
      default: "https://i.imgur.com/VVDEmog.png"
    }
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
