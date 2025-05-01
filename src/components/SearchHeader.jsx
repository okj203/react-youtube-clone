import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BsYoutube, BsSearch } from 'react-icons/bs';
import { useDarkMode } from '../context/DarkModeContext';
import { HiMoon, HiSun } from 'react-icons/hi';

export default function SearchHeader() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [text, setText] = useState('');
  const { keyword } = useParams();
  const navigate = useNavigate();
  const handleChange = (e) => setText(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    setText('');
    navigate(`/videos/${text}`);
  };

  useEffect(() => setText(keyword ? keyword : ''), [keyword]);

  return (
    <header className="w-full flex p-4 text-2xl border-b border-zinc-600 mb-4">
      <Link to="/" className="flex items-center">
        <BsYoutube className="text-brand text-4xl" />
        <h1 className="font-bold ml-2 text-3xl">YouTube</h1>
      </Link>
      <form className="w-full flex justify-center" onSubmit={handleSubmit}>
        <input
          className="w-7/12 p-2 outline-none bg-zinc-300 dark:bg-black dark:text-gray-50"
          value={text}
          type="text"
          placeholder="Search"
          onChange={handleChange}
        />
        <button className="bg-zinc-400 dark:bg-zinc-600 px-4">
          <BsSearch />
        </button>
      </form>
      <button className="text-[2.5rem] bg-transparent dark:text-white mr-4 transition-all duration-150 ease-out hover:scale-[1.3] hover:text-yellow-400 dark:hover:text-orange-400" onClick={toggleDarkMode}>
        {darkMode ? <HiSun /> : <HiMoon />}
      </button>
    </header>
  );
}
