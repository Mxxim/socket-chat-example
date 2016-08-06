var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session'); // session组件
var MongoStore = require('connect-mongo')(session); // session组件的数据是存储在内存中的,每次服务器重启,这些数据就消失了,导致用户得重新登陆。因此使用这个中间件把session数据存储到MongoDB中,也叫做session持久化
var fs = require('fs');

var app = express();

var connection = require('./config/mongoose.js')();

var sessionStore = new MongoStore({
    mongooseConnection: connection // 默认将用户信息存到指定数据库的 sessions 集合中,也可以使用 "collection" 属性来指定集合名字
});

var sess = {
    secret: 'chat',   // This is the secret used to sign the session ID cookie
    saveUninitialized: false,     // don't create session until something stored
    resave: false, //don't save session if unmodified
    cookie: {
        maxAge: 60 * 1000 * 60
    },
    store: sessionStore
};

// 导入模型
var walk = function(path){
    fs
        .readdirSync(path)   // 同步读取目录中的所有文件
        .forEach(function(file){
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);  // fs.stat()方法用于查询文件信息
            if(stat.isFile()){
                if(/(.*)\.(js|coffee)/.test(file)){
                    require(newPath);
                }
            } else if(stat.isDirectory()){
                walk(newPath);
            }
        })
};

walk(__dirname + '/models');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());     // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess)); // 使用session中间件

//app.use('/', routes);
// var routes = require('./routes/index');
app.use('/user', require('./routes/userRoute'));

app.use(function(req,res,next){   // 除了静态文件的请求以外,其他所有的HTTP请求,都会输出index.html文件,服务器端不关心路由,所有路由逻辑均给浏览器端的AngularJS去处理。
  res.sendFile('./app/index.html')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = {
    app: app,
    sessionStore: sessionStore
};
