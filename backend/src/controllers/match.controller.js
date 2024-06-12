const db = require('../models/dbconnect');
const Match = db.match;

module.exports = {
  createMatches: async (req, res) => {
    const matches = req.body.matches;
    const cameraId = req.params.cameraId;
    try {
      matches.forEach(async (match) => {
        const MatchData = {
          cameraId: cameraId,
          player1Name: match.player1Name,
          player2Name: match.player2Name,
          player1Score: match.player1Score,
          player2Score: match.player2Score,
          time: match.time,
          playerWin: match.playerWin,
          race: match.race,
        };

        const createdMatch = await Match.create(MatchData);
        console.log(createdMatch);
      });
    } catch (error) {
      console.error('Error creating video segment:', error);
      return { error: 'Internal server error' };
    }
    return res.status(201).send({ message: 'Created matches', success: true });
  },

  deleteAllMatchesByCameraId: async (req, res) => {
    const cameraId = req.params.cameraId;

    try {
      const deletedRowsCount = await Match.destroy({ where: { cameraId } });
      if (deletedRowsCount === 0) {
        res.status(404).send({ message: 'Video segment not found' });
      } else {
        res.status(204).send();
      }
    } catch (error) {
      console.error('Error deleting video segment:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  getAllMatchesByCameraId: async (req, res) => {
    const cameraId = req.params.cameraId;

    try {
      const match = await Match.findAll({ where: { cameraId } });
      res.status(200).send(match);
    } catch (error) {
      console.error('Error retrieving matches by cameraId:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  },
};
