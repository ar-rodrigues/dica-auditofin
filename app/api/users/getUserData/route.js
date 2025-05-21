import { getUserData } from "./getUserData";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const userData = await getUserData();
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al obtener datos del usuario",
      },
      { status: 500 }
    );
  }
}
