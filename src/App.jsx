import React, { useState, useEffect } from 'react';
import styles from './App.module.css';

const categories = [
  'P1/P2 Incidents',
  'SDM Escalations',
  'Dashboard & Handoffs',
  'Aging Tickets Review',
  'First Access Assignment',
  'WebEx Ticket Assignment',
  'Ticket Escalation Reviews',
  'Change Approvals',
  'Scope & Assignment Review'
];

function App() {
  const [times, setTimes] = useState(() => {
    const saved = localStorage.getItem('drivingTimes');
    return saved ? JSON.parse(saved) : Object.fromEntries(categories.map(c => [c, 0]));
  });

  useEffect(() => {
    localStorage.setItem('drivingTimes', JSON.stringify(times));
  }, [times]);

  const addTime = (category, minutes) => {
    setTimes(prev => ({ ...prev, [category]: Math.max(0, prev[category] + minutes) }));
  };

  const resetTimes = () => {
    const reset = Object.fromEntries(categories.map(c => [c, 0]));
    setTimes(reset);
    localStorage.setItem('drivingTimes', JSON.stringify(reset));
  };

  const copyToClipboard = () => {
    const text = Object.entries(times)
      .map(([category, time]) => `${category}: ${time} minutes`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={styles.appDarkCentered}>
      <h1 className={styles.title}>Driving Time Tracker</h1>
      <p className={styles.subtitle}>Track time spent across responsibilities in 5-minute increments</p>

      <div className={styles.gridCentered}>
        {categories.map(category => (
          <div key={category} className={styles.cardDarkHorizontal}>
            <h2>{category}</h2>
            <p className={styles.time}>{times[category]} min</p>
            <button onClick={() => addTime(category, -5)}>-5 min</button>
            <button onClick={() => addTime(category, 5)}>+5 min</button>
          </div>
        ))}
      </div>

      <button onClick={copyToClipboard} className={styles.copyButton}>Copy to Clipboard</button>
      <button onClick={resetTimes} className={styles.copyButton} style={{ marginTop: '1rem', backgroundColor: '#cc4444' }}>Reset All</button>
    </div>
  );
}

export default App;
