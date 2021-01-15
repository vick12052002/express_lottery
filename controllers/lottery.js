/* eslint-disable import/no-unresolved */
/* eslint-disable object-curly-newline */
/* eslint-disable no-bitwise */
/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
/* eslint-disable import/order */
const { User, Lottery } = require('../models');
const bcrypt = require('bcrypt');

function getLotteryRandom(array, arraySum, originData) {
  const weightRandom = Math.floor(Math.random() * Math.floor(arraySum)); // 隨機變數
  const newArray = array.concat(weightRandom).sort((a, b) => a - b); // 將隨機變數加入到陣列中，並遞升排序
  let randomIndex = newArray.indexOf(weightRandom); // 隨機變數的索引，在重新排序的陣列中位置
  randomIndex = Math.min(randomIndex, array.length - 1); // 隨機變數的索引，不可超過獎項數組的長度-1
  return originData[randomIndex];
}

const lotteryController = {
  homePage: (req, res) => {
    if (res.locals.username) {
      Lottery.findAll().then((prices) => {
        res.render('index', { prices: prices });
      });
    } else {
      const prices = null;
      res.render('index', { prices: prices });
    }
  },
  handleLogin: (req, res, next) => {
    const { username, password } = req.body;
    if (!username | !password) {
      req.flash('errorMessage', '必填項目未填寫');
      return next();
    }
    User.findOne({
      where: {
        username,
      },
    }).then((user) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
          req.flash('errorMessage', '帳號或密碼錯誤');
          return next();
        }
        console.log('success login!!!');
        req.session.username = user.username;
        res.redirect('/');
      });
    }).catch((err) => {
      console.log(err.toString());
      req.flash('errorMessage', '使用者不存在');
      return next();
    });
  },
  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/');
  },
  deleteLottery: (req, res) => {
    const priceId = req.params.id;
    Lottery.destroy({
      where: {
        id: priceId,
      },
    }).then(() => {
      console.log('刪除成功');
      res.redirect('back');
    }).catch((err) => {
      console.log(err.toString());
      req.flash('errorMessage', '文章讀取錯誤');
      res.redirect('/');
    });
  },
  handlesAddLottery: (req, res, next) => {
    const {
      name, description, img, weight } = req.body;
    Lottery.create({
      name,
      description,
      img_url: img,
      weight,
    }).then(() => {
      req.flash('infoMessage', '文章新增成功！');
      res.redirect('/');
    }).catch((err) => {
      console.log(err.toString());
      req.flash('errorMessage', '文章新增失敗！請再試一次');
      next();
    });
  },
  handleUpdateLottery: (req, res) => {
    const priceId = req.params.id;
    const { name, description, img, weight } = req.body;
    Lottery.findOne({
      where: {
        id: priceId,
      },
    }).then((price) => {
      price.update({
        name,
        description,
        img_url: img,
        weight,
      });
    }).then(() => {
      console.log('更新成功!');
    }).catch((err) => {
      console.log(err.toString());
      req.flash('errorMessage', '獎項更新失敗');
    })
      .finally(() => {
        res.redirect('/');
      });
  },
  getLottery: (req, res) => {
    let allPrices;
    Lottery.findAll({
      order: ['id', 'name', 'description', 'img_url', 'weight'],
    }).then((prices) => {
      allPrices = prices.sort((a, b) => a.weight - b.weight);
      const priceWeight = Object.values(allPrices).map(item => item.weight);
      const priceWeightSum = priceWeight.reduce((a, b) => a + b);
      console.log(getLotteryRandom(priceWeight, priceWeightSum, allPrices))
      res.json(getLotteryRandom(priceWeight, priceWeightSum, allPrices));
    }).catch((err) => {
      console.log(err.toString());
      res.redirect('/');
    });
  },
  getAllLotteries: (req, res) => {
    if (res.locals.username) {
      Lottery.findAll().then((prices) => {
        res.json(prices);
      });
    } else {
      Lottery.findAll({
        attributes: ['name', 'description','img_url']
      }).then((prices) => {
        res.json(prices);
      });

    }
  },
};

module.exports = lotteryController;
