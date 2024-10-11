"use client";

import Text from "@/components/text";
import Button from "@/components/input/button";
import CheckBox from "@/components/input/checkBox";
import { useState } from "react";
import TextInput from "@/components/input/text";
import SearchInput from "@/components/input/search";
import TimeSetDefault from "@/components/time/timeSet/default";
import TimeSetDuo from "@/components/time/timeSet/duo";
import TimeSetCheck from "@/components/time/timeSet/check";
import Category from "@/components/category";

export default function SplashScreen() {
  const [firstLocalCheckBox, setFirstLocalCheckBox] = useState(false);
  const [secondLocalCheckBox, setSecondLocalCheckBox] = useState(false);
  const [value, setValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(true);

  const handleClick = () => {
    alert('Button clicked!');
  };

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex justify-center items-center text-center flex-col gap-5 m-10">
      <Text>hello</Text>
      <Button text="Click Me" onClick={handleClick} type="primary" />
      <Button text="Click Me" onClick={handleClick} type="secondary" />
      <Button text="Click Me" onClick={handleClick} type="disabled" />
      <Button text="Click Me" onClick={handleClick} type="delete" />
      <CheckBox text="Click here" state={firstLocalCheckBox} setState={setFirstLocalCheckBox}/>
      <TextInput placeholder="Name" value={value} onChange={handleInputChange} type="password" />
      <SearchInput placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
      <TimeSetDefault onClick={handleClick} />
      <TimeSetDuo firstOnClick={handleClick} secondOnClick={handleClick} />
      <TimeSetCheck setState={setSecondLocalCheckBox} state={secondLocalCheckBox} onClick={handleClick} />
      <Category text="Heritage" icon='heritage' state={category} setState={setCategory} />
    </div>
  );
}