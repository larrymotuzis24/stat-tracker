import './PlayerList.css';
import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Box, TextField, Snackbar } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { collection, doc, setDoc, getDocs, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [practiceStats, setPracticeStats] = useState({});
  const [statsFetched, setStatsFetched] = useState(false); 
  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      const querySnapshot = await getDocs(collection(db, 'players'));
      const playersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlayers(playersList);
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    const fetchPracticeStats = async () => {
      const practiceId = `practice_${selectedDate.toISOString().slice(0, 10)}`;
      const practiceDoc = await getDoc(doc(db, 'practices', practiceId));

      if (practiceDoc.exists()) {
        const practiceData = practiceDoc.data();
        const statsMap = {};
        practiceData.stats.forEach(stat => {
          statsMap[stat.playerId] = stat;
        });
        setPracticeStats(statsMap);
      } else {
        setPracticeStats({});
      }
      setStatsFetched(true);
    };

    if (players.length > 0 && !statsFetched) {
      fetchPracticeStats();
    }
  }, [selectedDate, players, statsFetched]);

  const handleStatChange = (playerId, statType, increment) => {
    const updatedPracticeStats = {
      ...practiceStats,
      [playerId]: {
        ...practiceStats[playerId],
        [statType]: Math.max(0, (practiceStats[playerId]?.[statType] || 0) + increment),
      },
    };
    setPracticeStats(updatedPracticeStats);
  };

  const handleFieldGoalChange = (playerId, fieldGoalType, isMake) => {
    const currentStats = practiceStats[playerId] || {};
    const made = isMake
      ? Math.max(0, (currentStats[`${fieldGoalType}Made`] || 0) + 1)
      : currentStats[`${fieldGoalType}Made`] || 0;
    const attempted = Math.max(0, (currentStats[`${fieldGoalType}Attempts`] || 0) + 1);

    const updatedPracticeStats = {
      ...practiceStats,
      [playerId]: {
        ...practiceStats[playerId],
        [`${fieldGoalType}Made`]: made,
        [`${fieldGoalType}Attempts`]: attempted,
      },
    };
    setPracticeStats(updatedPracticeStats);
  };

  const savePracticeStats = async () => {
    const practiceId = `practice_${selectedDate.toISOString().slice(0, 10)}`;
    const practiceRef = doc(db, 'practices', practiceId);
  
    try {
      // Save practice stats
      await setDoc(practiceRef, {
        practiceId,
        date: selectedDate.toISOString().slice(0, 10),
        stats: Object.keys(practiceStats).map((playerId) => ({
          playerId,
          ...practiceStats[playerId],
        })),
      });
      console.log("Practice stats saved successfully.");
  
      // Update totals for each player
      console.log("Now updating player totals...");
      for (const playerId of Object.keys(practiceStats)) {
        console.log(`Processing player ID: ${playerId}`);
  
        // Fetch player document
        const playerRef = doc(db, 'players', playerId.toString());  // Ensure playerId is a string
        console.log(`Fetching document for player ID: ${playerId}, playerRef: ${playerRef.path}`);
        const playerDoc = await getDoc(playerRef);
  
        if (playerDoc.exists()) {
          const playerData = playerDoc.data();
          const currentTotals = playerData.totals || {
            assists: 0,
            offensiveRebounds: 0,
            defensiveRebounds: 0,
            turnovers: 0,
            twoPtMade: 0,
            twoPtAttempts: 0,
            threePtMade: 0,
            threePtAttempts: 0,
          };
  
          // Update player totals
          const updatedTotals = {
            assists: currentTotals.assists + (practiceStats[playerId].assists || 0),
            offensiveRebounds: currentTotals.offensiveRebounds + (practiceStats[playerId].offensiveRebounds || 0),
            defensiveRebounds: currentTotals.defensiveRebounds + (practiceStats[playerId].defensiveRebounds || 0),
            turnovers: currentTotals.turnovers + (practiceStats[playerId].turnovers || 0),
            twoPtMade: currentTotals.twoPtMade + (practiceStats[playerId].twoPtMade || 0),
            twoPtAttempts: currentTotals.twoPtAttempts + (practiceStats[playerId].twoPtAttempts || 0),
            threePtMade: currentTotals.threePtMade + (practiceStats[playerId].threePtMade || 0),
            threePtAttempts: currentTotals.threePtAttempts + (practiceStats[playerId].threePtAttempts || 0),
          };
  
          await updateDoc(playerRef, { totals: updatedTotals });
          console.log(`Updated totals for player ID: ${playerId}`);
        } else {
          console.log(`Player document not found for ID: ${playerId}`);
        }
      }
  
      setSnackbarMessage("Practice stats and totals saved successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error saving practice stats or updating totals:", error);
      setSnackbarMessage("Error saving practice stats or updating totals.");
      setSnackbarOpen(true);
    }
  };
  


  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Lewis Men's Basketball Stats Tracker
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <DatePicker
            label="Practice Date"
            value={selectedDate}
            onChange={(newDate) => {
              setSelectedDate(newDate);
              setStatsFetched(false);
            }}
            slots={{ textField: (params) => <TextField {...params} /> }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={savePracticeStats}
          >
            Save Practice Stats
          </Button>
        </Box>

        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'center',
             }}>
          {players.map((player) => (
            <Box key={player.id} sx={{ flex: '1 1 25%', maxWidth: '300px' }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>{player.name}</Typography>
                  {/* Two-Point Field Goals */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="body2">2PT FG: {practiceStats[player.id]?.twoPtMade || 0}/{practiceStats[player.id]?.twoPtAttempts || 0}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained" color="primary" onClick={() => handleFieldGoalChange(player.id, 'twoPt', true)}>Make</Button>
                      <Button size="small" variant="contained" color="error" onClick={() => handleFieldGoalChange(player.id, 'twoPt', false)} sx={{ '&:hover': { backgroundColor: '#d32f2f' } }}>Miss</Button>
                    </Box>
                  </Box>

                  {/* Three-Point Field Goals */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="body2">3PT FG: {practiceStats[player.id]?.threePtMade || 0}/{practiceStats[player.id]?.threePtAttempts || 0}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained" color="primary" onClick={() => handleFieldGoalChange(player.id, 'threePt', true)}>Make</Button>
                      <Button size="small" variant="contained" color="error" onClick={() => handleFieldGoalChange(player.id, 'threePt', false)} sx={{ '&:hover': { backgroundColor: '#d32f2f' } }}>Miss</Button>
                    </Box>
                  </Box>

                  {/* Assists */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="body2">Assists: {practiceStats[player.id]?.assists || 0}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained" color="primary" onClick={() => handleStatChange(player.id, 'assists', 1)}>+</Button>
                      <Button  size="small" variant="contained" color="error" onClick={() => handleStatChange(player.id, 'assists', -1)} sx={{ '&:hover': { backgroundColor: '#d32f2f' } }}>-</Button>
                    </Box>
                  </Box>


                  {/* Offensive Rebounds */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="body2">Off. Rebounds: {practiceStats[player.id]?.offensiveRebounds || 0}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained" color="primary" onClick={() => handleStatChange(player.id, 'offensiveRebounds', 1)}>+</Button>
                      <Button size="small" variant="contained" color="error" onClick={() => handleStatChange(player.id, 'offensiveRebounds', -1)} sx={{ '&:hover': { backgroundColor: '#d32f2f' } }}>-</Button>
                    </Box>
                  </Box>

                  {/* Defensive Rebounds */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="body2">Def. Rebounds: {practiceStats[player.id]?.defensiveRebounds || 0}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained" color="primary" onClick={() => handleStatChange(player.id, 'defensiveRebounds', 1)}>+</Button>
                      <Button size="small" variant="contained" color="error" onClick={() => handleStatChange(player.id, 'defensiveRebounds', -1)} sx={{ '&:hover': { backgroundColor: '#d32f2f' } }}>-</Button>
                    </Box>
                  </Box>

                  {/* Turnovers */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="body2">Turnovers: {practiceStats[player.id]?.turnovers || 0}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained" color="primary" onClick={() => handleStatChange(player.id, 'turnovers', 1)}>+</Button>
                      <Button size="small" variant="contained" color="error" onClick={() => handleStatChange(player.id, 'turnovers', -1)} sx={{ '&:hover': { backgroundColor: '#d32f2f' } }}>-</Button>
                    </Box>
                  </Box>

                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Snackbar for saving confirmation */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default PlayerList;
