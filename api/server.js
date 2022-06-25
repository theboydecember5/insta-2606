require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const SocketSever = require('./socketSever')


const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())


// SocketIO
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', socket => {
    SocketSever(socket)
})





// Router

app.use('/api', require('./routers/authRouter'))
app.use('/api', require('./routers/userRouter'))
app.use('/api', require('./routers/postRouter'))
app.use('/api', require('./routers/commentRouter'))
app.use('/api', require('./routers/notifyRouter'))
app.use('/api', require('./routers/messageRouter'))

mongoose.connect(process.env.MONGODB_URL, () => {
    console.log('Connected to MongoDB')
})

app.get('/', (req, res) => {
    res.json({ msg: 'Hello' })
})

const port = 5000
http.listen(port, () => {
    console.log('Server is running on port', port)
})