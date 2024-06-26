const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');



const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],  // Seulement charger les ressources du même origine
        styleSrc: ["'self'", "'nonce-abc123'", "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"],  // Sources autorisées pour les styles
        scriptSrc: ["https://trusted.cdn.com"],  // Sources autorisées pour les scripts
        imgSrc: ["'self'", "https://fakestoreapi.com/img/"],  // Sources autorisées pour les images
        objectSrc: ["'none'"],  // Bloque les <object>, <embed>, et <applet>
        upgradeInsecureRequests: [],  // Upgrade les requêtes HTTP vers HTTPS
    }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Mettre à disposition le token CSRF pour les vues EJS
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});


const routes = require('./routes/routes');
app.use('/', routes);


app.listen(port, () => {
    console.log(`Front-end server running on http://localhost:${port}`);
});
