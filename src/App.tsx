import React, { useState } from 'react';

export default function App() {
    const [score, setScore] = useState(0);
    return (
        <div style={{ textAlign: "center", marginTop: 50 }}>
            <h1>Pou Tapper</h1>
            <img 
                src="./pou%20pou.jpg" 
                alt="Pou" 
                style={{ width: 200, cursor: "pointer", display: "block", margin: "0 auto 20px auto" }} 
                onClick={() => setScore(score + 1)} 
            />
            <p style={{ fontSize: 24 }}>Score: {score}</p>
            <p>Tap on Pou to increase your score!</p>
        </div>
    );
}