import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import Navigation from './components/Navigation';
import './styles/App.css';

function App() {
  return (
    <div className="app-container">
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/:shortCode" element={<UrlRedirect />} />
        </Routes>
      </main>
    </div>
  );
}

function UrlRedirect() {
  return <div>Redirecting...</div>;
}

export default App;