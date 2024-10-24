import React from 'react';

const calculatePercentage = (made = 0, attempted = 0) => {
  if (attempted === 0) return '0%';  // Safeguard against 0 attempts
  return `${((made / attempted) * 100).toFixed(1)}%`;
};

const PlayerTotals = ({ practiceStats, players }) => {
  const aggregatedStats = {};

  practiceStats.forEach((practice) => {
    practice.stats.forEach((playerStat) => {
      if (!aggregatedStats[playerStat.playerId]) {
        aggregatedStats[playerStat.playerId] = { ...playerStat };
      } else {
        aggregatedStats[playerStat.playerId] = {
          ...aggregatedStats[playerStat.playerId],
          twoPtMade: (aggregatedStats[playerStat.playerId].twoPtMade || 0) + (playerStat.twoPtMade || 0),
          twoPtAttempts: (aggregatedStats[playerStat.playerId].twoPtAttempts || 0) + (playerStat.twoPtAttempts || 0),
          threePtMade: (aggregatedStats[playerStat.playerId].threePtMade || 0) + (playerStat.threePtMade || 0),
          threePtAttempts: (aggregatedStats[playerStat.playerId].threePtAttempts || 0) + (playerStat.threePtAttempts || 0),
          assists: (aggregatedStats[playerStat.playerId].assists || 0) + (playerStat.assists || 0),
          turnovers: (aggregatedStats[playerStat.playerId].turnovers || 0) + (playerStat.turnovers || 0),
          offensiveRebounds:
            (aggregatedStats[playerStat.playerId].offensiveRebounds || 0) + (playerStat.offensiveRebounds || 0),
          defensiveRebounds:
            (aggregatedStats[playerStat.playerId].defensiveRebounds || 0) + (playerStat.defensiveRebounds || 0),
        };
      }
    });
  });

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Player Totals</h2>
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
          {Object.keys(aggregatedStats).map((playerId) => (
            <tr key={playerId}>
              <td>{players[playerId] || 'Unknown'}</td>
              <td>{aggregatedStats[playerId].twoPtMade || 0}</td>
              <td>{aggregatedStats[playerId].twoPtAttempts || 0}</td>
              <td>{calculatePercentage(aggregatedStats[playerId].twoPtMade || 0, aggregatedStats[playerId].twoPtAttempts || 0)}</td>
              <td>{aggregatedStats[playerId].threePtMade || 0}</td>
              <td>{aggregatedStats[playerId].threePtAttempts || 0}</td>
              <td>{calculatePercentage(aggregatedStats[playerId].threePtMade || 0, aggregatedStats[playerId].threePtAttempts || 0)}</td>
              <td>{aggregatedStats[playerId].assists || 0}</td>
              <td>{aggregatedStats[playerId].turnovers || 0}</td>
              <td>{aggregatedStats[playerId].offensiveRebounds || 0}</td>
              <td>{aggregatedStats[playerId].defensiveRebounds || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTotals;
