let express = require('express')
let app = express()
app.use(express.static('public'))
app.listen(8080)

let child_process = require('child_process')
app.get('/screencap', (req,res)=>{
    let imgs = '/home/bc/optional/nodejs/my-jump-game/public/images'
    let cmd = `adb exec-out screencap -p > ${imgs}/screen.png`
    console.log(cmd)
    exec(cmd, ()=>{
        res.end('ok')
    })
})
app.get('/jump', (req,res)=>{
    let time = parseInt(req.query.t)
    let cmd = 'adb shell input touchscreen swipe 170 187 170 187 ' + time
    console.log(cmd)
    exec(cmd, ()=>{
        res.end('ok')
    })
})

function exec(cmd, cb){
    child_process.exec(cmd, (err)=>{
        if(err) console.log(err)
        else cb()
    })
}
