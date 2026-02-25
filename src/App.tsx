import React, { useState } from 'react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", color: "white", fontFamily: "sans-serif" }}>
      <h1>Pou Tapper</h1>
      <div style={{ marginBottom: "20px" }}>
        <img 
   src="/pou.jpg"
          alt="Pou" 
          style={{ width: "200px", cursor: "pointer", borderRadius: "20px" }}
          onClick={() => setScore(score + 1)}
        />
      </div>
      <p style={{ fontSize: "32px", fontWeight: "bold" }}>Score: {score}</p>
      <p>Tap on Pou to increase your score!</p>
    </div>
  );
}