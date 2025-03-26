"use client";
import "@ant-design/v5-patch-for-react-19";

import { Button, Result } from "antd";

export default function DashboardNotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Lo sentimos, la página que visitaste no existe."
      extra={
        <Button type="primary" onClick={() => window.history.back()}>
          Regresar
        </Button>
      }
    />
  );
}
