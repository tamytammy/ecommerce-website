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
    $.ajax({
        url: './assets/data/products.json',
        dataType: 'json',
        type: 'GET',
        success:function(itemData){
            pageDivider(itemData)
        },
        erroo:function(itemData){
            alert('Get JSON檔案失敗!')
        }
    })

    function renderProducts(itemData){
        $('.products').empty();
        itemData.forEach(item=>{
                let name = item.name
                let price = item.price
                let img = item.img
                if(!img){
                    img = './assets/img/notfount.png'
                }
                let html = ''
                html = "<div class='product-box'><div class='product-box__img'><img src='"+ img +"' alt=''></div><div class='product-box__text'><p class='product-box__text-name'>"+ name +"</p><div class='product-box__text-detail'><span class='price'>$"+ price +"</span></div></div></div>"
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
    
})