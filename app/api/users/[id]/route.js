import { NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser, deleteProfile } from "../users";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams);

    const response = await getUserById(id, filters);

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          message: response.message || "Usuario no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/users/[id]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al obtener el usuario",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const response = await updateUser(id, data);

    if (!response.success) {
      return NextResponse.json(
        { success: false, message: response.message },
        { status: 404 }
      );
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/users/[id]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al actualizar el usuario",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const deletedProfile = await deleteProfile(id);

    if (!deletedProfile.success) {
      return NextResponse.json(
        {
          success: false,
          message: deletedProfile.message || "Error al eliminar el perfil",
        },
        { status: 500 }
      );
    }

    const deletedUser = await deleteUser(id);

    if (!deletedUser.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Perfil eliminado, pero no se pudo eliminar el usuario",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Usuario y perfil eliminados exitosamente",
        data: { deletedProfile, deletedUser },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/users/[id]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al eliminar el usuario",
      },
      { status: 500 }
    );
  }
}
