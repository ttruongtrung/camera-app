const db = require('../models');
const Match = db.Match;

module.exports = {
  createMatch: async (req, res) => {
    const match = req.body.match;
    const cameraId = req.params.cameraId;
    try {
      const MatchData = {
        cameraId: Number(cameraId),
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
      return res.status(201).send({ matches: 'Created matches', success: true });
    } catch (error) {
      console.error('Error creating video segment:', error);
      return res.status(500).send({ error: error.message });
    }
  },

  deleteAllMatchesByCameraId: async (req, res) => {
    const cameraId = req.params.cameraId;

    try {
      const deletedRowsCount = await Match.destroy({ where: { cameraId } });
      res.status(204).send();
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
