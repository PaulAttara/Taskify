// const doWorkPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         // resolve([7, 4, 1])
//         reject('Things went wrong')
//     }, 2000)
// })

// doWorkPromise.then((result) => {
//     console.log('Success', result)
// }).catch((error) => {
//     console.log('Error', error)
// })

//new section: promises-chain

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b)
        }, 2000)
    })
}

// add(1, 2).then((sum) => {
//     console.log(sum)
// }).catch((e) => {
//     console.log(e)
// })

// Promise chaining

add(1, 8).then((sum) => { //promise 1
    console.log(sum)
    return add(sum, 3) //promise 2
}).then((sum) => {
    console.log(sum)
}).catch((e) => {
    console.log(e)
})