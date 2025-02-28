"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Layout, Button, Typography, Carousel } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useAtomValue } from "jotai";
import { carouselContentAtom } from "@/utils/atoms";
import "@ant-design/v5-patch-for-react-19";
import HomeCarousel from "@/components/HomeCarousel";
import PrimaryButton from "@/components/PrimaryButton";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const carouselItems = useAtomValue(carouselContentAtom);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const carousel = document.querySelector(".carousel-container");
      if (carousel) {
        carousel.style.height = `${window.innerHeight * 0.8}px`;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout className="min-h-screen bg-terciary">
      <Content>
        <HomeCarousel
          speed={2000}
          pauseOnHover={true}
          carouselItems={carouselItems}
          redirectRoute="/login"
          containerStyles=""
          buttonStyles="!bg-secondary !text-white"
          mounted={mounted}
        />

        {/* Features Section with improved contrast */}
        <div className="py-20 px-8 bg-terciary">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Innovación Tecnológica",
                desc: "Soluciones de vanguardia adaptadas a tus necesidades específicas",
              },
              {
                title: "Excelencia en Servicio",
                desc: "Comprometidos con los más altos estándares de calidad",
              },
              {
                title: "Experiencia Comprobada",
                desc: "Trayectoria sólida respaldada por casos de éxito",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 hover:transform hover:scale-105 transition-all duration-300 
                  cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl"
              >
                <Title level={3} className="text-primary mb-4 font-bold">
                  {feature.title}
                </Title>
                <Text className="text-quaternary text-lg">{feature.desc}</Text>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section with improved visibility */}
        <div className="bg-gradient-to-r from-secondary to-white/180 text-white py-20 px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Title level={2} className="text-white drop-shadow-lg">
              Impulsa tu Negocio al Siguiente Nivel
            </Title>
            <Text className="text-white text-xl opacity-90 block drop-shadow-md">
              Descubre cómo nuestras soluciones pueden transformar tu empresa.
              ¿Listo para dar el siguiente paso?
            </Text>
            {/* <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              className="!bg-primary !text-white border-none hover:!bg-white/80 hover:!text-primary hover:border-primary hover:shadow-lg
                hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Agenda una Consulta
            </Button> */}
            <PrimaryButton
              type={"primary"}
              size={"large"}
              icon={<ArrowRightOutlined />}
              text={"Agenda una Consulta"}
              buttonStyles={""}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
}
