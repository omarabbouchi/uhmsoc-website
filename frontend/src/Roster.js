import React, { useState, useEffect } from 'react';
import './Roster.css';

const Roster = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch('/api/players');
                if (response.ok) {
                    const data = await response.json();
                    setPlayers(data);
                }
            } catch (error) {
                console.error('Error fetching players:', error);
            }
        };

        fetchPlayers();
    }, []);

    return (
        <div className="roster-container">
            <div className="roster-header">
                <h1>2024-2025 Men's Soccer Roster</h1>
            </div>
            <div className="roster-grid">
                {players.map(player => (
                    <div key={player.number} className="player-card">
                        <div className="player-photo">
                            <img 
                                src={player.photo_url || '/default-player.png'} 
                                alt={player.name} 
                            />
                        </div>
                        <div className="player-info">
                            <div className="player-number">{player.number}</div>
                            <h3 className="player-name">{player.name}</h3>
                            <div className="player-details">
                                <p>{player.position}</p>
                                <p>{player.year}</p>
                                <p>{player.hometown}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Roster;