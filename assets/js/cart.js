$(document).ready(function() {
    updateCartIcon()
    
    let cartData = []
    let allData = []
    $.ajax({
        url: './assets/data/products.json',
        dataType: 'json',
        type: 'GET',
        success: function(data) {
            allData = data
            console.log('成功')
            renderCart()          
        },
        error: function(data){
          console.log('Get JSON檔案失敗!')
        }
    })

//購物車渲染
function renderCart(){
  const loginUser = getItem('loggedInStatus')
  let users = getItem('users') || []
  const user = users.find(u => u.username === loginUser)
  cartData = user.cart || []

  let cartHtml = ''
  let totalPrice = 0
  if(cartData.length > 0){
    $('.cart__table').show();
    $('.cart__none').hide();
    cartData.forEach(data => {
     cartHtml += `
                <div class="cart__container" data-id="${data.id}">
                     <div class="cart__container-name">
                        <h5>${data.name}</h5>
                        <div class="cart-img">
                            <img src="${data.image}">
                        </div>
                    </div>
                    <div class="cart__container-quantity">
                        <button type="button" class="decreaseBtn" data-id="${data.id}">-</button>
                        <input type="number" class="product-quantity" value="${data.quantity}">
                        <button type="button" class="increaseBtn" data-id="${data.id}">+</button>
                    </div>
                    <div class="cart__container-price">
                        $ <span>${data.price}</span>
                          <button type="button" class="deleteBtn" data-id="${data.id}">x</button>
                    </div>
                </div>
     `

     totalPrice += data.price * data.quantity
  })
  $('.cart-wrapper').append(cartHtml)
  $('.totalPrice').append(totalPrice)
  }
  
  
}
//綁定購物車點擊事件
$(document).on('click', '.addCart-btn', function() {
  // 檢查登入
  const loginUser = getItem('loggedInStatus')
  if (!loginUser) {
    alert('請先登入會員!')
    return
  }

  // 取得商品 ID（從按鈕上或父層帶 data-id）
  const productId = $(this).data('id') 

  // 取得商品資料（假設你有 itemData）
  const product = allData.find(p => p.id == productId)
  if (!product) {
  console.log(product, productId)
    alert('商品不存在')
    return
  }

  // 加入購物車邏輯，這邊你可以呼叫 addToCart(product)
  addToCart(product)
})

//數量減少、增加
$('.cart-wrapper').on('click','.increaseBtn', function(){
    let productId = $(this).data('id')
    const loginUser = getItem('loggedInStatus')
    let users = getItem('users') || []
    cartData = users.find(u => u.username === loginUser).cart

    let productVal = $(this).siblings('.product-quantity').val()
    productVal++

    let product = cartData.find(p => p.id == productId)
    product.quantity++
    if(product.quantity > 10){
      alert('購買數量過大，請聯繫客服協助!')
    }

     $(this).siblings('.product-quantity').val(productVal);
    setItem('users', users)
    updateTotalPrice()
    updateCartIcon()
    
})
$('.cart-wrapper').on('click','.decreaseBtn', function(){
    let productId = $(this).data('id')
    const loginUser = getItem('loggedInStatus')
    let users = getItem('users') || []
    cartData = users.find(u => u.username === loginUser).cart

    let product = cartData.find(p => p.id == productId)
    let productVal = $(this).siblings('.product-quantity').val()
    if(product.quantity > 1 && productVal > 1){
      product.quantity--
      productVal--
      $(this).siblings('.product-quantity').val(productVal);
      setItem('users', users)
      updateTotalPrice()
      updateCartIcon()
    }else if(product.quantity == 1 && productVal == 1){
      removeCartItem(productId)
    }


    if(cartData.length == 0){
      $('.cart__table').hide();
      $('.cart__none').show();
    }
    
    

    
})
$('.cart-wrapper').on('click', '.deleteBtn', function(){
  removeCartItem($(this).data('id'))
})

//首頁商品, 商品頁面加入購物車
function addToCart(product) {
  const loginUser = getItem('loggedInStatus')
  let users = getItem('users') || []
  const user = users.find(u => u.username === loginUser)

  if (!user) return

  const existingItem = user.cart.find(i => i.id === product.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    user.cart.push({ ...product, quantity: 1 })
  }
  setItem('users', users)
  alert('已加入購物車！')
  updateCartIcon()
  updateTotalPrice()

}
//更新icon數量
function updateCartIcon() {
  const loginUser = getItem('loggedInStatus')
  let users = getItem('users') || []
  const user = users.find(u => u.username === loginUser)
  if (!user) return

  const totalCount = user.cart.reduce((acc, item) => acc + item.quantity, 0)

  const cartIcon = document.querySelector('.cartNum')
  if (totalCount > 0) {
    cartIcon.style.display = 'block'
    cartIcon.textContent = totalCount
  } else {
    cartIcon.style.display = 'none'
  }
}
//刪除購物車物品
function removeCartItem(productId){
    const loginUser = getItem('loggedInStatus')
    let users = getItem('users') || []
    cartData = users.find(u => u.username === loginUser).cart

    product = cartData.find(p => p.id == productId)
    cartData.splice(cartData.indexOf(product), 1)
    users.find(u => u.username === loginUser).cart = cartData
    
     if(cartData.length == 0){
      $('.cart__table').hide();
      $('.cart__none').show();
    }
    setItem('users', users)
    $(`[data-id=${productId}]`).remove()
    updateTotalPrice()
    updateCartIcon()
}

function updateTotalPrice(){
  $('.totalPrice').empty()
  const loginUser = getItem('loggedInStatus')
    let users = getItem('users') || []
    let user = users.find(u => u.username === loginUser)
    cartData = users.find(u => u.username === loginUser).cart
    let totalPrice = 0
    cartData.forEach(data => {
        totalPrice += data.price * data.quantity
    })
    user.totalAmount = totalPrice
    setItem('users', users)
    $('.totalPrice').append(totalPrice) 
}
  
})