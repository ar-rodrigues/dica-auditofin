import { createClient } from "@/utils/supabase/server";

export async function createFile(file, bucket, fileName) {
  const supabase = await createClient();

  try {
    if (!file || !bucket || !fileName) {
      throw new Error("File, bucket and fileName are required");
    }

    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer);

    if (error) {
      throw error;
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return { url: publicUrl };
  } catch (error) {
    console.error("Storage error:", error);
    throw error;
  }
}

export async function deleteFile(fileUrl) {
  const supabase = await createClient();

  try {
    if (!fileUrl) {
      throw new Error("File URL is required");
    }

    const bucket = fileUrl.split("/").slice(3, 5).join("/");
    const fileName = fileUrl.split("/").slice(5).join("/");

    // Delete from Supabase Storage
    const { error } = await supabase.storage.from(bucket).remove([fileName]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Storage error:", error);
    throw error;
  }
}

export async function updateFile(file, fileUrl) {
  const supabase = await createClient();

  try {
    const bucket = fileUrl.split("/").slice(3, 5).join("/");
    const fileName = fileUrl.split("/").slice(5).join("/");

    if (!file || !bucket || !fileName) {
      throw new Error("File, bucket and fileName are required");
    }

    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Storage with upsert option
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return { url: publicUrl };
  } catch (error) {
    console.error("Storage error:", error);
    throw error;
  }
}
