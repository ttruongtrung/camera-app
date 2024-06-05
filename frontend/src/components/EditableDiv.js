import React, { useRef, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa6';
const EditableDiv = ({ content, setContent, divClassName, inputClassName }) => {
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef(null);

  const handleCheckClick = () => {
    setIsEditing(false);
    setContent(inputRef.current.value);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {isEditing ? (
          <FaCheck size={20} className="text-[#22c55e] cursor-pointer" onClick={handleCheckClick} />
    ) : (
          <FaRegEdit size={20} className="text-white cursor-pointer" onClick={() => setIsEditing(true)} />
      )}
      {isEditing ? (
        <input
          className={`${inputClassName} outline-none px-2 py-1 border rounded w-[140px] h-8`}
          type="text"
          ref={inputRef}
          defaultValue={content}
          autoFocus
        />
      ) : (
        <div className={divClassName}>{content}</div>
      )}
    </div>
  );
};

export default EditableDiv;
