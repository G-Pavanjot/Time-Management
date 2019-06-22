const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidate, loginValidate} = require('../formValidation')


router.post('/register', async (req, res) => {
    
    //VALIDATE DATA BEFORE MAKING USER
    const { error } = registerValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send("Email already exists");

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPWord = await bcrypt.hash(req.body.password, salt);

    //create the new user
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPWord
    });
    try {
        await user.save();
        res.send({user: user._id});
    }
    catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    //Validate the data before login
    const {error} = loginValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if the login account exisits
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Account does not exist');

    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid Password');

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn: "1d"});
    res.header('auth-token', token).send();
});

module.exports = router;