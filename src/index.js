const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

//middleware between request and route handler
// app.use((req, res, next) => {
//     if(req.method === 'GET'){
//         res.send('GET requests disabled')
//     }
//     else{
//         next()
//     }
// })

// Maintenance mode
// app.use((req, res, next) => {
//     res.status(503).send('Under Maintenance. Check back soon!')    
// })

app.use(express.json()) // parses incoming json into object to access in request handler
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})  

const jwt = require('jsonwebtoken')

const myFun  = async () => {
    const token = jwt.sign({ _id: 'abc123' }, 'thisisacheesecourse', { expiresIn: '7 days' })
    console.log(token)

    const data = jwt.verify(token, 'thisisacheesecourse')
    console.log(data)
}
 
myFun()