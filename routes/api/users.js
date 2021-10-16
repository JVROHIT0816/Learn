const express = require('express');
const {check, validationResult} = require('express-validator/check');
const router = express.Router();
//@route  POST api/users
//@desc   Registration of Users
//@access Public
router.post('/', 
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Enter a Valid Email').isEmail(),
    check('password', 'Should be 6 or more charectors').isLength({min:6})
], 
(req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()});
    }
    console.log(req.body);
    res.send(`User Route`);
});


module.exports = router;