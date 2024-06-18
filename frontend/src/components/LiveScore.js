import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import { CgAddR, CgRemoveR } from "react-icons/cg";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import EditableDiv from './EditableDiv';
import { format } from 'date-fns';
import axios from 'axios';

const LiveScore = (props, ref) => {
  const [totalMatch, setTotalMatch] = useState(2);
  const initMatch = {
    player1Name: 'Player 1',
    player2Name: 'Player 2',
    player1Score: 0,
    player2Score: 0,
    race: 10,
  };
  const [match, setMatch] = useState(initMatch);

  const deleteMatches = useCallback(async () => {
    const apiPath = process.env.REACT_APP_BE_API_URL;

    await axios.delete(`${apiPath}/api/camera/${props.cameraId}/matches`);
  }, [props.cameraId]);

  useImperativeHandle(ref, () => ({
    resetMatch() {
      setMatch(initMatch);
      setMatches([]);
      deleteMatches();
    },
  }));

  useEffect(() => {
    const fetchMatches = async () => {
      const apiPath = process.env.REACT_APP_BE_API_URL;

      const response = await axios.get(
        `${apiPath}/api/camera/${props.cameraId}/matches`
      );

      setMatches(response.data);
    };

    fetchMatches();
  }, [props.cameraId]);

  const [matches, setMatches] = useState([]);

  const addNewMatch = async (newMatch) => {
    const apiPath = process.env.REACT_APP_BE_API_URL;

    await axios.post(`${apiPath}/api/camera/${props.cameraId}/matches`, {
      matches: [newMatch],
    });
  };

  const handleIncreaseScore = async (player) => {
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
      newMatch.playerWin =
        newMatch.player1Score > newMatch.player2Score ? 1 : 2;
      setMatches([...matches, newMatch]);
      setTotalMatch(totalMatch + 1);
      setMatch({
        ...initMatch,
        player1Name: newMatch.player1Name,
        player2Name: newMatch.player2Name,
        race: newMatch.race,
      });
      await addNewMatch(newMatch);
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
    setMatch({ ...match, player2Name: name });
  };

  const handleIncreaseRace = () => {
    setMatch({ ...match, race: match.race + 1 });
  };

  const handleDecreaseRace = () => {
    if (match.race > 1) {
      setMatch({ ...match, race: match.race - 1 });
    }
  };

  return (
    <div className="p-2 text-white">
      <div className="text-semibold text-2xl text-center mb-4">
        Trận {totalMatch}
      </div>
      {/* Score */}
      <div className="text-center text-lg flex gap-4 justify-center items-center py-2">
        <IoRemoveCircleOutline
          className="cursor-pointer"
          size={36}
          onClick={handleDecreaseRace}
        />
        <span>Race: {match.race}</span>
        <IoAddCircleOutline
          className="cursor-pointer"
          size={36}
          onClick={handleIncreaseRace}
        />
      </div>
      <div className="flex gap-2 items-center justify-center p-2">
        <div className="text-3xl p-8 bg-orange-600 rounded-md">
          <EditableDiv
            content={match.player1Name}
            setContent={handlePlayer1NameChange}
            divClassName="text-center text-2xl text-white whitespace-nowrap overflow-hidden text-ellipsis w-[100px]"
            inputClassName="text-[#0284c7] text-base w-[100px]"
          />
          <div className="flex-1 flex justify-center items-center p-4 text-[60px] rounded-tl rounded-bl my-4">
            {match.player1Score}
          </div>
          <div className="flex justify-center gap-4 px-1">
            <CgAddR
              className="cursor-pointer"
              size={40}
              onClick={() => handleIncreaseScore(1)}
            />
            <CgRemoveR
              className="cursor-pointer"
              size={40}
              onClick={() => handleDecreaseScore(1)}
            />
          </div>
        </div>
        <div>Reset</div>
        <div className="text-3xl p-8 bg-orange-600 rounded-md">
          <EditableDiv
            content={match.player2Name}
            setContent={handlePlayer2NameChange}
            divClassName="text-center text-2xl text-white whitespace-nowrap overflow-hidden text-ellipsis w-[100px]"
            inputClassName="text-[#dc2626] text-base w-[100px]"
          />
          <div className="flex-1 flex justify-center items-center p-4 text-[60px] rounded-tl rounded-bl my-4">
            {match.player2Score}
          </div>
          <div className="flex justify-center gap-4 px-1">
            <CgAddR
              className="cursor-pointer"
              size={40}
              onClick={() => handleIncreaseScore(2)}
            />
            <CgRemoveR
              className="cursor-pointer"
              size={40}
              onClick={() => handleDecreaseScore(2)}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 px-2">
        <div className="flex justify-center mt-10 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-500 font-semibold">
              <tr className="">
                <th className="px-6 py-3 text-xs uppercase text-center tracking-wider">#</th>
                <th className="px-6 py-3 text-xs uppercase text-center tracking-wider">{match.player1Name}</th>
                <th className="px-6 py-3 text-xs uppercase text-center tracking-wider">{match.player2Name}</th>
                <th className="px-6 py-3 text-xs uppercase text-center tracking-wider">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-orange-400' : 'bg-orangeLight'}>
                  <td className="px-6 py-2 text-center whitespace-nowrap text-sm">Trận {index + 1}</td>
                  {/* <td className="px-6 py-2 text-center whitespace-nowrap">{m.player1Score}</td>
                  <td className="px-6 py-2 text-center whitespace-nowrap">{m.player2Score}</td> */}
                  <td colSpan="2" className="px-6 py-2 text-center align-middle whitespace-nowrap font-bold">
                    <div className="flex gap-2 justify-center items-center">
                      <IoCheckmarkDoneSharp className={`inline text-blue-500 ${m.playerWin !== 1 ? 'opacity-0' : ''}`}/>
                      {m.player1Score} - {m.player2Score}
                      <IoCheckmarkDoneSharp className={`inline text-blue-700 ${m.playerWin !== 2 ? 'opacity-0' : ''}`}/>
                    </div>
                  </td>
                  <td className="px-6 py-2 text-center whitespace-nowrap text-sm italic">{format(m.time, 'HH:mm')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default forwardRef(LiveScore);
