"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Layout, Button, Typography, Carousel, Flex, Card } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useAtomValue } from "jotai";
import { carouselContentAtom, HomeCardsAtom } from "@/utils/atoms";
import "@ant-design/v5-patch-for-react-19";
import HomeCarousel from "@/components/HomeCarousel";
import PrimaryButton from "@/components/PrimaryButton";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const carouselItems = useAtomValue(carouselContentAtom);
  const cardsItens = useAtomValue(HomeCardsAtom);

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

        {/* Features Section with Cards */}
        <div className="py-16 px-8 bg-terciary">
          <div className="max-w-6xl mx-auto">
            <Flex wrap="wrap" gap="large" justify="center">
              {cardsItens.map((feature, index) => (
                <Card
                  key={index}
                  className="w-[350px] shadow-md hover:shadow-lg transition-shadow"
                  bordered={false}
                >
                  <Flex vertical gap="middle" align="start">
                    {feature.icon && (
                      <div className="text-3xl text-primary">
                        {feature.icon}
                      </div>
                    )}
                    <Title level={3} className="text-primary mb-2 font-bold">
                      {feature.title}
                    </Title>
                    <Text className="text-quaternary text-base">
                      {feature.desc}
                    </Text>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </div>
        </div>

        <div className="bg-gradient-to-r from-secondary to-white/180 text-white py-20 px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Title level={2} className="text-white drop-shadow-lg">
              Impulsa tu Negocio al Siguiente Nivel
            </Title>
            <Text className="text-white text-xl opacity-90 block drop-shadow-md">
              Descubre cómo nuestras soluciones pueden transformar tu empresa.
              ¿Listo para dar el siguiente paso?
            </Text>
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
