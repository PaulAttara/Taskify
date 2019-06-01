const express = require('express')
const Task = require('../models/task')
const authentication = require('../middleware/authentication')
const router = new express.Router()

router.post('/tasks', authentication, async (req, res) => { ///users: api route
    
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send(error)
    }
})

// GET /tasks/?completed=true
// GET /tasks?limit=10&skip=10 //skip=0 is first page, skip=10 is second page
// GET /tasks?sortBy=createdAt:asc or desc
router.get('/tasks', authentication, async (req, res) => {
    try{
        const match = {}
        const sort = {}

        if(req.query.completed){
            match.completed = req.query.completed === 'true' //need to convert true/false string to boolean
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        
        user = req.user
        await user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(user.tasks)
    } catch(e){
        res.status(500).send()
    }
})

router.get('/tasks/:id', authentication, async (req, res) => {
    const _id = req.params.id
    
    try{
        // const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id })
        if(!task){
            return res.status(404).send()
        }
        
        res.send(task)
    } catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id', authentication, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) //return true if includes ALL: all or nothing

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update]) //user bracket because cant use dot without knowuing property name
        await task.save()

        res.send(task)
    } catch (e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', authentication, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router