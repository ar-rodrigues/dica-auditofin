import React from "react";
import { Carousel, Typography, Button } from "antd";
import PrimaryButton from "./PrimaryButton";

import Image from "next/image";
const { Title, Text } = Typography;
export default function HomeCarousel({
  speed,
  pauseOnHover,
  carouselItems,
  redirectRoute,
  containerStyles,
  buttonStyles,
  mounted,
  ...props
}) {
  return (
    <Carousel
      autoplay
      effect="fade"
      dots={true}
      className={`w-full carousel-container ${containerStyles}`}
      autoplaySpeed={speed}
      pauseOnHover={pauseOnHover}
    >
      {carouselItems.map((item, index) => (
        <div key={index}>
          <div className="relative min-h-[80vh]">
            {/* Image and overlay */}
            <div className="absolute inset-0">
              <Image
                src={item.image}
                alt={item.title}
                fill
                quality={100}
                style={{ objectFit: "cover" }}
                priority={index === 0}
                sizes="100vw"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${item.bgColor}`}
              />
            </div>

            {/* Content with improved visibility */}
            <div className="relative flex flex-col items-center justify-center min-h-[80vh]">
              <div
                className={`max-w-4xl mx-auto space-y-8 p-8 text-center transition-all duration-1000 
                    ${
                      mounted
                        ? "animate-fadeIn opacity-100 transform translate-y-0"
                        : "opacity-0 transform translate-y-4"
                    }
                    bg-primary/50 backdrop-blur-sm rounded-xl`}
              >
                <Title
                  level={1}
                  className="!text-white !text-5xl mb-0 font-bold drop-shadow-lg"
                >
                  {item.title}
                </Title>
                <Text className="!text-white !text-xl opacity-90 block drop-shadow-md">
                  {item.description}
                </Text>
                {/* <Button
                  type="primary"
                  size="large"
                  className={`!bg-secondary !text-white border-none hover:!bg-secondary/80 hover:scale-105 
                        transition-all duration-300 shadow-lg ${buttonStyles}`}
                  onClick={() => (window.location.href = redirectRoute)}
                >
                  {item.buttonText}
                </Button> */}
                <PrimaryButton
                  text={item.buttonText}
                  buttonStyles={buttonStyles}
                  handleClick={() => (window.location.href = redirectRoute)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}
