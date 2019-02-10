const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
mongoose.Promise = global.Promise;

const db = mongoose.connection;
const app = express();

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

app.use('/meals', require('./controllers/meals'));

// Health check
app.get('/ping', (req, res) => {
  res.set('text/plain').status(200).send('pong');
});

// Fallback 404 response
app.get('*', (req, res) => {
  res.status(404).json({ isSuccess: false, error: 'The specified URI is unknown for the REST service.' });
});

const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`Server started on port ${port}`));
