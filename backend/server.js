require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path =require('path')


const app = express()
app.use(express.json())
app.use(cors())



// Schema
const todoSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    }
})

// Create Model
const todoModel = mongoose.model('Todo', todoSchema)


//  mongodb+srv://amsith:MuG8okIi0gCwVWhi@amsithdev.7ikom.mongodb.net/?retryWrites=true&w=majority&appName=AmsithDev
//Mongo DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('DB Connected'))
.catch((err) => console.log(err));







//Create 
app.post('/todos', async (req, res) => {

    const { name, age } = req.body;
    try {
        const newTodo = new todoModel({ name, age });
        await newTodo.save();
        res.status(201).json(newTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })

    }
})

// GET
app.get('/todos', async (req, res) => {
    try {
        const table = await todoModel.find()
        res.json(table)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })

    }
})

// GET - Fetch a specific Todo by ID
app.get('/todos/:id', async (req, res) => {
    try {
        const todo = await todoModel.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json(todo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// PUT
app.put('/todos/:id', async (req, res) => {
    try {
        const { name, age } = req.body;
        const id = req.params.id;

        // Find the todo item by ID and update it
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { name, age },
            { new: true } // Return the updated document
        );

        // Check if the todo item was found and updated
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        // Respond with the updated todo item
        res.json(updatedTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});




//Delete 
app.delete('/todos/:id', async (req, res) => {

    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end()
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }

})


// Serve static files from the 'dist' folder
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Fallback for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


//Server
const port = process.env.PORT;
app.listen(port, () => {
    console.log('Server connected  ' + port);
});
//   http://localhost:3000/todo

