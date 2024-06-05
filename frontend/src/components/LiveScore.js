import { forwardRef, useImperativeHandle, useState } from 'react';
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import EditableDiv from './EditableDiv';
import { format, set } from 'date-fns';

const LiveScore = (props, ref) => {
  const [totalMatch, setTotalMatch] = useState(1);
  const initMatch = {
    player1Name: 'Player 1',
    player2Name: 'Player 2',
    player1Score: 0,
    player2Score: 0,
    race: 10,
  };
  const [match, setMatch] = useState(initMatch);

  useImperativeHandle(ref, () => ({
    resetMatch() {
      setMatch(initMatch);
    },
  }));

  const [matches, setMatches] = useState([
    {
      player1Name: 'Player 1',
      player2Name: 'Player 2',
      player1Score: 10,
      player2Score: 0,
      race: 10,
      playerWin: 1,
      time: new Date(),
    },
    {
      player1Name: 'Player 1',
      player2Name: 'Player 2',
      player1Score: 0,
      player2Score: 0,
      race: 10,
      playerWin: 2,
      time: new Date(),
    },
  ]);

  const handleIncreaseScore = (player) => {
    const newMatch = { ...match };
    if (player === 1) {
      newMatch.player1Score = newMatch.player1Score + 1;
    }
    if (player === 2) {
      newMatch.player2Score = newMatch.player2Score + 1;
    }

    if (
      newMatch.player1Score === newMatch.race ||
      newMatch.player2Score === newMatch.race
    ) {
      // Add new match
      newMatch.time = new Date();
      newMatch.playerWin = newMatch.player1Score > newMatch.player2Score ? 1 : 2
      setMatches([...matches, newMatch]);
      setTotalMatch(totalMatch + 1);
      setMatch({
        ...initMatch,
        player1Name: newMatch.player1Name,
        player2Name: newMatch.player2Name,
        race: newMatch.race
      });
    } else {
      setMatch(newMatch);
    }
  };

  const handleDecreaseScore = (player) => {
    if (player === 1 && match.player1Score > 0) {
      setMatch({ ...match, player1Score: match.player1Score - 1 });
    }
    if (player === 2 && match.player2Score > 0) {
      setMatch({ ...match, player2Score: match.player2Score - 1 });
    }
  };

  const handlePlayer1NameChange = (name) => {
    setMatch({ ...match, player1Name: name });
  };

  const handlePlayer2NameChange = (name) => {
    setMatch({ ...match, player1Name: name });
  };

  const handleIncreaseRace = () => {
    setMatch({...match, race: match.race + 1});
  }

  const handleDecreaseRace = () => {
    if (match.race > 1) {
      setMatch({...match, race: match.race - 1});
    }
  }

  return (
    <div className="p-2 text-white">
      <div className="text-semibold text-xl text-center mb-4">
        Game {totalMatch}
      </div>
      {/* Score */}
      <div>
        <div className="grid grid-cols-[1fr_1fr] gap-10 justify-center mb-1">
          <EditableDiv
            content={match.player1Name}
            setContent={handlePlayer1NameChange}
            divClassName="text-center text-2xl text-[#0284c7]"
            inputClassName="text-[#0284c7]"
          />
          <EditableDiv
            content={match.player2Name}
            setContent={handlePlayer2NameChange}
            divClassName="text-center text-2xl text-[#dc2626]"
            inputClassName="text-[#dc2626]"
          />
        </div>
        <div className="text-center text-lg flex gap-4 justify-center">
          <IoRemoveCircleOutline
            className="cursor-pointer"
            size={24}
            onClick={handleDecreaseRace}
          />
          <span>Race: {match.race}</span>
          <IoAddCircleOutline
            className="cursor-pointer"
            size={24}
            onClick={handleIncreaseRace}
          />
        </div>
        <div className="grid grid-cols-[1fr_1fr]">
          <div className="flex align-center">
            <div className="flex flex-col justify-center gap-4 px-2">
              <IoAddCircleOutline
                className="cursor-pointer"
                size={24}
                onClick={() => handleIncreaseScore(1)}
              />
              <IoRemoveCircleOutline
                className="cursor-pointer"
                size={24}
                onClick={() => handleDecreaseScore(1)}
              />
            </div>
            <div className="flex-1 text-center bg-[#0284c7] p-4 text-3xl rounded-tl rounded-bl">
              {match.player1Score}
            </div>
          </div>
          <div className="flex align-center">
            <div className="flex-1 text-center bg-[#ef4444] p-4 text-3xl rounded-tr rounded-br">
              {match.player2Score}
            </div>
            <div className="flex flex-col justify-center gap-4 px-2">
              <IoAddCircleOutline
                className="cursor-pointer"
                size={24}
                onClick={() => handleIncreaseScore(2)}
              />
              <IoRemoveCircleOutline
                className="cursor-pointer"
                size={24}
                onClick={() => handleDecreaseScore(2)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 px-2">
        <div className="grid grid-cols-[repeat(4,1fr)] text-xl text-white bg-gray-400">
          <div className="p-4 text-center border border-[white]">Game</div>
          <div className="p-4 text-center border border-[white]">player 1</div>
          <div className="p-4 text-center border border-[white]">player 2</div>
          <div className="p-4 text-center border border-[white]">Time</div>
        </div>
        {matches.map((m, index) => (
          <div
            key={index}
            className={`grid grid-cols-[repeat(4,1fr)] text-xl text-white ${
              m.playerWin === 1 ? 'bg-[#0284c7]' : 'bg-[#ef4444]'
            }`}
          >
            <div className="p-4 text-center border border-[white]">
              {index + 1}
            </div>
            <div className="p-4 text-center border border-[white]">
              {m.player1Score}
            </div>
            <div className="p-4 text-center border border-[white]">
              {m.player2Score}
            </div>
            <div className="p-4 text-center border border-[white]">
              {format(m.time, 'HH:mm')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default forwardRef(LiveScore);
