import React from 'react';
import '@fontsource/quicksand';
import '@fontsource/quattrocento-sans';

export default function IconSlogan({}) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-white text-center font-quicksand text-[36px] font-normal leading-normal">
        PhotoContest
      </p>
      <p className="text-white text-center font-quattrocento text-[16px] italic font-normal leading-normal">
        Snap, Share, Succeed
      </p>
    </div>
  );
};