import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUserRole } from "../users/userRole/getUserRole";

export async function GET(request) {
  const supabase = await createClient();

  const userRole = await getUserRole();

  const allowedRoles = ["admin", "super admin"];

  if (!allowedRoles.includes(userRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("list_tables");

  const tableNames = data.map((table) => table.tablename);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(tableNames);
}

/**
 * 
 [
  {
    "tablename": "roles"
  },
  {
    "tablename": "profiles"
  },
  {
    "tablename": "requirements_logs"
  },
  {
    "tablename": "file_types"
  },
  {
    "tablename": "reports"
  },
  {
    "tablename": "entities"
  },
  {
    "tablename": "permissions"
  },
  {
    "tablename": "required_formats"
  },
  {
    "tablename": "requirements"
  },
  {
    "tablename": "entities_requirements"
  }
]
 */
