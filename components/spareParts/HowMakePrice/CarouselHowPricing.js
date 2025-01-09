import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

function CarouselHowPricing({ handleSelect, activeIndex, setActiveIndex }) {
  const { locale } = useLocalization();
  const [hovered, setHovered] = useState(false);
  const [carouselInterval, setCarouselInterval] = useState(3000); // Default interval is 3 seconds

  const slides = [
    {
      src: "/imgs/price-tutorial-1.svg",
      alt: "Slide 1",
      caption: "First Slide",
    },
    {
      src: "/imgs/price-tutorial-2.svg",
      alt: "Slide 2",
      caption: "Second Slide",
    },
    {
      src: "/imgs/price-tutorial-3.svg",
      alt: "Slide 3",
      caption: "Third Slide",
    },
    {
      src: "/imgs/price-tutorial-4.svg",
      alt: "Slide 4",
      caption: "Fourth Slide",
    },
  ];

  const handleButtonClick = (index) => {
    // Call the passed handleSelect function
    handleSelect(index);

    // Set interval to 5 seconds
    setCarouselInterval(5000);

    // Revert interval back to 3 seconds after 5 seconds
    setTimeout(() => {
      setCarouselInterval(3000);
    }, 5000);
  };

  return (
    <Box>
      <Carousel
        fade
        slide={true}
        interval={hovered ? null : carouselInterval} // Dynamic interval based on hover and state
        // controls={false}
        indicators={false}
        activeIndex={activeIndex}
        // onSelect={handleSelect}
        prevIcon={
          <span
            onClick={() =>
              setActiveIndex((prevIndex) =>
                locale === "en"
                  ? (prevIndex + 1) % slides.length
                  : (prevIndex - 1 + slides.length) % slides.length
              )
            }
            className="custom-prev-icon"
            style={{
              display: "inline-block",
              width: "30px",
              height: "30px",
              backgroundColor: "transparent",
              borderRadius: "50%",
              lineHeight: "30px",
              textAlign: "center",
              color: "#000",
              fontSize: "45px",
            }}
          >
            {/* {locale === "ar" ? "›" : "‹"} */}‹
          </span>
        }
        nextIcon={
          <span
            onClick={() =>
              setActiveIndex((prevIndex) => {
                return locale === "en"
                  ? (prevIndex - 1 + slides.length) % slides.length
                  : (prevIndex + 1) % slides.length;
              })
            }
            className="custom-next-icon"
            style={{
              display: "inline-block",
              width: "30px",
              height: "30px",
              backgroundColor: "transparent",
              borderRadius: "50%",
              lineHeight: "30px",
              textAlign: "center",
              color: "#000",
              fontSize: "45px",
            }}
          >
            {/* {locale !== "ar" ? "›" : "‹"} */}›
          </span>
        }
      >
        {slides.map((slide, index) => (
          <Carousel.Item
            key={index}
            onMouseEnter={() => setHovered(true)} // Pause on hover
            onMouseLeave={() => setHovered(false)} // Resume when hover ends
          >
            <Image
              width={335}
              height={200}
              className="d-block w-100"
              src={slide.src}
              alt={slide.alt}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(index)} // Adjust interval on click
            style={{
              width: "12px !important",
              height: "12px !important",
              maxWidth: "12px !important",
              maxHeight: "12px !important",
              margin: "0 5px",
              borderRadius: "50% !important",
              border: "none",
              backgroundColor: activeIndex === index ? "#000" : "#ccc",
              cursor: "pointer",
            }}
          ></button>
        ))}
      </div>
    </Box>
  );
}

export default CarouselHowPricing;
