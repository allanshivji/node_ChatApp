var express = require('express')
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.Promise = Promise

var dbUrl = "mongodb+srv://<username>:<password>@learningnodesocket-vlyct.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB is connected')
})


var Message = mongoose.model('Message', {
    name: String,
    message: String
})


app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    });
})

// This route is just for testing purpose /////////////////
app.get('/messages/:user', (req, res) => {
    var user = req.params.user
    Message.find({name: user}, (err, messages) => {
        res.send(messages)
    });
})
////////////////////////////////////////////////////////////

app.post('/messages', async (req, res) => {
    try {
        var message = new Message(req.body)
        var savedMessage = await message.save()

        console.log('SAved')
        var censored = await Message.findOne({ message: 'badword' })

        if (censored) {
            await Message.remove({ _id: censored.id })
        } else {
            io.emit('message', req.body)
        }
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        return console.log(error)
    } finally {
        console.log('Message Post called')
    }

})


io.on('connection', (socket) => {
    console.log('User Connected')
})


var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
});