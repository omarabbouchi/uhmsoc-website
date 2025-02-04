const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
  //access token (7 days)
  const accessToken = jwt.sign(
    { id: user.id, isAdmin: true },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  //refresh token (30 days)
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};

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

    const tokens = generateTokens(admin);

    //set tokens in cookies
    res.cookie('token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 3600000  //7 days in ms
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 3600000  //30 days in ms
    });

    res.json({ 
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    //verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    //generate new access token
    const accessToken = jwt.sign(
      { id: decoded.id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    //set new access token in cookie
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000 //1 hour
    });

    res.json({ token: accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

module.exports = { 
  login, 
  refreshAccessToken,
  createAdmin, 
  getAllAdmins, 
  deleteAdmin 
}; 