"use client";

import PrimaryButton from "@/components/PrimaryButton";
import { Typography } from "antd";
const { Title } = Typography;

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-lg flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full">
          <Title level={3} className="text-red-600! mb-2">
            No tienes permisos para acceder a esta página
          </Title>
          <p className="text-gray-600 mb-6">
            Si crees que deberías tener acceso a esta página, por favor contacta
            al administrador.
          </p>
          <PrimaryButton
            onClick={() => window.history.back()}
            type={"primary"}
            size={"large"}
            text={"Volver atrás"}
            buttonStyles={"bg-primary!"}
          />
        </div>
      </div>
    </div>
  );
}
