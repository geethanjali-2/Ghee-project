const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const cartItem=require('./models/cartItem');
// const Product = require('./models/product');
// const productRoutes = require('./routes/products');

const app = express();
const port = 3000;

// Set up MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/foodordering', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use('/images', express.static('images'));
app.use(bodyParser.urlencoded({ extended: false }));

// Set up session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Configure Passport.js local strategy for username/password authentication
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Serve static files from the public directory
app.use(express.static('public'));

// Middleware to set the 'user' variable in every request
app.use((req, res, next) => {
    if (req.session.userId) {
        // If userId exists in the session, fetch the user from the database
        User.findById(req.session.userId)
            .then(user => {
                // Assign the user object to the 'user' variable
                req.user = user;
                next();
            })
            .catch(err => {
                console.log('Error fetching user:', err);
                next();
            });
    } else {
        // If userId doesn't exist, proceed without setting the 'user' variable
        next();
    }
});

// Define route for the homepage
app.get('/', (req, res) => {
    // Render the index.ejs file and pass the user object (if logged in)
    res.render('index', { user: req.user });
});

// Define route for login page
app.get('/login', (req, res) => {
    res.render('login', { error: null }); // Render the login.ejs file with no error initially
});

// Define route for handling login form submission
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query the database to find a user with the provided email
        const user = await User.findOne({ email });

        // If user is found and password matches
        if (user && user.password === password) {
            // Set userId in session
            req.session.userId = user._id;
            // Redirect the user to the main page (or any desired page)
            res.redirect('/');
        } else {
            // Render the login page again with an error message
            res.render('login', { error: 'Invalid email or password' });
        }
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// Define route for signup page
app.get('/signup', (req, res) => {
    res.render('signup'); // Render the signup.ejs file
});

// Define route for handling signup form submission
app.post('/signup', async (req, res) => {
    const { name, email, password, phoneNumber, address } = req.body;

    try {
        // Create a new user document
        const newUser = new User({
            name,
            email,
            password,
            phoneNumber,
            address
        });

        // Save the user to the database
        await newUser.save();

        // Redirect the user to the login page
        res.redirect('/login');
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// Define route for logout
app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('An error occurred');
        } else {
            // Redirect the user to the login page
            res.redirect('/login');
        }
    });
});

// Define route for the homepage
app.get('/', async (req, res) => {
  try {
      // Fetch sample products from the database
      const sampleProducts = await Product.find().limit(3); // Limit to 3 sample products
      // Render the index.ejs file and pass the sample products variable
      res.render('index', { user: req.user, sampleProducts: sampleProducts });
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
  }
});
app.get('/', async (req, res) => {
  try {
      // Fetch sample products from the database
      const sampleProducts = await Product.find().limit(3); // Limit to 3 sample products
      // Render the index.ejs file and pass the sample products variable
      res.render('index', { user: req.user, sampleProducts: sampleProducts });
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
  }
});

app.post('/login', passport.authenticate('local'), (req, res) => {
    // Successful authentication, redirect or respond as needed
    res.redirect('/');
});

// Route to protect a resource using isAuthenticated middleware
app.get('/', isAuthenticated, (req, res) => {

    res.render('/', { user: req.user });
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Proceed if user is authenticated
    }
    res.redirect('/login'); // Redirect to login page if not authenticated
}
app.get('/user/details', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id; // Assuming req.user contains the authenticated user's details

        // Find the user by ID in the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract and send user details in the response
        const userDetails = {
            name: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address
        };

        res.status(200).json(userDetails);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Proceed if user is authenticated
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}
// Assuming you have an Express app instance named 'app'

// Route handler for rendering the profile page
app.get('/profile', isAuthenticated, (req, res) => {
    // Render the 'profile' view/template with user details
    res.render('profile', { user: req.user });
});


// app.post('/add', async (req, res) => {
//     const { productName, quantity, price } = req.body;
//     const userId = req.session.user._id; // Assuming user ID is stored in session
//     const newItem = new CartItem({ userId, productName, quantity, price });

//     try {
//         await newItem.save();
//         res.status(201).send('Item added to cart');
//     } catch (error) {
//         res.status(500).send('Failed to add item to cart');
//     }
// });

// // Get user's cart items
// app.get('/', async (req, res) => {
//     const userId = req.session.user._id; // Assuming user ID is stored in session

//     try {
//         const cartItems = await CartItem.find({ userId });
//         res.json(cartItems);
//     } catch (error) {
//         res.status(500).send('Failed to fetch cart items');
//     }
// });


// Mount routes
// app.use('/products', productRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
