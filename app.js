var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport')
var session = require('express-session')
var flash = require('connect-flash')

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let fbRouter = require('./routes/fb')
let ggRouter = require('./routes/google')


require('./passport_setup.js')(passport)
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.enable("trust proxy");

app.use(session({ secret: 'big small secret'}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user
  }
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/facebook', fbRouter)
app.use('/google', ggRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
