import mongoose, { Schema, models } from 'mongoose';

const appointmentSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    schedule: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'cancelled'],
      default: 'pending',
      required: true,
    },
    primaryPhysician: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment =
  models.Appointment || mongoose.model('Appointment', appointmentSchema);

export default Appointment;
