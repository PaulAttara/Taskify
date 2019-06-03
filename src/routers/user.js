const express = require('express')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')

const authentication = require('../middleware/authentication')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')
const router = new express.Router()


router.post('/users', async (req, res) => { ///users: api route

    const user = new User(req.body)

    try{
        await user.save()  
        const email = await sendWelcomeEmail(user.email, user.name) 
        console.log(email)
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
        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(e) {
        res.status(500).send()
    }
})
 
const upload = multer({
    limits: {
        // dest: 'avatars', //use to save files locally, otherwise, save to user model
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})
// use async when use await
router.post('/users/me/avatar', authentication, upload.single('avatar'), async(req, res) => {
    // resize and convert to png
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()  
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message }) //overwriting response and filling in body with error msg only rather that html (this argument is to handle uncaught errors as request is processed)
})

router.delete('/users/me/avatar', authentication, async(req, res) => {
    if(req.user.avatar === undefined){
        return res.status(404).send()
    }
    req.user.avatar = undefined
    await req.user.save()
    res.send()  
})

// user browser to view this image
router.get('/users/:id/avatar', async(req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch(e){
        res.status(404).send()
    }
})

module.exports = router