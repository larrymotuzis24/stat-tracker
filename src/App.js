import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PlayerList from './components/PlayerList';
import StatsDisplay from './components/StatsDisplay';
import './App.css';

function App() {
  return (
    <Router basename="/stat-tracker">
      <div className="App">
        {/* Navigation links */}
        <nav>
          <Link to="/">Home</Link>
          <Link to="/stats">Stats</Link>
        </nav>
        {/* Define the routes */}
        <Routes>
          {/* Use exact path for home */}
          <Route exact path="/" element={<PlayerList />} />
          {/* Route for StatsDisplay page */}
          <Route path="/stats" element={<StatsDisplay />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

