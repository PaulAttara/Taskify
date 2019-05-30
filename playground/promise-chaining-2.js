require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5ced84f5ac77c843b0c1a9bf').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((count) => {
//     console.log(count)
// }).catch((e) => {
//     console.log(e)
// })


const deleteTaskAndCount = async(id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteTaskAndCount('5ced851df0340a2d705f05d0').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})
