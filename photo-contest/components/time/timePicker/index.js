import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Text from '@/components/text';

export default function TimePicker({ cancelPicker, savePicker, time }) {
  const currentHour = Number(time.getHours().toLocaleString());
  const [hours, setHours] = useState((currentHour === 0 || currentHour === 12) ? 12 : currentHour % 12);
  const [minutes, setMinutes] = useState(Number(time.getMinutes().toLocaleString()));
  const [seconds, setSeconds] = useState(0);
  const [meridiem, setMeridiem] = useState(currentHour < 12 ? "AM" : "PM");

  const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const hoursRange = range(1, 12);
  const minutesRange = range(0, 59);
  const secondsRange = range(0, 59);

  const updateMeridiem = () => {
    setMeridiem((prevMeridiem) => (prevMeridiem === "AM" ? "PM" : "AM"));
  };

  const updateValue = (type, value) => {
    if (type === 'hour') {
      setHours(value);
    } else if (type === 'minute') {
      setMinutes(value);
    } else if (type === 'second') {
      setSeconds(value);
    }
  };

  const renderMeridiem = () => (
    <div className="flex flex-col items-center gap-8">
      <div className="cursor-pointer transition-transform duration-300 ease-in-out opacity-0 h-[30px]"></div>
      {["AM", "PM"].map((value, index) => (
        <div
          key={index}
          className={`cursor-pointer transition-transform duration-300 ease-in-out ${
            value === meridiem ? 'text-[#5DB075] font-semibold' : 'text-[#4E4E4E] font-medium'
          }`}
          onClick={updateMeridiem}
        >
          <Text
            size="20px"
            weight={value === meridiem ? '600' : '500'}
            color={value === meridiem ? '#5DB075' : '#4E4E4E'}
          >
            {value}
          </Text>
        </div>
      ))}
    </div>
  );

  const renderColumn = (type, values, currentValue) => {
    const currentIndex = values.indexOf(currentValue);

    const displayValues = [
      values[(currentIndex - 1 + values.length) % values.length],
      values[currentIndex],
      values[(currentIndex + 1) % values.length]
    ];

    return (
      <div className="flex flex-col items-center gap-8">
        {displayValues.map((value, index) => (
          <div
            key={index}
            className={`cursor-pointer transition-transform duration-300 ease-in-out ${
              value === currentValue ? 'text-[#5DB075] font-semibold' : 'text-[#4E4E4E] font-medium'
            }`}
            onClick={() => updateValue(type, value)}
          >
            <Text
              size="20px"
              weight={value === currentValue ? '600' : '500'}
              color={value === currentValue ? '#5DB075' : '#4E4E4E'}
            >
              {String(value).padStart(2, '0')}
            </Text>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative flex items-center justify-center w-full h-screen">
      <div className="absolute w-[319px] h-[342px] bg-[#219B68] opacity-60 blur-[150px] top-[calc(0px)] right-[calc(-230px)]"></div>
      <div className="absolute w-[421px] h-[421px] bg-[#219B68] opacity-30 blur-[150px] bottom-[calc(-140px)] left-[calc(-215px)]"></div>
      <div className="w-[343px] h-[346px] bg-white flex flex-shrink-0 backdrop-blur-lg rounded-lg flex-col pt-2 pb-4 px-4 z-10">
        <div className="flex w-full py-3 text-start">
          <Text color="#5DB075" size="20px" weight="600">Set time</Text>
        </div>
        <div className="relative flex w-full h-[168px] justify-center items-center gap-8 mt-[10px]">
          {renderColumn('hour', hoursRange, hours)}
          {renderColumn('minute', minutesRange, minutes)}
          {renderColumn('second', secondsRange, seconds)}
          {renderMeridiem()}
          <div className="absolute w-[262px] h-[1px] bg-[#8B8B8B] top-[52px] transform -translate-y-1/2"></div>
          <div className="absolute w-[262px] h-[1px] bg-[#8B8B8B] bottom-[52px] transform -translate-y-1/2"></div>
        </div>
        <div className="flex flex-row gap-4 mt-auto">
          <div className="w-[148px] h-14 flex flex-shrink-0 rounded-xl border-solid border-[1px] border-[#4E4E4E] active:opacity-50 items-center justify-center" onClick={cancelPicker}>
            <Text color="#5DB075" weight="500">Cancel</Text>
          </div>
          <div className="w-[148px] h-14 flex flex-shrink-0 bg-primary rounded-xl active:opacity-50 items-center justify-center" onClick={() => {savePicker(new Date(`1970-01-01T${(meridiem === 'PM' && hours !== 12 ? hours + 12 : meridiem === 'AM' && hours === 12 ? 0 : hours).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`));}}>
            <Text color="#FFFFFF" weight="500">Save</Text>
          </div>
        </div>
      </div>
    </div>
  );
}

TimePicker.propTypes = {
  cancelPicker: PropTypes.func.isRequired,
  savePicker: PropTypes.func.isRequired,
  initialHours: PropTypes.number,
  initialMinutes: PropTypes.number,
  initialSeconds: PropTypes.number,
};
