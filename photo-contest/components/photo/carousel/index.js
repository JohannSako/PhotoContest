import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import '@fontsource/inter';
import Text from '@/components/text';

export default function Carousel({ photos, setIndex }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [minimumStart, setMinimumStart] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMinimumStart((window.innerWidth - 288) / 2);
    }
  }, []);

  const handleSwipe = ({ dir }) => {
    if (dir === 'Left') {
      setCurrentIndex((currentIndex + 1) % photos.length);
      setIndex((currentIndex + 1) % photos.length)
    } else if (dir === 'Right') {
      setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);
      setIndex((currentIndex - 1 + photos.length) % photos.length)
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe({ dir: 'Left' }),
    onSwipedRight: () => handleSwipe({ dir: 'Right' }),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="flex items-center justify-center overflow-hidden" {...swipeHandlers}>
      <div
        className="flex gap-6 transition-transform duration-300"
        style={{ transform: `translateX(${minimumStart - currentIndex * (288 + 25)}px)` }}
      >
        {photos.map((photo, index) => (
          <div key={index} className="flex-shrink-0">
            <img src={photo.photo} alt={`Photo by ${photo.user.name}`} className="flex w-72 h-[494px] rounded-md" />
            <div className="flex justify-end">
              <Text size="22px" weight="700" color="white">
                {photo.user.name}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
