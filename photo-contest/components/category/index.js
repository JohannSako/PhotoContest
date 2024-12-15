import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Text from '../text';

export default function Category({ text, icon, state, setState }) {
  const textColor = state ? '#5DB075' : '#979797';
  const iconColor = state ? 'invert(61%) sepia(44%) saturate(416%) hue-rotate(85deg) brightness(93%) contrast(86%)' : 'invert(61%) sepia(29%) saturate(25%) hue-rotate(315deg) brightness(92%) contrast(93%)';
  const boxShadow = state ?  '0px 1px 4px 0px rgba(0, 0, 0, 0.25) inset' : '0px 1px 4px 0px rgba(0, 0, 0, 0.25)';

  return (
    <div
      className="w-[150px] h-[150px] flex-shrink-0 relative rounded-[10px]"
      style={{ boxShadow }}
      onClick={() => setState(!state)}
    >
      <div className="flex flex-col items-center justify-center w-full h-full relative gap-2">
        <Image
          src={`/assets/icons/categories/${icon}.svg`}
          alt={icon}
          width={80}
          height={80}
          style={{ filter: iconColor }}
          color='#5DB075'
        />
        <Text weight='500' color={textColor}>{text}</Text>
      </div>
    </div>
  );
};

Category.propTypes = {
  text: PropTypes.string.isRequired,
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
  state: PropTypes.bool.isRequired,
  setState: PropTypes.func.isRequired,
};