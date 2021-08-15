const express = require('express')
const os = require('os')
const fs = require('fs')
const ejs = require('ejs')
const app = express()
const scheme = 'http://'
const domain = getLocalIpAddress()
const port = 3000
const baseUrl = scheme + domain + ':' + port

const htmlFolderPath = '/html'
const indexTemplatePath = '.' + htmlFolderPath + '/index.html'

app.all(/^\/.+$/, express.static(__dirname + htmlFolderPath))

app.all(/\/$/, (req, res) => {
    const path = req.url.slice(0, -1)
    const top = path == ''
    const accessUrl = baseUrl + path
    const readingPath = '.' + htmlFolderPath + path
    getUrlAndTitleList(top, accessUrl, readingPath, (urlAndTitleList) => {
        const html = ejs.render(fs.readFileSync(indexTemplatePath, 'utf8'), {
            accessUrl: accessUrl,
            readingPath: readingPath,
            urlAndTitleList: urlAndTitleList
        })
        res.send(html)
    })
})

app.listen(port, () => {
    console.log('html-loader')
    console.log('Refer to ' + baseUrl)
    console.log('Ends in [control + C]')
})

function getLocalIpAddress() {
    var nis = os.networkInterfaces()
    nis = Object.keys(nis)
    .flatMap((key) => nis[key])
    .filter((ni) => ni.family == 'IPv4' && !ni.internal)
    
    var address
    if (nis.length > 0) {
        address = nis[0].address
    }
    
    return address
}

function getUrlAndTitleList(top, accessUrl, readingPath, complete) {
    fs.readdir(readingPath, (err, fileList) => {
        function createUrlAndTitleList(file) {
            return {href: accessUrl + '/' + file, title: file}
        }
        
        var _fileList = []
        
        if (!top) {
            _fileList.push('..')
        }
        
        if (fileList) {
            _fileList = _fileList.concat(fileList)
            _fileList = _fileList
            .filter((file) =>
                    indexTemplatePath != readingPath + "/" + file
                    && (file == '..'
                    || file.match(/^(?!\.).*$/)))
        }
        
        let urlAndTitleList = _fileList
        .map((file) => createUrlAndTitleList(file))
        
        complete(urlAndTitleList)
    })
}
