const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks', async (req, res) => { ///users: api route
    
    const task = new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send(error)
    }
})

router.get('/tasks', async (req, res) => {
    try{
        tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch(e){
        res.status(500).send()
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    
    try{
        task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        
        res.send(task)
    } catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) //return true if includes ALL: all or nothing

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try{
        const task = await Task.findById(req.params.id)

        updates.forEach((update) => task[update] = req.body[update]) //user bracket because cant use dot without knowuing property name

        await task.save()

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch (e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router