import React, { useId, useState } from 'react';

const ToggleButton = ({className, isToggled ,handleClick}) => {
  const id = useId()
  const handleToggle = (e) => {
    e.stopPropagation();
    const value = !isToggled
    handleClick(value);
  };

  return (
      <div className={`flex items-center ${className}`}>
        <input
          type="checkbox"
          id={id}
          className="hidden"
          checked={isToggled}
          onChange={handleToggle}
        />
        <label htmlFor={id} className="cursor-pointer">
          <div className="relative">
            <div className={`w-14 h-8 ${isToggled ? 'bg-green-500' : 'bg-gray-300'} rounded-full shadow-inner`}></div>
            <div className={`dot absolute w-6 h-6 bg-white rounded-full shadow left-1 top-1 transition-transform ${isToggled ? 'transform translate-x-full' : 'transform translate-x-0'}`}></div>
          </div>
        </label>
      </div>
  );
};

export default ToggleButton;
