import { Typography, Button } from "antd";

const { Title } = Typography;

export default function NotFoundContent({
  title,
  message,
  buttonText = "Volver atrás",
  buttonAction = () => window.history.back(),
  buttonStyles,
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-lg flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full">
          <Title level={3} className="text-red-600! mb-2">
            {title}
          </Title>
          <p className="text-gray-600 mb-6">{message}</p>
          <Button onClick={buttonAction} className={buttonStyles}>
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
