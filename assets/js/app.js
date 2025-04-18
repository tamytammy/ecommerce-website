function setItem(key, value){
    localStorage.setItem(key, JSON.stringify(value))
}

function getItem(key){
    return JSON.parse(localStorage.getItem(key))
}

function removeItem(key){
    localStorage.removeItem(key)
}

$(document).ready(function(){
    let allData = [];
    let currentCategory = "all"

    $('.category-bar').on('click', '.filter-btn', function(){
        currentCategory = $(this).data('category')

        const filtered = (currentCategory === 'all')
            ? allData
            : allData.filter(item => item.category === currentCategory)

        pageDivider(filtered) // 篩選後重新分頁與渲染
    })

    

    $.ajax({
        url: './assets/data/products.json',
        dataType: 'json',
        type: 'GET',
        success:function(data){
            allData = data
            pageDivider(allData)
        },
        erroo:function(itemData){
            alert('Get JSON檔案失敗!')
        }
    })
    

    function renderProducts(itemData){
        $('.products').empty();
        itemData.forEach(item=>{
                let name = item.name
                let id = item.id
                let price = item.price
                let img = item.image
                if(!img){
                    img = './assets/img/notfound.png'
                }
                let html = ''
                html = "<div class='product-box'><div class='product-box__img' style='overflow:hidden;text-align:center;'><img src='"+ img +"' style='width:auto;height:100%'></div><div class='product-box__text'><p class='product-box__text-name'>"+ name +"</p><div class='product-box__text-detail'><span class='price'>$"+ price +"</span></div></div><div class='addCart-btn' data-id='"+ id +"'><span>+</span></div></div>"
                $('.products').append(html);
            })
    }
    function pageDivider(itemData){
        $('.pageSelector').empty();

        let currentPage = 1 //當前頁面
        const itemPerPage = 12 //每頁顯示數量
        const pageTotalAmount = Math.ceil(itemData.length / itemPerPage) //換算總頁數


        //生成按鈕
        for(let i = 1; i <= pageTotalAmount ; i++){
            $('.pageSelector').append(`
                    <button type="button" class="page-btn" data-page="${i}"><span>${i}</span></button>
            `)
        }
        
        //先渲染預設第一頁
        const initProducts = itemData.slice(0, itemPerPage)
        renderProducts(initProducts)

        //綁定頁面點擊按鈕
        $('.pageSelector').on('click','.page-btn',function(){
            
            currentPage = $(this).data('page') //根據設定data賦予currentPage值
            let start = (currentPage - 1) * itemPerPage 
            let end = start + itemPerPage
            let productToShow = itemData.slice(start, end) //計算要渲染的商品

            renderProducts(productToShow)

            //樣式

        })

       
        

        

    }

    // 放在 .ready() 裡的統一監聽
$(document).on('click', '.addCart-btn', function() {
  // 檢查登入
  const loginUser = getItem('loggedInStatus')
  if (!loginUser) {
    alert('請先登入會員!')
    return
  }

  // 取得商品 ID（從按鈕上或父層帶 data-id）
  const productId = $(this).data('id') // 你要確保按鈕有 data-id 屬性

  // 取得商品資料（假設你有 itemData）
  const product = allData.find(p => p.id === productId)
  if (!product) {
    alert('商品不存在')
    return
  }

  // 加入購物車邏輯，這邊你可以呼叫 addToCart(product)
  addToCart(product)
})
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
}

    
})
