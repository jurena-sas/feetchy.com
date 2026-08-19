"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/swiper.css";

const UPLOADS_BASE = "https://www.laceter.com/uploads";

const Slider = ({ lang = "fr", initialSlides = [] }) => {
  const slides = initialSlides;

  if (!slides.length) return null;

  return (
    <div className="slider-area slider-area-2">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        loop={slides.length > 1}
        speed={800}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        className="feetchy-slider"
      >
        {slides.map((slide, index) => {
          const content = slide?.[lang] || slide?.fr || {};
          const image = slide?.file;
          const buttonUrl =
            slide?.buttonUrls?.[lang] || slide?.buttonUrls?.fr || "/";

          return (
            <SwiperSlide key={index}>
              <div className="single-slide">
                {image && (
                  <div className="slider_img">
                    <img
                      src={`${UPLOADS_BASE}/${image}`}
                      alt={content?.content_1 || `slide-${index + 1}`}
                    />
                  </div>
                )}

                <div className={`slide-caption slide_all_${index + 1} home-2`}>
                  {content?.content_1 && (
                    <h1 className="wow bounceInUp">{content.content_1}</h1>
                  )}

                  {content?.content_2 && (
                    <h3 className="wow bounceInUp">{content.content_2}</h3>
                  )}

                  {content?.content_3 && (
                    <h2
                      className="wow bounceInUp"
                      dangerouslySetInnerHTML={{ __html: content.content_3 }}
                    />
                  )}

                  {content?.btn_1_title && (
                    <div className="slider-btn home-2 wow bounceInUp">
                      <Link href={buttonUrl}>{content.btn_1_title}</Link>
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Slider;
