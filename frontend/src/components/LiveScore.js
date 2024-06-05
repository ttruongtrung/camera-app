import { useState } from 'react';
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import EditableDiv from './EditableDiv';

const LiveScore = () => {
  const [totalMatch, setTotalMatch] = useState(1);
  const [match, setMatch] = useState({
    player1Name: 'Player 1',
    player2Name: 'Player 2',
    player1Score: 0,
    player2Score: 0,
    race: 10,
  });

  const handleIncreaseScore = (player) => {
    if (player === 1) {
      if (match.player1Score === match.race - 1) {
        // Add new match
      } else {
        setMatch({...match, player1Score: match.player1Score + 1});
      }
    }
    if (player === 2) {
      if (match.player2Score === match.race - 1) {
        // Add new match
      } else {
        setMatch({...match, player2Score: match.player2Score + 1});
      }
    }
  }

  const handleDecreaseScore = (player) => {
    if (player === 1 && match.player1Score > 0) {
        setMatch({...match, player1Score: match.player1Score - 1});
    }
    if (player === 2 && match.player2Score > 0) {
        setMatch({...match, player2Score: match.player2Score - 1});
    }
  }

  const handlePlayer1NameChange = (name) => {
    setMatch({...match, player1Name: name});
  }

  const handlePlayer2NameChange = (name) => {
    setMatch({...match, player1Name: name});
  }
  return (
    <div className="p-2 text-white">
      <div className="text-semibold text-xl text-center mb-4">
        Match {totalMatch}
      </div>
      {/* Score */}
      <div className="">
        <div className="grid grid-cols-[1fr_1fr] gap-10 justify-center mb-1">
          <EditableDiv content={match.player1Name} setContent={handlePlayer1NameChange} divClassName="text-center text-2xl text-[#0284c7]" inputClassName="text-[#0284c7]"/>
          <EditableDiv content={match.player2Name} setContent={handlePlayer2NameChange} divClassName="text-center text-2xl text-[#dc2626]" inputClassName="text-[#dc2626]"/>
        </div>
        <div className="text-center text-lg">Race: {match.race}</div>
        <div className="grid grid-cols-[1fr_1fr]">
          <div className="flex align-center">
            <div className="flex flex-col justify-center gap-4 px-2">
              <IoAddCircleOutline className="cursor-pointer" size={24} onClick={() => handleIncreaseScore(1)}/>
              <IoRemoveCircleOutline className="cursor-pointer" size={24} onClick={() => handleDecreaseScore(1)}/>
            </div>
            <div className="flex-1 text-center bg-[#0284c7] p-4 text-3xl rounded-tl rounded-bl">{match.player1Score}</div>
          </div>
          <div className="flex align-center">
            <div className="flex-1 text-center bg-[#ef4444] p-4 text-3xl rounded-tr rounded-br">{match.player2Score}</div>
            <div className="flex flex-col justify-center gap-4 px-2">
              <IoAddCircleOutline className="cursor-pointer" size={24} onClick={() => handleIncreaseScore(2)}/>
              <IoRemoveCircleOutline className="cursor-pointer" size={24} onClick={() => handleDecreaseScore(2)}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveScore;
