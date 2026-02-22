import React, { useState } from 'react';
import pouImage from './path_to_pou_image.png'; // replace with actual path

const GameUI = () => {
    const [score, setScore] = useState(0);

    const handleTap = () => {
        setScore(score + 1);
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Pou Tapper</h1>
            <img src={pouImage} alt="Pou Character" style={{ width: '200px', cursor: 'pointer' }} onClick={handleTap} />
            <p>Score: {score}</p>
            <p>Tap the Pou to increase your score!</p>
        </div>
    );
};

export default GameUI;