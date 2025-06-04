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
    let productData = []
    let currentCategory = "all"
    //分類按鈕
    $('.category-bar').on('click', '.filter-btn', function(){
        currentCategory = $(this).data('category')

        const filtered = (currentCategory === 'all')
            ? allData
            : allData.filter(item => item.category === currentCategory)
        $('.main').show();
        $('.login').hide();
        $('.cart').hide();
        $('.product').hide();
        $('.member').hide();
        $('.check').hide();
        $('.confirm').hide();

        pageDivider(filtered) // 篩選後重新分頁與渲染
    })

    
    //商品API
    $.ajax({
        url: './assets/data/products.json',
        dataType: 'json',
        type: 'GET',
        success:function(data){
            allData = data
            productData = data
            pageDivider(allData)
            productDetail(allData)
        },
        error:function(err){
            alert('Get JSON檔案失敗!:'+ err)
        }
    })

    function renderProducts(itemData){
        $('.products').empty();
        itemData.forEach(item=>{
                let name = item.name
                let price = item.price
                let id = item.id
                let img = item.image
                if(!img){
                    img = './assets/img/notfound.png'
                }
                let html = ''
                html = "<div class='product-box'><div class='product-box__img' style='overflow:hidden;text-align:center;'><a href='./product.html?id="+ id +"'><img src='"+ img +"' style='width:auto;height:100%;cursor:pointer'></a></div><div class='product-box__text'><p class='product-box__text-name'>"+ name +"</p><div class='product-box__text-detail'><span class='price'>$"+ price +"</span></div></div><div class='addCart-btn' data-id='"+ id +"'><span>+</span></div></div>"
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

        })
        

        

    }

    //商品頁面
    function productDetail(){
        const urlId = new URLSearchParams(window.location.search).get('id')
        const product = allData.find(item => item.id == urlId)
        
        $('.product-img').attr('src', product.image)
        $('.product-name').text(product.name)
        $('.product-info').text(product.description)
        $('.product-price').text(product.price)
        $('.product-id').attr('data-id', product.id)

    }
    //登入前後連結判斷
    $(document).on('click','.memberlink',function(e){
        e.preventDefault();
        const isLogin = getItem('loggedInStatus');
        if(isLogin){
            location.href = './member.html'
            
        }else{
            location.href = './login.html';
        }
    })
    $(document).on('click','.cartlink',function(e){
        e.preventDefault();
        const isLogin = getItem('loggedInStatus');
        if(isLogin){
            location.href = './cart.html'
            
        }else{
            alert('請先登入!')
            location.href = './login.html';
        }
    })
    //即時搜尋功能
    $('#search-input').on('input', function(){
        const keyword = this.value.trim()
        const keywords = keyword.split(/\s+/)
        
        let searchData = productData.filter(item=>
         keywords.every(word=>item.name.includes(word))
        )

        pageDivider(searchData)
        
    })
    

    


    
})