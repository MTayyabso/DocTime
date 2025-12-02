import mongoose, { Schema, models } from 'mongoose';

const patientSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    emergencyContactName: {
      type: String,
      required: true,
    },
    emergencyContactNumber: {
      type: String,
      required: true,
    },
    primaryPhysician: {
      type: String,
      required: true,
    },
    insuranceProvider: {
      type: String,
      required: true,
    },
    insurancePolicyNumber: {
      type: String,
      required: true,
    },
    allergies: {
      type: String,
      default: '',
    },
    currentMedication: {
      type: String,
      default: '',
    },
    familyMedicalHistory: {
      type: String,
      default: '',
    },
    pastMedicalHistory: {
      type: String,
      default: '',
    },
    identificationType: {
      type: String,
      default: '',
    },
    identificationNumber: {
      type: String,
      default: '',
    },
    identificationDocumentId: {
      type: String,
      default: null,
    },
    identificationDocumentUrl: {
      type: String,
      default: null,
    },
    privacyConsent: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = models.Patient || mongoose.model('Patient', patientSchema);

export default Patient;
