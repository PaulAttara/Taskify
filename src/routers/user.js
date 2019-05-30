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

router.get('/users/me', authentication, async (req, res) => {
    // executed after middleware calls next
    res.send(req.user)
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch(e){
        res.status(500).send()
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) //return true if includes ALL: all or nothing

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try{
        const user = await User.findById(req.params.id)

        updates.forEach((update) => user[update] = req.body[update]) //user bracket because cant use dot without knowuing property name

        await user.save()

        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    } catch (e){
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router