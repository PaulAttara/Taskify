const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT  // || 3000 not necessary with env variables

app.use(express.json()) // parses incoming json into object to access in request handler
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})  

const Task = require('./models/task')
const User = require('./models/user')


const main = async () => {
    const task = await Task.findById('5cf0708d30fe91718a803ee6')
    await task.populate('owner').execPopulate() // fill in the task object with user properties
    console.log(task.owner)
    
    // get task object with user's id  
    const user = await User.findById('5cf06ffe80147c717af6b764')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}
// main()