import mongoose, { Schema, models } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during hot reload
const User = models.User || mongoose.model('User', userSchema);

export default User;
