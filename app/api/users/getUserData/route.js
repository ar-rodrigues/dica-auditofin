import { getUserData } from "./getUserData";
import { NextResponse } from "next/server";

export async function GET(request) {
  const userData = await getUserData();
  try {
    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
