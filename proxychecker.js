const axios = require('axios');
const fs = require('fs');
const proxyWriter = fs.createWriteStream('workingproxy.txt', {
    flags: 'a' // append old data
})

let currentIndexProxy = 0

const getListProxy = () => {

    try {
        var data = fs.readFileSync('proxies.txt', 'utf8');
        return data
    } catch (e) {
        console.log('Error:', e.stack)
    }
}


const proxies = getListProxy().split('\n')

const checkProxy = async (host, port) => {

    fs.writeFile('workingproxy.txt', '', () => {
        return null
    })
    proxyWriter.write("PROXY:PORT")


    try {
        let progress = `${currentIndexProxy + 1}/${proxies.length}`
        console.log(`Progress: ${progress}`)
        const res = await axios.get('https://icanhazip.com', {
            timeout: 35000,
            proxy: {
                protocol: 'http',
                host: host,
                port: parseInt(port),

            }
        });

        let workingProxy = `\n${host}:${port}`
        let response = res.data
        console.log(`Working Proxy ${host}:${port}`)
        proxyWriter.write(workingProxy)
    } catch (err) {
        currentIndexProxy += 1
        if (currentIndexProxy < proxies.length) {
            const currentProxy = proxies[currentIndexProxy]

            let host = getCurrentProxy(currentProxy).host
            let port = getCurrentProxy(currentProxy).port

            return checkProxy(host, port)
        }
        proxyWriter.end()
        return console.log('Check proxy done')
    }
}

const getCurrentProxy = (proxy) => {
    let splitedItem = proxy.split(":")
    return {
        host: splitedItem[0],
        port: splitedItem[1]
    }
}


const currentProxy = proxies[currentIndexProxy]
let host = getCurrentProxy(currentProxy).host
let port = getCurrentProxy(currentProxy).port
console.log(`Please wait checking: ${proxies.length} proxy`)
checkProxy(host, port)