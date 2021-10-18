const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const user = require('../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');

//@route  GET api/auth
//@desc   Register route
//@access Public
router.get('/', auth, async(req,res)=> {
    try{
       const user = await User.findById(req.user.id).select('-password');
       res.json(user);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route  Post api/auth
//@desc   Authenthic route & get user token
//@access Public
//Just checking something

router.post('/', 
[
    check('email', 'Enter a Valid Email').isEmail(),
    check('password', 'Wrong Password').exists()
], 
async (req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password} = req.body;
    try{
        let User = await user.findOne({email});
        if(!User)
        {
            return res.status(400).json({errors: [{msg: 'Invalid User Credential'}]});
        }
        const isMatch = await bcrypt.compare(password, User.password);
        //console.log("Hi: ",isMatch)
        
        if(!isMatch){
            return res.status(400).json({errors:[{msg: 'Invalid User Credential'}]});
        }
        const payload = {
            user: {
                id : User.id
            }
        }
        jwt.sign(payload, 
            config.get('jwtsecret'),
            {expiresIn: 360000}, 
            (err,token) =>{
                if(err) throw(err);
                //console.log({token});
                res.json({token});
            });
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    //res.send(`User Registered`);
});


module.exports = router;