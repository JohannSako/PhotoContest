import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import '@fontsource/inter';
import Text from '@/components/text';

export default function Carousel({ photos, setIndex }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex, setIndex]);

  const handleSwipe = (dir) => {
    if (dir === 'Left' && currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (dir === 'Right' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('Left'),
    onSwipedRight: () => handleSwipe('Right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="flex items-center justify-center overflow-hidden" {...swipeHandlers}>
      <div
        className="flex gap-6 transition-transform duration-300"
        style={{ transform: `translateX(${(window.innerWidth - 288) / 2 -currentIndex * (288 + 25)}px)` }}
      >
        {photos.map((photo, index) => (
          <div key={index} className="flex-shrink-0">
            <img src={photo.photo} alt={`Photo by ${photo.user.name}`} className="w-72 h-[494px] rounded-md" />
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
}
