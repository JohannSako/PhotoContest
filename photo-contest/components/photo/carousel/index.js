import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Text from '@/components/text';

export default function Carousel({ photos, setIndex }) {
  const handleSlideChange = (swiper) => {
    setIndex(swiper.activeIndex);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
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
                src={photo.photo}
                alt={`Photo by ${photo.user.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-end mt-2">
              <Text size="22px" weight="700" color="white">
                {photo.user.name}
              </Text>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}