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
import Day from "@/components/calendar/day";
import Month from "@/components/calendar/month";
import Profile from "@/components/content/profile";
import SearchResult from "@/components/content/searchResult";
import Header from "@/components/header";
import Icon from "@/components/icon/default";
import IconSlogan from "@/components/icon/slogan";
import Carousel from "@/components/photo/carousel";
import Like from "@/components/photo/like";
import Upload from "@/components/photo/upload";
import PopUp from "@/components/popUp";
import SegmentedControl from "@/components/segmentedControl";
import ThemeAnnouncement from "@/components/theme";
import TimePicker from "@/components/time/timePicker";

const photos = [
  { photo: "https://i.pinimg.com/736x/2e/38/43/2e38438c65ca396f092734971db1ff2d.jpg", user: { name: "Author 1" } },
  { photo: "https://i.pinimg.com/236x/76/4d/03/764d037d3d591b2206ae19c8f2c6965e.jpg", user: { name: "Author 2" } },
  { photo: "https://i.pinimg.com/236x/6e/27/fc/6e27fc74ba09ed33b58bfb9c30f4c1b4.jpg", user: { name: "Author 3" } },
];


export default function SplashScreen() {
  const [firstLocalCheckBox, setFirstLocalCheckBox] = useState(false);
  const [secondLocalCheckBox, setSecondLocalCheckBox] = useState(false);
  const [value, setValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(true);
  const [like, setLike] = useState(false);
  const [controlIndex, setControlIndex] = useState(0);
  const [time, setTime] = useState(new Date());

  const handleClick = () => {
    alert('Button clicked!');
  };

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLikeChange = (like) => {
    setLike(like);
  }

  const contests = [
    { date: new Date('2024-07-03').getTime(), photo: 'https://i.pinimg.com/564x/67/03/15/6703150dd51bb57c7ec3c6c486d96793.jpg', id: 'this is the first' },
    { date: new Date('2024-07-20').getTime(), photo: 'https://i.pinimg.com/736x/bd/f4/37/bdf4378348a8ecae43d2c72b0b3bb41b.jpg', id: 'this is the second' },
  ];

  const savePicker = (time) => {
    alert(time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds());
  }

  return (
    <div className="flex justify-center items-center text-center flex-col gap-5">
      <div className="bg-primary">
        <ThemeAnnouncement icon="philosophy" theme="The Theme" />
      </div>
      <Text>hello</Text>
      <Button text="Click Me" onClick={handleClick} type="primary" />
      <Button text="Click Me" onClick={handleClick} type="secondary" />
      <Button text="Click Me" onClick={handleClick} type="disabled" />
      <Button text="Click Me" onClick={handleClick} type="delete" />
      <CheckBox text="Click here" state={firstLocalCheckBox} setState={setFirstLocalCheckBox} />
      <TextInput placeholder="Name" value={value} onChange={handleInputChange} type="default" />
      <TextInput placeholder="Password" value={value} onChange={handleInputChange} type="password" />
      <SearchInput placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
      <TimeSetDefault onClick={handleClick} />
      <TimeSetDuo firstOnClick={handleClick} secondOnClick={handleClick} />
      <TimeSetCheck setState={setSecondLocalCheckBox} state={secondLocalCheckBox} onClick={handleClick} />
      <Category text="Heritage" icon='heritage' state={category} setState={setCategory} />
      <div className="bg-primary flex w-full items-center flex-col gap-5 py-4">
        <Day day={1} state="EMPTY" onClick={handleClick} />
        <Day day={2} state="IMAGE" image="https://i.pinimg.com/564x/3d/57/58/3d5758a7d4175f0d4b596b3f6c18adcc.jpg" onClick={handleClick} />
        <Day day={3} state="TODAY" onClick={handleClick} />
        <Month contests={contests} monthYear="July 2024" />
      </div>
      <Profile name="Paulo" picture="https://i.pinimg.com/564x/29/4a/d1/294ad19d54c64276d0e89dae2dd8f276.jpg" bin={handleClick} />
      <SearchResult result="Here the results" calendar={handleClick} bin={handleClick} />
      <Header title="Home" left="Settings" right="Add Game" leftFunction={handleClick} rightFunction={handleClick} />
      <Header title="Sign Up" left="left" leftFunction={handleClick} />
      <Header title="Sign Up" right="right" rightFunction={handleClick} />
      <Header title="Sign Up" />
      <div className="flex bg-primary items-center flex-col">
        <Icon />
        <IconSlogan />
        <Carousel photos={photos} />
        <Like setLike={handleLikeChange} like={like} />
      </div>
      <Upload />
      <div className="m-4 items-center justify-center">
        <PopUp
          title="Congratulations !"
          content="Consequat velit qui adipisicing sunt do reprehenderit ad laborum tempor ullamco exercitation. Ullamco tempor adipisicing et voluptate duis sit esse aliqua esse ex dolore esse. Consequat velit qui adipisicing sunt."
          firstButton={handleClick}
          firstTextButton="Click me"
          secondButton={handleClick}
          secondTextButton="Cancel"
        />
      </div>
      <SegmentedControl firstText="Search" secondText="Search" index={controlIndex} setIndex={setControlIndex} />
      <div className="bg-white flex w-[400px] h-[400px] my-[200px] items-center justify-center">
        <TimePicker cancelPicker={handleClick} savePicker={savePicker} time={time} />
      </div>
    </div>
  );
}