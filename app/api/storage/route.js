import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  const supabase = await createClient();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const bucket = formData.get("bucket");
    const fileName = formData.get("fileName");

    if (!file || !bucket) {
      return NextResponse.json(
        { error: "File and bucket are required" },
        { status: 400 }
      );
    }

    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer);

    console.log("data", data);
    console.log("error", error);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Storage error:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
