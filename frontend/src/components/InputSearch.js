import { forwardRef } from 'react';
import { FaSearch } from 'react-icons/fa';

const InputSearch = ({ handleSearch }, ref) => {
  return (
    <div className="flex items-center max-w-[190px] border border-gray-300 rounded-md overflow-hidden">
      <input
        ref={ref}
        type="text"
        placeholder="Ex: 08:56"
        className="p-2 w-full focus:outline-none"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      <button className="p-3 bg-blue-500 text-white hover:bg-blue-600">
        <FaSearch />
      </button>
    </div>
  );
};

export default forwardRef(InputSearch);
