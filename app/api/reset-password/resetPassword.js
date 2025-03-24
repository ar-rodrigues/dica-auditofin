import { createClient } from "@/utils/supabase/server";

export async function resetPassword(email, baseUrl) {
  const supabase = await createClient();

  console.log("email", email);
  console.log("baseUrl", baseUrl);

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    // data is an empty object
    // error is an object with a message property

    if (!error) {
      return { data, success: true };
    }

    return { data, success: false };
  } catch (error) {
    console.error(error);
  }
}
