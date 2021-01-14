/* eslint-disable consistent-return */
const lotteryBtn = document.querySelector('.lottery_btn');
const loginArea = document.querySelector('.login_form');

function loadLotteryInfo(data) {
  const priceArea = document.querySelector('.price_area');
  const template = `<div class="price_area">
  <h2 class="price_title">${data.name}</h2>
  <h3 class="price_description">${data.description}</h3>
  <div class="d-flex justify-content-center " >
  <img src="${data.img_url}" alt="${data.name}" class="rounded price_img" width="25%" ></div>
  </div>`;
  priceArea.outerHTML = template;
}
function getLottery(cb) {
  const requestUrl = 'http://aaa.alirong.tw/get-lottery';
  fetch(requestUrl, {
    method: 'GET',
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  }).then(json => cb(null, json))
    .catch((err) => {
      console.log(err);
      return cb('錯誤');
    });
}
lotteryBtn.addEventListener('click', () => {
  if (loginArea.classList.contains('show')) {
    loginArea.classList.remove('show');
  }
  if (document.querySelector('.setup_btn')) {
    if (document.querySelector('.system_area').classList.contains('show')) {
      document.querySelector('.system_area').classList.remove('show');
    }
  }
  getLottery((err, data) => {
    if (err) {
      return err;
    }
    loadLotteryInfo(data);
  });
});


if (document.querySelector('.setup_btn')) {
  document.querySelector('.setup_btn').addEventListener('click', () => {
    const lotteryArea = document.querySelector('.price_area');
    document.querySelector('.system_area').classList.toggle('show');
    if (!lotteryArea.classList.contains('disappear')) {
      lotteryArea.classList.add('disappear');
    }
  });
}

if (document.querySelector('.login_btn')) {
  document.querySelector('.login_btn').addEventListener('click', () => {
    loginArea.classList.toggle('show');
    document.querySelector('.price_area').classList.toggle('disappear');
  });
}
