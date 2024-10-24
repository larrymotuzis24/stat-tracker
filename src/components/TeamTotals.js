import React from 'react';
import './stat-sheet.css'; // Import the CSS for styling

const calculatePercentage = (made, attempted) => {
  if (attempted === 0) return '0%';
  return `${((made / attempted) * 100).toFixed(1)}%`;
};

const TeamTotals = ({ practiceStats }) => {
  const teamTotals = {
    twoPtMade: 0,
    twoPtAttempts: 0,
    threePtMade: 0,
    threePtAttempts: 0,
    assists: 0,
    turnovers: 0,
    offensiveRebounds: 0,
    defensiveRebounds: 0,
  };

  // Aggregate stats for team totals
  practiceStats.forEach((practice) => {
    practice.stats.forEach((playerStat) => {
      teamTotals.twoPtMade += playerStat.twoPtMade || 0;
      teamTotals.twoPtAttempts += playerStat.twoPtAttempts || 0;
      teamTotals.threePtMade += playerStat.threePtMade || 0;
      teamTotals.threePtAttempts += playerStat.threePtAttempts || 0;
      teamTotals.assists += playerStat.assists || 0;
      teamTotals.turnovers += playerStat.turnovers || 0;
      teamTotals.offensiveRebounds += playerStat.offensiveRebounds || 0;
      teamTotals.defensiveRebounds += playerStat.defensiveRebounds || 0;
    });
  });

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Team Totals</h2>
      <table className="stat-sheet">
        <thead>
          <tr>
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
          <tr>
            <td>{teamTotals.twoPtMade}</td>
            <td>{teamTotals.twoPtAttempts}</td>
            <td>{calculatePercentage(teamTotals.twoPtMade, teamTotals.twoPtAttempts)}</td>
            <td>{teamTotals.threePtMade}</td>
            <td>{teamTotals.threePtAttempts}</td>
            <td>{calculatePercentage(teamTotals.threePtMade, teamTotals.threePtAttempts)}</td>
            <td>{teamTotals.assists}</td>
            <td>{teamTotals.turnovers}</td>
            <td>{teamTotals.offensiveRebounds}</td>
            <td>{teamTotals.defensiveRebounds}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TeamTotals;
