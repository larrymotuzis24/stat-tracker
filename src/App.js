import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlayerList from './components/PlayerList';
import StatsDisplay from './components/StatsDisplay';
import './App.css';

function App() {
  return (
    <Router basename="/stat-tracker">
      <div className="App">
        {/* Define the routes */}
        <Routes>
          {/* Set PlayerList to be the default route (/) */}
          <Route path="/" element={<PlayerList />} />
          {/* Route for StatsDisplay page */}
          <Route path="/stats" element={<StatsDisplay />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
