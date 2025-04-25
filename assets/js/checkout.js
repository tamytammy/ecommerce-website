//付款使用暫存資料庫
function setItemTep(key, value){
    sessionStorage.setItem(key, JSON.stringify(value))
}
function getItemTep(key){
    return JSON.parse(sessionStorage.getItem(key))
}

//儲存到使用者orders
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
    if(user.orders){
        //if there is already have the checkInfo in the orders, just update it with the new one
        user.orders[0] = checkInfo        
    }else{
        user.orders.push(checkInfo)
    }
    setItem('users', users)
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
