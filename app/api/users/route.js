import { NextResponse } from "next/server";
import { createUser, getUsers } from "./users";

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
    const body = await request.json();
    const user = await createUser(body);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
