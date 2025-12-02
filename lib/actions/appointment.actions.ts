"use server";

import { revalidatePath } from "next/cache";

import { Appointment } from "@/types/appwrite.types";

import { sendEmailNotification, EmailTemplate } from "../mail";
import AppointmentModel from "../models/Appointment";
import connectDB from "../mongodb";
import { formatDateTime, parseStringify } from "../utils";

import { getUser } from "./patient.actions";

//  CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    await connectDB();

    const newAppointment = await AppointmentModel.create(appointment);

    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
    throw error;
  }
};

//  GET RECENT APPOINTMENTS
export const getRecentAppointmentList = async () => {
  try {
    await connectDB();

    // Try to get appointments, return empty array if fails
    let appointments: any[] = [];
    try {
      appointments = await AppointmentModel.find()
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    } catch (error) {
      console.log("No appointments found or cursor error, returning empty list");
      appointments = [];
    }

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments as unknown as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.length,
      ...counts,
      documents: appointments,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
    throw error;
  }
};



//  UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId,
  userId,
  timeZone,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    await connectDB();

    // Update appointment
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      appointment,
      { new: true }
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    const messageContent = `
    <p>Greetings from DocTime,</p>
    <p>${type === "schedule" ? `Your appointment is confirmed for <strong>${formatDateTime(appointment.schedule!, timeZone).dateTime}</strong> with <strong>Dr. ${appointment.primaryPhysician}</strong>.` : `We regret to inform that your appointment for <strong>${formatDateTime(appointment.schedule!, timeZone).dateTime}</strong> is cancelled.`}</p>
    ${type === "cancel" ? `<p>Reason: ${appointment.cancellationReason}</p>` : ''}
    `;

    const emailHtml = EmailTemplate(messageContent);

    const user = await getUser(userId);
    await sendEmailNotification(user.email, "Appointment Notification", emailHtml);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
    throw error;
  }
};

// GET APPOINTMENT
export const getAppointment = async (appointmentId: string) => {
  try {
    await connectDB();

    const appointment = await AppointmentModel.findById(appointmentId);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    return parseStringify(appointment);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing patient:",
      error
    );
    throw error;
  }
};
