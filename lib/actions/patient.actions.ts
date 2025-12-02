"use server";

import { uploadIdentificationDocument } from "../cloudinary";
import Patient from "../models/Patient";
import User from "../models/User";
import connectDB from "../mongodb";
import { parseStringify } from "../utils";

// CREATE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    await connectDB();

    // Try to create new user directly
    // If email exists, MongoDB will throw a duplicate key error
    const newUser = await User.create({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });

    return parseStringify(newUser);
  } catch (error: any) {
    // Check if it's a duplicate key error (user already exists)
    if (error.code === 11000) {
      // Find and return existing user by email using lean() to avoid cursor issues
      const existingUser = await User.findOne({ email: user.email }).lean();
      return parseStringify(existingUser);
    }
    
    console.error("An error occurred while creating a new user:", error);
    throw error;
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    await connectDB();

    const user = await User.findById(userId).lean();

    if (!user) {
      throw new Error("User not found");
    }

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
    throw error;
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    await connectDB();

    let identificationDocumentUrl = null;
    let identificationDocumentId = null;

    // Upload identification document to Cloudinary if provided
    if (identificationDocument) {
      const file = identificationDocument.get("blobFile") as File;

      if (file) {
        const uploadResult = await uploadIdentificationDocument(file);
        identificationDocumentUrl = uploadResult.secure_url;
        identificationDocumentId = uploadResult.public_id;
      }
    }

    // Create new patient document
    const newPatient = await Patient.create({
      userId: patient.userId,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      birthDate: patient.birthDate,
      gender: patient.gender,
      address: patient.address,
      occupation: patient.occupation,
      emergencyContactName: patient.emergencyContactName,
      emergencyContactNumber: patient.emergencyContactNumber,
      primaryPhysician: patient.primaryPhysician,
      insuranceProvider: patient.insuranceProvider,
      insurancePolicyNumber: patient.insurancePolicyNumber,
      allergies: patient.allergies || "",
      currentMedication: patient.currentMedication || "",
      familyMedicalHistory: patient.familyMedicalHistory || "",
      pastMedicalHistory: patient.pastMedicalHistory || "",
      identificationType: patient.identificationType || "",
      identificationNumber: patient.identificationNumber || "",
      identificationDocumentId,
      identificationDocumentUrl,
      privacyConsent: patient.privacyConsent,
    });

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
    throw error;
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    await connectDB();

    const patient = await Patient.findOne({ userId }).lean();

    return parseStringify(patient);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
    throw error;
  }
};
