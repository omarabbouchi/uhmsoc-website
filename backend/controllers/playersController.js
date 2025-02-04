const pool = require('../db/pool');
const path = require('path');
const fs = require('fs');

const getAllPlayers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM players ORDER BY number');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addPlayer = async (req, res) => {
    try {
        console.log('Starting addPlayer...');
        console.log('Request body:', req.body);
        console.log('File:', req.file);
        console.log('Upload path:', path.join(__dirname, '../public/uploads'));
        
        const { name, number, position, year, hometown } = req.body;
        
        if (!name || !number) {
            console.log('Missing required fields');
            return res.status(400).json({ error: 'Name and number are required' });
        }

        const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
        console.log('Photo URL:', photo_url);

        const result = await pool.query(
            'INSERT INTO players (name, number, position, year, hometown, photo_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, number, position, year, hometown, photo_url]
        );
        
        console.log('Player added successfully:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error in addPlayer:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({ error: err.message });
    }
};

const updatePlayer = async (req, res) => {
    const { number } = req.params;
    const { name, position, year, hometown } = req.body;
    try {
        const result = await pool.query(
            'UPDATE players SET name = $1, position = $2, year = $3, hometown = $4 WHERE number = $5 RETURNING *',
            [name, position, year, hometown, number]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//const editPlayer = async (req, res) => {


//}

const deletePlayer = async (req, res) => {
    const { number } = req.params;
    try {
        //first, get the player's photo_url
        const playerResult = await pool.query(
            'SELECT photo_url FROM players WHERE number = $1',
            [number]
        );

        //delete the player from database
        await pool.query('DELETE FROM players WHERE number = $1', [number]);

        //if player had a photo, delete it from filesystem
        if (playerResult.rows[0]?.photo_url) {
            const photoPath = path.join(
                __dirname, 
                '../public', 
                playerResult.rows[0].photo_url
            );
            
            //delete file if it exists
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
                console.log('Deleted photo:', photoPath);
            }
        }

        res.json({ message: 'Player deleted' });
    } catch (err) {
        console.error('Error deleting player:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllPlayers, addPlayer, updatePlayer, deletePlayer };
