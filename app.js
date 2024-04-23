const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Import the path module
const app = express();
// const PORT = 3000;
require('dotenv').config;
const PORT = process.env.PORT || 3000;


app.use(express.static("public"))
const mongoURI =  process.env.MONGO_URI;
app.use(express.urlencoded({extended: true}))
app.use(express.json())





// app.set("view engine" , "pug")
app.set("view engine" , "ejs")

app.get("/" , (req ,res) => {
    console.log("Welcome to home page!");
    res.render("index")
})

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Use path.join to correctly reference the public directory

// Connect to MongoDB
mongoose.connect('mongodb+srv://rishusharma123321:701008029030@cluster0.sechxfe.mongodb.net/', {
    useNewUrlParser: true, // Add useNewUrlParser option
    useUnifiedTopology: true // Add useUnifiedTopology option
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err.message)); // Handle connection error

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.get('/users', (req, res) => {
    User.find({})
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ message: err.message }));
});

app.post('/users', (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save()
        .then(newUser => res.status(201).json(newUser))
        .catch(err => res.status(400).json({ message: err.message }));
});

app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updateData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    User.findByIdAndUpdate(userId, updateData, { new: true })
        .then(updateUser => {
            if (!updateUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(updateUser);
        })
        .catch(err => res.status(400).json({ message: err.message }));
});

app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;

    User.findByIdAndDelete(userId)
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        })
        .catch(err => res.status(400).json({ message: err.message }));
});

app.listen(PORT, () => {
    console.log(`Server is listening to the port ${PORT}`);
});