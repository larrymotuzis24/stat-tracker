import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PlayerList from './components/PlayerList';
import StatsDisplay from './components/StatsDisplay';


function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home </Link>
            </li>
            <li>
              <Link to="/stats">Stats Display</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<PlayerList />} />
          <Route path="/stats" element={<StatsDisplay />} />
       
        </Routes>
      </div>
    </Router>
  );
}

export default App;
