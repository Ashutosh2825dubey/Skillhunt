const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const ejs = require('ejs');
const projectRoutes = require('./routes/projectroutes');
const xss = require('xss-clean');

const app = express();
const PORT = process.env.PORT ||3000 ;
const dbURI = 'mongodb+srv://shaun:amandubey123@nodetuts.eswobdi.mongodb.net/project?retryWrites=true&w=majority';  // Update with your MongoDB URI

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });

// Set up view engine and middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use(projectRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});
app.use(xss());
