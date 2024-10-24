import React from 'react';
import './stat-sheet.css'; // Assuming you're styling this

const calculatePercentage = (made = 0, attempted = 0) => {
  if (attempted === 0) return '0%';
  return `${((made / attempted) * 100).toFixed(1)}%`;
};

const PlayerStatsByPractice = ({ practiceStats, players }) => {
  return (
    <div className="practice-stats">
      {practiceStats.map((practice, index) => (
        <div key={index}>
          <h3>Practice Date: {practice.date}</h3>
          <table className="stat-sheet">
            <thead>
              <tr>
                <th>Name</th>
                <th>2pt FG Made</th>
                <th>2pt FG Attempted</th>
                <th>2pt FG %</th>
                <th>3pt FG Made</th>
                <th>3pt FG Attempted</th>
                <th>3pt FG %</th>
                <th>Assists</th>
                <th>Turnovers</th>
                <th>Off. Rebounds</th>
                <th>Def. Rebounds</th>
              </tr>
            </thead>
            <tbody>
              {practice.stats.map((playerStat) => (
                <tr key={playerStat.playerId}>
                  <td>{players[playerStat.playerId] || 'Unknown'}</td>
                  <td>{playerStat.twoPtMade || 0}</td>
                  <td>{playerStat.twoPtAttempts || 0}</td>
                  <td>{calculatePercentage(playerStat.twoPtMade || 0, playerStat.twoPtAttempts || 0)}</td>
                  <td>{playerStat.threePtMade || 0}</td>
                  <td>{playerStat.threePtAttempts || 0}</td>
                  <td>{calculatePercentage(playerStat.threePtMade || 0, playerStat.threePtAttempts || 0)}</td>
                  <td>{playerStat.assists || 0}</td>
                  <td>{playerStat.turnovers || 0}</td>
                  <td>{playerStat.offensiveRebounds || 0}</td>
                  <td>{playerStat.defensiveRebounds || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default PlayerStatsByPractice;
