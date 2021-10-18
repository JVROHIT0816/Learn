const express = require('express');
const router = express.Router();
const user = require('../../models/user');
const {check, validationResult} = require('express-validator/check');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
//@route  POST api/users
//@desc   Registration of Users
//@access Public
router.post('/', 
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Enter a Valid Email').isEmail(),
    check('password', 'Should be 6 or more charectors').isLength({min:6})
], 
async (req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()});
    }
    const {name, email, password} = req.body;
    try{
        let User = await user.findOne({email});
        if(User)
        {
            return res.status(400).json({errors: [{msg: 'User already exists'}]});
        }
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })
        User = new user({name, email, avatar, password});
        const salt = await bcrypt.genSalt(10);
        User.password = await bcrypt.hash(password, salt);
        await User.save();
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    res.send(`User Registered`);
});




module.exports = router;