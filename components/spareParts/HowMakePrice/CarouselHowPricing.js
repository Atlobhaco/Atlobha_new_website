import { Box } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

function CarouselHowPricing({ handleSelect, activeIndex }) {
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
        controls={false}
        indicators={false}
        activeIndex={activeIndex}
        onSelect={handleSelect}
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
              width: "12px",
              height: "12px",
              margin: "0 5px",
              borderRadius: "50%",
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
