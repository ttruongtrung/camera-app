import { forwardRef } from 'react';
import { IoSearch } from "react-icons/io5";

const InputSearch = ({ handleSearch }, ref) => {
  return (
    <div className="flex items-center max-w-[300px] w-full border border-gray-300 rounded-3xl overflow-hidden">
      <IoSearch className="h-10 w-12 px-2 bg-white text-gray-600" />
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
