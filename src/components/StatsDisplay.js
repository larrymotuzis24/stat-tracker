import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import TeamTotals from './TeamTotals';
import PlayerTotals from './PlayerTotals';
import TeamStatsByPractice from './TeamStatsByPractice'; 
import PlayerStatsByPractice from './PlayerStatsByPractice'; 
import './StatsDisplay.css'

const StatsDisplay = () => {
  const [selectedView, setSelectedView] = useState(1);
  const [practiceStats, setPracticeStats] = useState([]);
  const [players, setPlayers] = useState({});

  // Fetch players and practice stats from Firebase
  useEffect(() => {
    const fetchPlayers = async () => {
      const querySnapshot = await getDocs(collection(db, 'players'));
      const playersMap = {};
      querySnapshot.docs.forEach((doc) => {
        playersMap[doc.id] = doc.data().name;
      });
      setPlayers(playersMap);
    };

    const fetchPracticeStats = async () => {
      const querySnapshot = await getDocs(collection(db, 'practices'));
      const allStats = querySnapshot.docs.map((doc) => doc.data());
      setPracticeStats(allStats);
    };

    fetchPlayers();
    fetchPracticeStats();
  }, []);

  return (
    <div className="stats-display">
      <div className="stats-navigation">
        <button onClick={() => setSelectedView(1)}>Team Totals</button>
        <button onClick={() => setSelectedView(2)}>Player Totals</button>
        <button onClick={() => setSelectedView(3)}>Team Stats by Practice</button>
        <button onClick={() => setSelectedView(4)}>Player Stats by Practice</button>
      </div>

      <div className="stats-content">
        {selectedView === 1 && <TeamTotals practiceStats={practiceStats} />}
        {selectedView === 2 && <PlayerTotals practiceStats={practiceStats} players={players} />}
        {selectedView === 3 && <TeamStatsByPractice practiceStats={practiceStats} />}
        {selectedView === 4 && <PlayerStatsByPractice practiceStats={practiceStats} players={players} />}
      </div>
    </div>
  );
};

export default StatsDisplay;
