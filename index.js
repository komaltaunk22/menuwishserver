const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();  // Ensure dotenv is loaded for environment variables

const app = express();
app.use(cors());
app.use(bodyParser.json());
const User = require('./models/User');
// MongoDB connection URI from environment variables

// Connect to MongoDB using Mongoose

// Define the Restaurant model
const restaurantSchema = new mongoose.Schema({
  categories: [
    {
      name: String,
      dishes: [
        {
          name: String,
          price: Number,
        },
      ],
    },
  ],
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// Endpoint to fetch restaurant data
app.get('/api/restaurant', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne();  // Assuming one restaurant
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to add a dish to the menu
app.post('/api/restaurant/menu', async (req, res) => {
  try {
    const { categoryName, dish } = req.body;
    const restaurant = await Restaurant.findOne();

    const categoryIndex = restaurant.categories.findIndex((cat) => cat.name === categoryName);
    if (categoryIndex !== -1) {
      restaurant.categories[categoryIndex].dishes.push(dish);  // Add dish to existing category
    } else {
      restaurant.categories.push({ name: categoryName, dishes: [dish] });  // Create new category if it doesn't exist
    }

    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to update a dish in the menu
app.put('/api/restaurant/menu', async (req, res) => {
  try {
    const { categoryName, dish } = req.body;
    const restaurant = await Restaurant.findOne();

    const categoryIndex = restaurant.categories.findIndex((cat) => cat.name === categoryName);
    if (categoryIndex !== -1) {
      const dishIndex = restaurant.categories[categoryIndex].dishes.findIndex((d) => d.name === dish.name);
      if (dishIndex !== -1) {
        restaurant.categories[categoryIndex].dishes[dishIndex] = dish;  // Update existing dish
      }
    }

    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to delete a dish from the menu
app.delete('/api/restaurant/menu', async (req, res) => {
  try {
    const { categoryName, dishName } = req.body;
    const restaurant = await Restaurant.findOne();

    const categoryIndex = restaurant.categories.findIndex((cat) => cat.name === categoryName);
    if (categoryIndex !== -1) {
      restaurant.categories[categoryIndex].dishes = restaurant.categories[categoryIndex].dishes.filter(
        (dish) => dish.name !== dishName
      );
    }

    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Use this route to manage user registration and login as needed
// For user login and registration, refer to the previous routes you provided

// Endpoint to add a dish
app.post('/api/dishes', async (req, res) => {
  try {
    const { name, category, price } = req.body;
    let restaurant = await Restaurant.findOne();

    if (!restaurant) {
      restaurant = new Restaurant({ categories: [] });
    }

    const categoryIndex = restaurant.categories.findIndex((cat) => cat.name === category);
    if (categoryIndex !== -1) {
      restaurant.categories[categoryIndex].dishes.push({ name, price });
    } else {
      restaurant.categories.push({ name: category, dishes: [{ name, price }] });
    }

    await restaurant.save();
    res.status(201).json({ name, price, category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to delete a dish
app.delete('/api/dishes/:dishId', async (req, res) => {
  const { dishId } = req.params;
  const { category } = req.body;
  const restaurant = await Restaurant.findOne();
  
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }

  const categoryIndex = restaurant.categories.findIndex((cat) => cat.name === category);
  if (categoryIndex !== -1) {
    restaurant.categories[categoryIndex].dishes = restaurant.categories[categoryIndex].dishes.filter(d => d._id.toString() !== dishId);
    await restaurant.save();
    res.json({ message: 'Dish deleted successfully' });
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
});


// MongoDB connection URI from environment variables
const uri = process.env.MONGO_URI || "mongodb+srv://taunkkomal6022:hJUoo04diVLmQFMh@cluster0.nu0xln1.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB using Mongoose
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));


// Connect to MongoDB using Mongoose
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample API route
app.get('/', (req, res) => {
  res.send('Hello from MongoDB backend');
});

// User model for registration (assuming you've already created a schema for User)


// Register route
// Register route
app.post('/register', async (req, res) => {
  try {
    const { userId, password, name, phoneNumber, ownerName, restaurantName, address } = req.body;

    if (!userId || !password || !phoneNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let newUser;
    // Check if all fields for a restaurant user are present
    if (ownerName && restaurantName && address) {
      newUser = new User({
        userId: userId.toLowerCase().trim(),
        password,
        ownerName,
        restaurantName,
        address,
        phoneNumber,
        userType: 'restaurant',
      });
    } else {
      newUser = new User({
        userId: userId.toLowerCase().trim(),
        password,
        name,
        phoneNumber,
        userType: 'user',
      });
    }

    console.log('Attempting to save new user:', newUser); // Log user data before saving

    await newUser.save();
    console.log('User saved successfully'); // Confirm if user saved

    res.status(201).json({ message: 'User registered successfully', userType: newUser.userType });
  } catch (error) {
    console.error('Error during user registration:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Login route
// app.post('/login', async (req, res) => {
//   try {
//     const { userId, password } = req.body;

//     // Validate if userId and password are provided
//     if (!userId || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     // Trim userId and password to avoid extra spaces
//     const trimmedUserId = userId.trim().toLowerCase();
//     const trimmedPassword = password.trim();

//     // Find the user by userId
//     const user = await User.findOne({ userId: trimmedUserId });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // Validate the password using bcrypt
//     const isPasswordValid = await bcrypt.compare(trimmedPassword, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // Create a JWT token
//     const token = jwt.sign({ userId: user._id, userType: user.userType }, 'your_jwt_secret', { expiresIn: '1h' });

//     res.status(200).json({
//       message: 'Login successful',
//       userId: user.name,
//       userType: user.userType,
//       token: token,
//     });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

app.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Validate if email and password are provided
console.log({userId,password});

    // Trim email and password to avoid extra spaces
    const userEmail = userId;
    const userPassword = password;

    // Find the user by userId (as your email is stored as userId)
    const user = await User.findOne({ userId: userEmail });

    if (!user || user.password !== userPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      userId: user.name,
      userType: user.userType,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





// API to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error.message);
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
