const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(a < 0 || b < 0){
                return reject('Numbers must be non-negative')
            }
            resolve(a + b)
        }, 2000)
    })
}

const doWork = async() => {
    const sum = await add(1, 999)
    const sum2 = await add(sum, 12)
    const sum3 = await add(sum2, -14)
    return sum3
}

doWork().then((result) => {
    console.log('result', result)
}).catch((e) => {
    console.log('e', e)
})