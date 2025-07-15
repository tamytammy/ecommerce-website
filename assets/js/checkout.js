//付款使用暫存資料庫
function setItemTep(key, value){
    sessionStorage.setItem(key, JSON.stringify(value))
}
function getItemTep(key){
    return JSON.parse(sessionStorage.getItem(key))
}
function removeItemTep(key){
   sessionStorage.removeItem(key)
}

//儲存到暫時session(步驟三渲染使用)
function saveInfoTemp(){
    //抓html元素的值、存進sessionStorage
    const checkUsername = document.getElementById('checkout-name').value
    const checkPhone = document.getElementById('checkout-phone').value
    const checkMail = document.getElementById('checkout-mail').value
    const checkAdr = document.getElementById('checkout-address').value
    const checkPay = document.getElementById('checkout-payment').value
    
    const checkInfo = {
        checkUsername,
        checkPhone,
        checkMail,
        checkAdr,
        checkPay
    }

    const users = getItem('users') || []
    const user = users.find(u => u.username === getItem('loggedInStatus'))
    //先清空使用者原先的orders,避免錯誤
    user.orders = []
    if(user.orders){
        user.orders[0] = checkInfo        
    }else{
        user.orders.push(checkInfo)
    }
    setItemTep('users', [user])
}
//渲染結帳頁面-購物車
function renderCheckout(){
    const loginUser = getItem('loggedInStatus')
    let users = getItem('users') || []
    const user = users.find(u => u.username === loginUser)
    let orderTotal = 0
    cartData = user.cart || []
    $('.order-cart').empty()
    cartData.forEach(data => {
        $('.order-cart').append(`
            <div class="order__item">
                <p>${data.name}</p>
                    <div class="order__item-img">
                     <img src="${data.image}" alt="${data.name}">
                     </div>
                     <div class="order__item-amount">
                      <span class="itemNum">${data.quantity}</span>
                    </div>
                    <div class="order__item-price">
                       $
                     <span class="itemPrice">${data.price}</span>
                    </div>
            </div>
        `)
         orderTotal += data.price * data.quantity  
    })
    $('.order__item-total-price').text(orderTotal) 
}
//渲染結帳頁面-個人付款資訊
function renderCheckInfo(){
    let users = getItemTep('users') || []
    const user = users.find(u => u.username === getItem('loggedInStatus'))
    const checkInfo = user.orders

    $('.personal__info').empty()

    checkInfo.forEach(info=>{
        $('.personal__info').append(`
            <div class="personal__info-text">
                <p>姓名：<span>${info.checkUsername}</span></p>
                <p>電話：<span>${info.checkPhone}</span></p>
                <p>Email：<span>${info.checkMail}</span></p>
                <p>收件地址：<span>${info.checkAdr}</span></p>
                <p>付款方式：<span>${info.checkPay}</span></p>
            </div>
        `)
    })
}

//確認結帳時儲存訂單
function saveOrders(){
  const loginUser = getItem('loggedInStatus')
  let users = getItem('users') || []
  const user = users.find(u => u.username === loginUser)
  
  //暫存
  let usersTep = getItemTep('users') || []
  const userTep = usersTep.find(u => u.username === loginUser)
  let orders = userTep.orders

  const createOrder = {
    createdDate: new Date().toLocaleString(),
    createdNumber: "LN" + new Date().getTime(),
    orderPrice : user.totalAmount,
    orderPayment : orders[0].checkPay,
    orderAdr : orders[0].checkAdr,
    orderMail : orders[0].checkMail,
    items: userTep.cart
  }
  
  user.orders.push(createOrder)
  user.cart = []
  setItem('users', users)
  removeItemTep('users')
}



function goCheck(){
    const users = getItemTep('users') || []
    const user = users.find(u => u.username === getItem('loggedInStatus'))
    const checkInfo = user.orders

    if(checkInfo[0].checkPay == "行動支付"){
        checkoutLinePay()
        // saveOrders()
        // sendEmail()
    }else if(checkInfo[0].checkPay == "信用卡"){
        alert(checkInfo[0].checkPay)
        saveOrders()
    }else if(checkInfo[0].checkPay == "ATM虛擬帳號繳款"){
        window.location.href="./ecpay-atm.html"
        saveOrders()
    }
}
//line pay
function checkoutLinePay() {
  const loginUser = getItem('loggedInStatus')
  let users = getItem('users') || []
  const user = users.find(u => u.username === loginUser)
  console.log(user)

      fetch("https://tamytammy.free.beeceptor.com/checkout-linepay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          amount: user.totalAmount,
          currency: "TWD",
          orderId: "MKSI_S_20180904_1000001",
          packages: [
            {
              id: "1",
              amount: user.totalAmount
            }
          ],
          redirectUrls: {
            confirmUrl: "https://tamytammy.github.io/ecommerce-website/confirm.html",
            cancelUrl: "https://tamytammy.github.io/ecommerce-website/cancel.html"
          }
        })
      })
      .then(res => {
        if (!res.ok) {
          throw new Error("伺服器回應失敗");
        }
        return res.json();
      })
      .then(data => {
        console.log("Mocky回傳資料:", data);
        if (data.returnCode === "0000") {
          window.location.href = data.info.paymentUrl.web;
        } else {
          alert('付款失敗: ' + data.returnMessage);
        }
      })
      .catch(err => {
        console.error("錯誤", err);
        alert('模擬付款 API 呼叫失敗!');
        window.location.href = "./cancel.html"; 
            });
}
  
//credit card

//atm


//點擊nextBtn前往下一步驟，下一個div data-step="2"
$(document).on('click', '.nextBtn', function(){
    const num = $(this).data('step')
    const moveContent = document.querySelector('.checkStep-container')
    const titles = document.querySelectorAll('.check__title')
    const bars = document.querySelectorAll('.progressBar')
    
    titles.forEach(t => {
        let stepNum = t.dataset.step
        if(num == stepNum){
            moveContent.style.transform = `translateX(-${num *100}%)`
        }
    })

    bars.forEach(b => {
            let barNum = b.dataset.step
            if(num == barNum){
                b.nextElementSibling.classList.add('active')
                b.classList.remove('active')
            }
    })

    saveInfoTemp();
    renderCheckout();
    renderCheckInfo();

    
})

$(document).on('click', '.prevBtn', function(){
    const num = $(this).data('step')
    const moveContent = document.querySelector('.checkStep-container')
    const titles = document.querySelectorAll('.check__title')
    const bars = document.querySelectorAll('.progressBar')
    titles.forEach(t => {
        let stepNum = t.dataset.step
        if(num == stepNum){
            moveContent.style.transform = `translateX(${-(num-2)*100}%)`
        }
    })

    bars.forEach(b => {
            let barNum = b.dataset.step
            if(num == barNum){
                b.previousElementSibling.classList.add('active')
                b.classList.remove('active')
            }
        })

    
})

//確定訂單內容
function renderConfirmPage(){
  const loginUser = getItem('loggedInStatus')
  const users = getItem('users') || []
  const user = users.find(u => u.username === loginUser)
  const orderInfo = user.orders[user.orders.length - 1]
  $('.order-num').text(orderInfo.createdNumber)
  $('.order-date').text(orderInfo.createdDate)
  $('.order-price').text(orderInfo.orderPrice)
  $('.order-adr').text(orderInfo.orderAdr)
  $('.order-mail').text(orderInfo.orderMail)

}

function renderOrderPage(){
  const loginUser = getItem('loggedInStatus')
  const users = getItem('users') || []
  const user = users.find(u => u.username === loginUser)
  const orderInfos = user.orders
  const orderList = document.querySelector('.order-list')
  orderList.innerHTML = ''

  orderInfos.forEach(info=>{
  const wrapper = document.createElement('div')
   wrapper.innerHTML = `
        <li>
          <div class="list-top">
              <p>訂單日期：${info.createdDate}</p>
              <p>訂單編號：${info.createdNumber}</p>
              <p>訂單金額：NT$${info.orderPrice}</p>
              <div class="list-open">
                <button type="button" class="openList">顯示更多</button>
              </div>
          </div>
          <div class="list-bottom">
          </div>                 
        </li>
    `
    
    const li = wrapper.firstElementChild
    const listBottom = li.querySelector('.list-bottom')
    const infoItems = info.items
    infoItems.forEach(item => {
      const orderItemHtml = `
          <div class="order__table">
            <div class="order__table-name">
              <div class="img">
                <img src="${item.image}">
              </div>
              <h4>${item.name}</h4>
            </div>
            <div class="order__table-quantity">
              ${item.quantity}
            </div>
            <div class="order__table-price">
              ${item.price}
            </div>
          </div>
      `
      listBottom.innerHTML += orderItemHtml
    })
    orderList.appendChild(li)
  })

  const openLists = document.querySelectorAll('.openList');
  openLists.forEach(o => {
     o.addEventListener('click', ()=>{
      console.log('click')
      o.parentNode.parentNode.nextElementSibling.classList.toggle('open')
    })
  })
}
function sendEmail() {
  const loginUser = getItem('loggedInStatus')
  const users = getItem('users') || []
  const user= users.find(u => u.username === loginUser)
  const order = user.orders[user.orders.length - 1]

  // 發送訂單確認信
  emailjs.send('service_ztlwryn', 'template_xzl35ni', {
    user_name: user.username,
    email: user.mail,
    order_id: order.createdNumber,
    order_date: order.createdDate,
    order_address: order.orderAdr,
    order_total: order.orderPrice
  }, 'IORAtnHPNX4StmAN4')
  .then(() => {
    alert('訂單成立，確認信已寄出！')
  })
  .catch((error) => {
    alert('訂單已建立，但確認信寄送失敗：' + error.text)
  })
}


//confirm page, 歷史訂單
$(document).ready(function(){
  renderConfirmPage()
  renderOrderPage()
})
