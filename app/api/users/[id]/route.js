import { NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser, deleteProfile } from "../users";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const user = await getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const user = await updateUser(id, data);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const deletedProfile = await deleteProfile(id);

    if (!deletedProfile.success) {
      return NextResponse.json(
        { error: deletedProfile.message },
        { status: 500 }
      );
    }

    const deletedUser = await deleteUser(id);

    if (!deletedUser) {
      return NextResponse.json(
        { error: "Profile deleted, but user not deleted" },
        { status: 500 }
      );
    }
    return NextResponse.json({ deletedProfile, deletedUser });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
