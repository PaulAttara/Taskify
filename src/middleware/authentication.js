const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authentication = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '') // find provided header
        const decoded = jwt.verify(token, 'thisischeese') // validate header
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) // find user with correct id who has this token still stored in array

        if(!user) {
            throw new Error()
        }
        
        req.token = token
        req.user = user
        next()
    }
    catch(e){
        res.status(401).send({ error: 'Please Authenticate.' })
    }
}

module.exports = authentication
