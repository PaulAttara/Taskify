const express = require('express')
const User = require('../models/user')
const authentication = require('../middleware/authentication')
const router = new express.Router()

router.post('/users', async (req, res) => { ///users: api route

    const user = new User(req.body)

    try{
        await user.save()   
        const token = await user.generateAuthToken() //created method in models
        res.status(201).send({ user, token }) 
    } catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password) //created method in models
        const token = await user.generateAuthToken() //created method in models
        res.send( { user, token })
    } catch(e){
        res.status(400).send()
    }
})
// logout of single device rather than all device, so need to filter to find which to remove(comes from req) 
router.post('/users/logout', authentication, async(req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', authentication, async(req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/users/me', authentication, async (req, res) => {
    // executed after middleware calls next
    res.send(req.user)
})
// using auth gives you access to the user with req.user
router.patch('/users/me', authentication, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) //return true if includes ALL: all or nothing

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try{
        updates.forEach((update) => req.user[update] = req.body[update]) //user bracket because cant use dot without knowuing property name

        await req.user.save()

        res.send(req.user)
    } catch (e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', authentication, async (req, res) => {
    try{
        // const user = await User.findByIdAndDelete(req.user._id)

        // if(!user){
        //     return res.status(404).send()
        // }

        await req.user.remove()

        res.send(req.user)
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router