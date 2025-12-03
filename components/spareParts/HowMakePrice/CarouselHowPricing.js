import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

function CarouselHowPricing({
  handleSelect,
  activeIndex,
  setActiveIndex,
  infoImgArray = [],
}) {
  const { locale } = useLocalization();
  const [hovered, setHovered] = useState(false);
  const [carouselInterval, setCarouselInterval] = useState(1500); // Default interval is 3 seconds

  const slides = (infoImgArray?.length && infoImgArray) || [
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
        onSelect={handleSelect}
        autoplay={true}
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
            <Box
              sx={{
                background: "white",
              }}
            >
              <Image
                loading="lazy"
                width={335}
                height={infoImgArray?.length ? 250 : 200}
                className="d-block w-100"
                src={slide.src}
                alt={slide.alt}
              />
            </Box>
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
          <Box
            key={index}
            onClick={() => handleButtonClick(index)} // Adjust interval on click
            style={{
              width: index === activeIndex ? "20px" : "11px",
              height: index === activeIndex ? "8px" : "11px",
              maxWidth: index === activeIndex ? "20px" : "11px",
              maxHeight: index === activeIndex ? "8px" : "11px",
              margin: index === activeIndex ? "2px 5px" : "0 5px",
              borderRadius: index === activeIndex ? "5px" : "50%",
              border: "none",
              backgroundColor: activeIndex === index ? "#000" : "#ccc",
              cursor: "pointer",
            }}
          ></Box>
        ))}
      </div>
    </Box>
  );
}

export default CarouselHowPricing;
