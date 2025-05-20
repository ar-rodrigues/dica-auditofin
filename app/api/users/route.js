import { NextResponse } from "next/server";
import {
  createUser,
  getUsers,
  createProfile,
  deleteUser,
  deleteProfile,
} from "./users";
import { sendWelcomeEmail } from "../../../utils/mailer/mailer";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams);
    const response = await getUsers(filters);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al obtener usuarios",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  let newUser = null;
  let newProfile = null;

  try {
    const newUserData = await request.json();
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Step 1: Create the user
    try {
      newUser = await createUser(newUserData);
      if (!newUser) {
        throw new Error("No se pudo crear el usuario");
      }
    } catch (userError) {
      console.error("Error creating user:", userError);
      throw new Error(`Error al crear el usuario: ${userError.message}`);
    }

    // Step 2: Create the profile
    try {
      newProfile = await createProfile(newUser, newUserData);
    } catch (profileError) {
      console.error("Profile creation error:", profileError);
      // If profile creation fails, clean up the user
      if (newUser) {
        try {
          await deleteUser(newUser.id);
        } catch (cleanupError) {
          console.error("Error cleaning up user:", cleanupError);
        }
      }
      throw new Error(`Error al crear el perfil: ${profileError.message}`);
    }

    // Step 3: Send welcome email
    try {
      await sendWelcomeEmail(
        newUserData.email,
        `${newUserData.first_name} ${newUserData.last_name}`,
        newUserData.password,
        baseUrl
      );
      console.log("Welcome email sent successfully");
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // If email sending fails, clean up both user and profile
      if (newUser) {
        try {
          // First delete the profile
          await deleteProfile(newUser.id);

          // Then delete the user
          await deleteUser(newUser.id);
        } catch (cleanupError) {
          console.error(
            "Error during cleanup after email failure:",
            cleanupError
          );
        }
      }
      throw new Error(
        `Error al enviar el correo de bienvenida: ${emailError.message}`
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Usuario y perfil creados exitosamente",
        data: newProfile,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/users:", error);

    // If any error occurs and we have a user, clean up both user and profile
    if (newUser) {
      try {
        // First try to delete the profile if it exists
        if (newProfile) {
          await deleteProfile(newUser.id);
        }
        // Then delete the user
        await deleteUser(newUser.id);
      } catch (cleanupError) {
        console.error("Error during cleanup:", cleanupError);
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: `Error en el proceso de creación: ${error.message}`,
        error: error.stack,
      },
      { status: 500 }
    );
  }
}
