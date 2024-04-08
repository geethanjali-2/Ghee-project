// insertSampleProducts.js

const mongoose = require('mongoose');
const Product = require('./models/product');

// Set up MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/foodOrdering', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Sample product data
const sampleProducts = [
  {
    name: 'Natural Ghee',
    image: '/images/natural_ghee.jpg',
    price: 10.99
  },
  {
    name: 'Sample Ghee',
    image: '/images/sample_ghee.jpg',
    price: 8.99
  }
];

// Insert sample products into the database
Product.insertMany(sampleProducts)
  .then(() => {
    console.log('Sample products inserted successfully');
    mongoose.connection.close(); // Close the MongoDB connection
  })
  .catch(err => {
    console.error('Error inserting sample products:', err);
    mongoose.connection.close(); // Close the MongoDB connection
  });
