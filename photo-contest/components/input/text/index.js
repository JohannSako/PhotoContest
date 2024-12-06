import React, { useState } from 'react';
import "../../../app/globals.css";

export default function TextInput({ placeholder = 'Enter text', value, onChange, show = false, type = "default" }) {
    const [showPassword, setShowPassword] = useState(show);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative w-[343px] h-[50px] flex-shrink-0">
            <input
                type={showPassword ? "password" : "text"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full h-full bg-white-6 border border-gray-02 placeholder-placeholder text-text-black px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-02 input-placeholder pr-20"
            />
            {type == "password" ? <span
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-green-primary font-medium text-16 leading-normal"
            >
                {showPassword ? "Show" : "Hide"}
            </span> : <></>}
        </div>
    );
}