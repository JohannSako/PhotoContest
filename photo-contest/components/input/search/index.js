import React from 'react';
import "../../../app/globals.css";

export default function SearchInput({ placeholder = 'Search...', value, onChange }) {
  return (
    <div className="relative w-[343px] h-[50px] flex-shrink-0">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-full bg-white-6 border border-gray-02 rounded-full placeholder-placeholder text-text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-02 input-placeholder"
      />
    </div>
  );
}