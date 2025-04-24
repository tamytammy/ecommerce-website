function setItem(key, value){
    sessionStorage.setItem(key, JSON.stringify(value))
}

function getItem(key){
    return JSON.parse(sessionStorage.getItem(key))
}

function nextStep(){
    //抓html元素的值、存進sessionStorage

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
