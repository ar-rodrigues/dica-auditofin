import { resetPassword } from "./resetPassword";
import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const { email } = await request.json();

    const { success, error } = await resetPassword(email, baseUrl);

    if (!success) {
      return NextResponse.json(
        { error: "Error al enviar el correo" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
