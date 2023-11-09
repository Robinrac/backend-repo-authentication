const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dataRoutes = require('./routes/data_routes');

const app = express();
app.use(cors()); 
app.use(bodyParser.json());

app.use(async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).send('Access Denied');
    try {
        const response = await fetch('http://localhost:3001', { //Add verify token endpoint from auth repo
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        req.user = data.user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send('Invalid Token');
    }
});

app.use('/data', dataRoutes);

module.exports = app;