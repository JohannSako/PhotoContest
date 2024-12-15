import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Text from '@/components/text';
import Image from 'next/image';

export default function Carousel({ photos, setIndex, onlyURL = false }) {
  const handleSlideChange = (swiper) => {
    setIndex(swiper.activeIndex);
  };

  return (
    <div className="flex">
      <Swiper
        onSlideChange={handleSlideChange}
        centeredSlides={true}
        slidesPerView="auto"
        spaceBetween={25}
        grabCursor={true}
        className="mySwiper"
      >
        {photos.map((photo, index) => (
          <SwiperSlide
            key={index}
            style={{
              width: '60vw',
              height: '60vh',
              maxWidth: '600px',
              maxHeight: '700px'
            }}
          >
            <div className="w-full h-full overflow-hidden rounded-md">
              <img
                src={onlyURL ? photo : photo.photo}
                alt={`Photo by ${onlyURL ? 'Unknown' : photo.user.name}`}
                className={onlyURL ? "w-full h-full" : "w-full h-full object-cover"}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}