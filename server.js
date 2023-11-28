const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

app.use(bodyParser.json());

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const uri = 'mongodb+srv://newuser:newuser123@cluster0.gugmwqv.mongodb.net/UNT-OCH?retryWrites=true&w=majority';

async function connectToDatabase() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// Define a schema for Property model (modify it according to your data structure)
const roommateSchema = new mongoose.Schema({
	name: String,
	gender: String,
	program: String,
	age: Number,
	graduation: Number,
	pets: Boolean,
	smoke: Boolean,
	statuss: String
});

let Roommate;

// Wait for the database connection before defining the model
connectToDatabase().then(() => {
    Roommate = mongoose.model('Roommate', roommateSchema, 'Roommate Finder');

    // Route to get all properties
    app.get('/roommates', async (req, res) => {
        try {
            const roommates = await Roommate.find();
            res.render('index', { roommates: roommates });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Serve static files (like CSS)
    app.use(express.static(path.join(__dirname, 'public')));

    // Start the server
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});