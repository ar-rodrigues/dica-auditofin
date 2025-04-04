import { Col, Row } from "antd";
import ConfirmPassword from "@/components/ConfirmPassword";
import { createClient } from "@/utils/supabase/server";
import "../../globals.css";

export default async function ResetPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }

  return (
    <Row
      gutter={[16, 16]}
      style={{ padding: "5px" }}
      justify={"center"}
      align={"middle"}
    >
      <ConfirmPassword />
    </Row>
  );
}
