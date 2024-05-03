import React from 'react';

const CameraList = ({ cameras }) => {
  return (
    <div className="container mx-auto w-full">
      <h1 className="text-2xl font-bold mb-4">Camera List</h1>
      <div className="flex flex-col gap-4">
        {cameras.map(camera => (
          <div key={camera.id} className="bg-white rounded-lg shadow-md p-4 w-96 mx-auto">
            <h2 className="text-lg font-bold mb-2">{camera.name}</h2>
            <p><span className="font-semibold">IP:</span> {camera.ip}</p>
            <p><span className="font-semibold">Status:</span> {camera.status}</p>
            <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Action
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CameraList;
