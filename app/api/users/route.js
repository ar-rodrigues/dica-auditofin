import { NextResponse } from "next/server";
import { createUser, getUsers, createProfile } from "./users";

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
  try {
    const newUserData = await request.json();
    const newUser = await createUser(newUserData);

    if (!newUser) {
      return NextResponse.json({ error: "User not created" }, { status: 500 });
    }

    const newProfile = await createProfile(newUser, newUserData);

    return NextResponse.json({ newProfile });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
