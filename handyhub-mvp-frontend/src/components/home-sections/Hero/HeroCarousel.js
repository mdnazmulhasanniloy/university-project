"use client";

import React, { useRef, useState } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css/effect-coverflow";
import "./HeroCarousel.css";

// import required modules
import { EffectCoverflow, Autoplay } from "swiper/modules";

import swiperImg1 from "/public/images/home/hero/Image.png";
import swiperImg2 from "/public/images/home/hero/Image-1.png";
import swiperImg3 from "/public/images/home/hero/Image-2.png";
import swiperImg4 from "/public/images/home/hero/Image-4.png";

export default function CustomSwiper() {
  const sliderImages = [
    swiperImg1,
    swiperImg2,
    swiperImg4,
    swiperImg3,
    swiperImg1,
    swiperImg2,
    swiperImg4,
    swiperImg1,
  ];

  return (
    <Swiper
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={0.99}
      spaceBetween={10}
      initialSlide={3}
      speed={600}
      loop={true}
      coverflowEffect={{
        rotate: 10,
        stretch: 1,
        depth: 200,
        modifier: 1,
        slideShadows: true,
      }}
      modules={[EffectCoverflow, Autoplay]}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      className="overflow-hidden"
      breakpoints={{
        640: {
          slidesPerView: 1.6,
          spaceBetween: 28,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 32,
        },
        1024: {
          slidesPerView: 2.6,
          spaceBetween: 35,
        },
        1280: {
          slidesPerView: 3,
          spaceBetween: 42,
        },
        1536: {
          slidesPerView: 3.6,
          spaceBetween: 50,
        },
      }}
    >
      {sliderImages?.map((image, index) => (
        <SwiperSlide key={index}>
          <img src={image?.src} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
