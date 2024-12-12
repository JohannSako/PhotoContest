import React from 'react';
import PropTypes from 'prop-types';
import Day from '../day';
import Text from '@/components/text';
import toast from "react-hot-toast";
import { useState } from 'react';

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfWeek = (month, year) => {
  return new Date(year, month, 1).getDay();
};

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Month({ monthNb, year, contests, handleClick }) {
  const month = new Date(`${months[monthNb - 1]} 1, ${year}`).getMonth();
  const daysInMonth = getDaysInMonth(month, year);
  let firstDayOfWeek = getFirstDayOfWeek(month, year) - 1;
  if (firstDayOfWeek === -1) firstDayOfWeek = 6;

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  for (let i = 0; i < firstDayOfWeek; i++) {
    days.unshift(null);
  }

  const contestsByDay = {};
  if (contests) {
    contests.forEach(contest => {
      const date = new Date(contest.date);
      const day = date.getDate();
      contestsByDay[day] = contest;
    });
  }

  const today = new Date();

  const isItToday = (day) => {
    return today.getUTCFullYear() == year && today.getUTCMonth() == month && today.getUTCDate() == day;
  }

  return (
    <div className='text-start'>
      <Text size="16px" weight="600" color="#FFF" style={{ fontVariantNumeric: 'slashed-zero' }}>{`${months[monthNb - 1]} ${year}`}</Text>
      <div className="text-center grid grid-cols-7 gap-2">
        {daysOfWeek.map(day => (
          <Text key={day} size="14px" weight="400" color="#FFF" style={{ fontVariantNumeric: 'slashed-zero' }} className="text-center">{day}</Text>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="w-[46px] h-[58px]"></div>;
          }

          const contest = contestsByDay[day];
          let state = contest && contest.photo ? 'IMAGE' : 'EMPTY';
          if (isItToday(day))
            state += 'TODAY';
          const image = (contest && contest.photo) ? contest.photo.photo : '';

          const checkClick = () => {
            if (contest) {
              handleClick(contest._id);
            }
          };

          return (
            <Day
              key={day}
              day={day}
              state={state}
              image={image}
              onClick={checkClick}
            />
          );
        })}
      </div>
    </div>
  );
};

Month.propTypes = {
  monthYear: PropTypes.string.isRequired,
  contests: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.number.isRequired,
      photo: PropTypes.string,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
};