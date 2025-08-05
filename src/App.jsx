
import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import { Analytics } from '@vercel/analytics/react';

const categories = [
  'Assigning priority P1/P2 incidents',
  'Assigning SDM escalations',
  'Reviewing dashboard and inbox for handoffs',
  'Reviewing aging and upcoming aging tickets for updates',
  'Assigning out First Access tickets before breaching',
  'Assigning out tickets or tasks from other WebEx spaces',
  'Ticket escalation reviews',
  'Normal Change Request approving',
  'Assess out of scope and wrongly assigned tickets'
];


function App() {
  const getInitialTimes = () => {
    const saved = localStorage.getItem('drivingTimes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check if all current categories exist in saved data and no extra keys
        const savedKeys = Object.keys(parsed);
        const allMatch =
          savedKeys.length === categories.length &&
          categories.every((cat) => savedKeys.includes(cat));
        if (allMatch) {
          return parsed;
        }
      } catch (e) {
        // If parsing fails, fall through to reset
      }
    }
    // If no saved data or mismatch, reset
    const reset = Object.fromEntries(categories.map((c) => [c, 0]));
    localStorage.setItem('drivingTimes', JSON.stringify(reset));
    return reset;
  };
  const [times, setTimes] = useState(getInitialTimes);

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
      <Analytics />
    </div>
  );
}

export default App;
