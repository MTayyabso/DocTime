import mongoose, { Schema, models } from 'mongoose';

const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
    },
    image: {
      type: String,
      required: [true, 'Doctor image is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = models.Doctor || mongoose.model('Doctor', doctorSchema);

export default Doctor;
