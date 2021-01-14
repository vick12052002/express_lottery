/* eslint-disable consistent-return */
/* eslint-disable import/no-unresolved */
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require('path');
const cors = require('cors')
const lotteryController = require('./controllers/lottery');

const app = express();
const port = process.env.PORT || 3001;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());
app.use(cors())

app.use(session({
  secret: process.env.TEST,
  resave: false,
  saveUninitialized: true,
}));

app.use((req, res, next) => {
  res.locals.username = req.session.username || false;
  res.locals.errorMessage = req.flash('errorMessage');
  next();
});

app.use('/system', (req, res, next) => {
  if (!res.locals.username) {
    req.flash('errorMessage', '你沒有權限');
    return res.redirect('/');
  }
  next();
});

function redirectBack(req, res) {
  res.redirect('back');
}

app.get('/', lotteryController.homePage);
app.post('/login', lotteryController.handleLogin, redirectBack);
app.get('/logout', lotteryController.logout);
app.get('/system/delete/:id', lotteryController.deleteLottery);
app.post('/system/add', lotteryController.handlesAddLottery, redirectBack);
app.post('/system/update/:id', lotteryController.handleUpdateLottery);
app.get('/get-lottery', lotteryController.getLottery);
app.get('/all-lottery', lotteryController.getAllLotteries);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
