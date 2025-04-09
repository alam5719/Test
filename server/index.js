import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (formdata DB, local)
mongoose.connect('mongodb://localhost:27017/formdata')
  .then(() => {
    console.log('Connected to MongoDB: formdata');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Define schema and model (users collection)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

// POST /api/users - Add user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

// GET /api/users - Fetch all users (optional)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
