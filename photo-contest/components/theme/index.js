import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Text from '../text';

export default function ThemeAnnouncement({ theme, icon }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center w-[150px] h-[150px] relative rounded-[10px] transition-opacity duration-1000 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center justify-center text-center w-full h-full gap-2">
        <Image
          src={`/assets/icons/categories/${icon}.svg`}
          alt={icon}
          width={100}
          height={100}
          style={{ filter: 'invert(94%) sepia(0%) saturate(0%) hue-rotate(99deg) brightness(102%) contrast(103%)' }}
        />
        <Text
          size="16px"
          weight="600"
          color="#F8F8F8"
        >
          {theme}
        </Text>
      </div>
    </div>
  );
}

ThemeAnnouncement.propTypes = {
  theme: PropTypes.string.isRequired,
  icon: PropTypes.oneOf([
    'activity', 'aesthetic', 'agriculture', 'anatomy', 'architecture', 'art', 'astronomy', 'automotive',
    'biology', 'business', 'character trait', 'collectibles', 'color', 'commerce', 'communication', 'concept',
    'daily life', 'demographic', 'education', 'emotion', 'entertainment', 'environment', 'events', 'fashion',
    'film', 'food', 'furniture', 'geography', 'hardware', 'healthcare', 'heritage', 'history', 'hobbies', 'holiday',
    'industry', 'infrastructure', 'kitchen', 'law', 'lighting', 'material', 'mathematics', 'media', 'military', 'music',
    'mythology', 'nature', 'navigation', 'philosophy', 'photography', 'profession', 'psychology', 'recreation', 'retail',
    'safety', 'science', 'science fiction', 'social', 'sociology', 'sport', 'sustainability', 'symbol', 'technology',
    'time', 'toys', 'transportation', 'unusual', 'urban', 'wellness'
  ]).isRequired,
};