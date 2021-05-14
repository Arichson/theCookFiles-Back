require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');
const path = require('path');

const SECRET = process.env.SECRET_KEY
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { hash, jsonAuth, auth } = require('./controllers/authController');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI
const db = mongoose.connection;
app.use(cors())
mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
db.on('open', () => {
    console.log('Mongo is Connected');
});
/* Middleware */
app.use(express.json());
app.use('/users', require('./controllers/userController'))
if (process.env.NODE_ENV !== 'development'){
  app.use(express.static('public'))
}
/* Controller Goes Here Remove the tes*/
app.get("/", (req,res) => {
    res.send("HOME")
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = hash(password);
    User.findOne({ username },  (err, foundUser) => {
        if(err){
            res.status(400).json({ msg: err.message })
        } else {
            if(bcrypt.compareSync(hashedPassword, foundUser.password)){
                const token = jwt.sign({
                    id: foundUser._id,
                    username: foundUser.username,  
                }, SECRET)
                res.status(200).json({ 
                    token,
                    username: foundUser.username,
                    id: foundUser._id
                })
            } else {
                res.status(500).json({
                    problem: 'The comparison did not work, did you change your hash algo'
                })
            }
        }
    })
})

app.post('/register',
    (req, res) => {
    const passwordHash = hash(req.body.password)
    req.body.password = bcrypt.hashSync(passwordHash, bcrypt.genSaltSync(10))
    console.log(req.body)
    User.create(req.body, (err, createdUser) => {
        if(err){
            console.log(err)
            res.status(400).json({
                msg: err.message
            })
        } else {
            const token = jwt.sign({
               id: createdUser._id,
               username: createdUser.username 
            }, SECRET)
            res.status(200).json({
                token
            })
        }
    })
})

/* Controller Ends here */
//LISTENER


// for react router
app.get('*', (req, res) => {
	res.sendFile(path.resolve(path.join(__dirname, 'public', 'index.html')))
})

app.listen(PORT, () => {
    console.log(`API Listening on port http://localhost:${PORT}`);
});

