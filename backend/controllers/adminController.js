const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const result = await pool.query(
            'SELECT * FROM admins WHERE username = $1',
            [username]
        );

        const admin = result.rows[0];
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, admin.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { isAdmin: true, id: admin.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert new admin
        const result = await pool.query(
            'INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
            [username, password_hash]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') { // Unique violation
            res.status(400).json({ error: 'Username already exists' });
        } else {
            console.error('Create admin error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, username, created_at FROM admins ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Get admins error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent deleting the last admin
        const countResult = await pool.query('SELECT COUNT(*) FROM admins');
        if (parseInt(countResult.rows[0].count) <= 1) {
            return res.status(400).json({ error: 'Cannot delete the last admin account' });
        }

        const result = await pool.query(
            'DELETE FROM admins WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.json({ message: 'Admin deleted successfully' });
    } catch (err) {
        console.error('Delete admin error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { login, createAdmin, getAllAdmins, deleteAdmin }; 