require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('5ced5ec46b195a4ba097e085', { age: 1 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 1 }) //2nd promise: count all users that have that same age
// }).then((result) => {   
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAgeAndCount = async(id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
}

updateAgeAndCount('5ced5ec46b195a4ba097e085', 2).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})

// use await in async function
// if u have the following
// await call 1
// await call 2
// await call 3
// if have problem in await call 1, stops and the other lines dont get executed.