import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardContent from "@/components/DashboardContent";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return <DashboardContent />;
}
