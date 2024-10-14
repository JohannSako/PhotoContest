import React, { useState, useEffect } from 'react';
import Text from '@/components/text';

export default function SegmentedControl({ firstText, secondText, index = 0, setIndex }) {
  const [selectedIndex, setSelectedIndex] = useState(index);

  useEffect(() => {
    setSelectedIndex(index);
  }, [index]);

  const handleSegmentClick = (index) => {
    setSelectedIndex(index);
    setIndex(index);
  };

  return (
    <div className="w-[343px] h-[50px] flex items-center bg-[#F6F6F6] rounded-full border border-[#E8E8E8] relative">
      <div
        className={`absolute w-[171.5px] h-[46px] rounded-full bg-white transition-transform duration-300 ease-in-out ${
          selectedIndex === 1 ? 'transform translate-x-[168px]' : ''
        }`}
      />
      <div
        className={`flex items-center justify-center w-[171.5px] h-[46px] rounded-full cursor-pointer z-10 ${
          selectedIndex === 0 ? 'text-[#5DB075] font-semibold' : 'text-[#BDBDBD] font-medium'
        }`}
        onClick={() => handleSegmentClick(0)}
      >
        <Text size="16px" weight={selectedIndex === 0 ? '600' : '500'} color={selectedIndex === 0 ? '#5DB075' : '#BDBDBD'}>
          {firstText}
        </Text>
      </div>
      <div
        className={`flex items-center justify-center w-[171.5px] h-[46px] rounded-full cursor-pointer z-10 ${
          selectedIndex === 1 ? 'text-[#5DB075] font-semibold' : 'text-[#BDBDBD] font-medium'
        }`}
        onClick={() => handleSegmentClick(1)}
      >
        <Text size="16px" weight={selectedIndex === 1 ? '600' : '500'} color={selectedIndex === 1 ? '#5DB075' : '#BDBDBD'}>
          {secondText}
        </Text>
      </div>
    </div>
  );
}