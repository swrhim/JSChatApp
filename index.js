var express = require('express')
  , app = express()
  , fs = require('fs')
  , options = {
    key: fs.readFileSync('./cert/client.key'),
    cert: fs.readFileSync('./cert/client.crt'),
    requiestCert:true
  };
var https = require('https').Server(options, app);
var io = require('socket.io')(https);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


app.get('/', function(req, res){
  //res.send('<h1>TEST</h1>');
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/css'));

//redirect to occur even if the client does not specify the https
app.use(function(req, res, next) {
  if(!req.secure) {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

https.listen(3000, function()
{
  console.log('listening on *:3000');
});






