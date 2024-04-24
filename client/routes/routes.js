const express = require('express');
const axios = require('axios');
const router = express.Router();

// URL de base pour le serveur back-end
const BASE_URL = 'http://localhost:5000/api/users';

// Page d'accueil
router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// Inscription
router.post('/register', async (req, res) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, req.body);
        res.redirect('/login');  // Rediriger pour se connecter après l'inscription
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).send('Failed to register');
    }
});

// Connexion
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, req.body);
        if (response.data.token) {
            // Stocker le JWT dans les cookies
            res.cookie('token', response.data.token, { httpOnly: true });
            req.session.token = response.data.token;
            res.redirect('/dashboard');
        } else {
            throw new Error('Token not provided');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).render('login', { message: 'Login failed, please try again' });
    }
});

// Tableau de bord
router.get('/dashboard', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/dashboard`, {
            headers: { Authorization: `Bearer ${req.session.token}` }
        });
        res.render('dashboard', { title: 'Dashboard', data: response.data });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(401).redirect('/login');
    }
});


// Déconnexion
router.get('/logout', async (req, res) => {
    try {
        await axios.get(`${BASE_URL}/logout`, {
            headers: { Authorization: `Bearer ${req.session.token}` }
        });
        res.clearCookie('token');
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.error('Logout error:', error);
        res.status(400).send('Failed to logout');
    }
});

module.exports = router;