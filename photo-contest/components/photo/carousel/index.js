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
              // Définit une taille standard pour chaque slide
              width: '60vw',     // 50% de la largeur de la fenêtre
              height: '60vh',    // 70% de la hauteur de la fenêtre
              maxWidth: '600px', // Optionnel : on limite la taille max si besoin
              maxHeight: '700px' // Optionnel : limite la taille max
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