import { forwardRef } from 'react';
import { IoSearch } from "react-icons/io5";

const InputSearch = ({ handleSearch }, ref) => {
  return (
    <div className="flex items-center max-w-[180px] border border-gray-300 rounded-3xl overflow-hidden">
      <button className="p-3 bg-white text-gray-800">
        <IoSearch className="text-gray-600" />
      </button>
      <input
        ref={ref}
        type="text"
        placeholder="Ex: 08:56"
        className="p-2 w-full focus:outline-none"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
    </div>
  );
};

export default forwardRef(InputSearch);
