const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("pics"));

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
    pets: String,
    smoke: String,
    statuss: String
});

const propertySchema = new mongoose.Schema({
    _id: mongoose.ObjectId,
    type: String,
    address: {
        street: String,
        city: String,
        state: String,
        zip_code: String,
        country: String
    },
    details: {
        bedrooms: Number,
        bathrooms: Number,
        square_footage: Number,
        price: Number
    },
    amenities: {
        parking: Boolean,
        pets_allowed: Boolean,
        pool: Boolean,
        furnished: Boolean
    },
		website: String,
		name: String,
		image_url: String
});

const userSchema = new mongoose.Schema({
	fname: String,
	lname: String,
	email: String,
	pass: String
});

let Property;
let Roommate;
let Search;
let User;
let log = "no";
let email;
let pass;

// Wait for the database connection before defining the model
connectToDatabase().then(() => {
    Roommate = mongoose.model('Roommate', roommateSchema, 'Roommate Finder');
    Search = mongoose.model('Search', roommateSchema, 'search');
    Property = mongoose.model('Property', propertySchema, 'Properties');
	User = mongoose.model('User', userSchema, 'User Profile');

	// Route to get all properties
	app.get('/', (req, res) => {
		res.render('Home Page');
		});
		app.get('/roommate', (req, res) => {
		if (log == "yes") {
			res.render('index2 log');
		}
		if (log == "no") {
			res.render('index2');
		}
		});
		app.get('/home', (req, res) => {
		if (log == "no") {
			res.render('Home Page');
		}
		if (log == "yes") {
			res.render('Home Page log');
		}
		});
		app.get('/logout', (req, res) => {
		log = "no";
		res.render('Home Page');
		});
		app.post('/homel', async (req, res) => {
		log = "yes";
		const email2 = req.body.email;
		const pass2 = req.body.password;
		if (email2 == email) {
			if (pass2 == pass) {
				res.render('Home Page log');
			}
		}
		else {
			res.render('try');
		}
		});
		app.get('/account', async (req, res) => {
		await User.create([
			{ email, pass }
		]);
		const users = await User.find()
		if (log == "yes") {
			res.render('Account Manager log', { users: users });
		}
		if (log == "no") {
			res.render('Account Manager');
		}
		});
		app.get('/resource', (req, res) => {
		
		if (log == "yes") {
			res.render('Resource Page log');
		}
		if (log == "no") {
			res.render('Resource Page');
		}
		});
		app.get('/contact', (req, res) => {
		if (log == "yes") {
			res.render('contact log');
		}
		if (log == "no") {
			res.render('contact');
		}
		});
		app.get('/reg', (req, res) => {
		res.render('reg');
		});
		app.get('/log', (req, res) => {
		log = "no";
		res.render('login');
		});
		app.get('/propm', (req, res) => {
		if (log == "yes") {
			res.render('Prop_Manager log');
		}
		if (log == "no") {
			res.render('Prop_Manager');
		}
		});
		app.get('/add', (req, res) => {
		if (log == "yes") {
			res.render('addprop log');
		}
		if (log == "no") {
			res.render('addprop');
		}
		});
		// Route to render property finder page
		app.get('/propf', async (req, res) => {
			try {
				const properties = await Property.find();
				if (log == "yes") {
					res.render('property finder log', { properties: properties });
				}
				if (log == "no") {
					res.render('property finder', { properties: properties });
				}
			} catch (err) {
				console.error('Error fetching properties:', err);
				res.status(500).render('error', { error: 'Error fetching properties' });
			}
		});

		app.get('/props', async (req, res) => {
		try {
			const properties = await Property.find();
			if (log == "yes") {
				res.render('saved properties log', { properties: properties });
			}
			if (log == "no") {
				res.render('saved properties', { properties: properties });
			}
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	});

	app.post('/filter', async (req, res) => {
		try {
			// Extract filter criteria from the request body
			const { minPrice, maxPrice, beds, bath, type, size, amenities, sort } = req.body;
	
			// Log the received filter criteria
			console.log('Received filter criteria:', { minPrice, maxPrice, beds, bath, type, size, amenities, sort });
	
			// Build the filter object based on the criteria
			const filterObject = {};
	
			if (minPrice || maxPrice) {
				filterObject['details.price'] = {};
				if (minPrice) filterObject['details.price'].$gte = minPrice;
				if (maxPrice) filterObject['details.price'].$lte = maxPrice;
			}
	
			if (beds) filterObject['details.bedrooms'] = beds;
			if (bath) filterObject['details.bathrooms'] = bath;
			if (type) filterObject['type'] = type;
			// Add more criteria as needed
	
			// Log the generated filter object
			console.log('Generated filter object:', filterObject);
	
			// Implement your filtering logic based on the criteria
			const filteredProperties = await Property.find(filterObject);
	
			// Log the filtered properties
			console.log('Filtered properties:', filteredProperties);
	
			// Respond with the filtered properties in JSON format
			res.json({ properties: filteredProperties });
		} catch (error) {
			console.error('Error applying filters:', error);
			res.status(500).json({ message: error.message });
		}
	});

    app.post('/search', async (req, res) => {
        const gender = req.body.gender;
        const program = req.body.program;
        const age = req.body.age;
        const graduation = req.body.gradyear;
        const pets = req.body.pets;
        const smoke = req.body.smoke;
        const statuss = req.body.statuss;
        await Roommate.create([
            { gender, program, age, graduation, pets, smoke, statuss }
        ]);

        const roommates = await Roommate.find();
        if (log == "yes") {
			res.render('index log', { roommates: roommates });
		}
		if (log == "no") {
			res.render('index', { roommates: roommates });
		}
    });	
	
	app.post('/register', async (req, res) => {
		const fname = req.body.firstName;
		const lname = req.body.lastName;
		email = req.body.email;
		pass = req.body.password;
		const gender = req.body.gender;
        const program = req.body.program;
        const age = req.body.age;
        const graduation = req.body.gradyear;
        const pets = req.body.pets;
        const smoke = req.body.smoke;
        const statuss = req.body.statuss;
		const name = fname + " " + lname;
		await User.create([
			{ fname, lname, email, pass }
		]);
		await Roommate.create([
            { name, gender, program, age, graduation, pets, smoke, statuss }
        ]);
		res.render('Home Page');
	});

    // Start the server
    const port = process.env.PORT || 3000;
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
