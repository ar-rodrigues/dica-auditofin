import { NextResponse } from "next/server";
import { createUser, getUsers, createProfile, deleteUser } from "./users";

export async function GET() {
  try {
    const users = await getUsers();
    //console.log(users);
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  let newUser = null;

  try {
    const newUserData = await request.json();

    // Step 1: Create the user
    newUser = await createUser(newUserData);
    if (!newUser) {
      return NextResponse.json(
        { error: "No se pudo crear el usuario" },
        { status: 500 }
      );
    }

    // Step 2: Create the profile
    const newProfile = await createProfile(newUser, newUserData);
    if (!newProfile) {
      // If profile creation fails, delete the user and return error
      await deleteUser(newUser.id);
      return NextResponse.json(
        {
          error:
            "No se pudo crear el perfil del usuario. El usuario ha sido eliminado.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Usuario y perfil creados exitosamente",
        profile: newProfile,
      },
      { status: 201 }
    );
  } catch (error) {
    // If any error occurs and we have a user, clean up
    if (newUser) {
      await deleteUser(newUser.id);
    }
    return NextResponse.json(
      {
        error: `Error en el proceso de creación: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
