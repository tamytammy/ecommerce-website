

const regForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

const regText = document.querySelector('.registerText')
const loginText = document.querySelector('.loginText')

// 註冊
regForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const mail = document.getElementById('mail').value;
    

    if(!username || !password || !confirmPassword){
        regText.textContent = '請輸入帳號密碼!'
        return
    }
    const users = getItem('users') || [];
    if(users.find(u=>u.username === username)){
        regText.textContent = '帳號已經被使用了!'
        return
    }else if(password !== confirmPassword){
        regText.textContent = '請輸入一致的密碼'
        return
    }
    const newUsers = {
        username,
        password,
        mail,
        createdAt:new Date().getTime(),
        totalAmount:0,
        cart:[],
        orders:[]
    }
    
    users.push(newUsers)
    setItem('users',users)
    alert('註冊成功! 請重新登入!')
    window.location.href='./login.html'
})
// 登入
loginForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const loginUsername = document.getElementById('loginUsername').value.trim()
    const loginPassword = document.getElementById('loginPassword').value
    
    const users = getItem('users') || []
    const findUsers = users.find(u => u.username === loginUsername)
    
    if(!findUsers){
        loginText.textContent = '帳號錯誤'
        return
    }else if(findUsers.password !== loginPassword){
        loginText.textContent ='密碼錯誤'
        return
    }
    setItem('loggedInStatus',loginUsername)
    alert('登入成功')
    // document.querySelector('.loginName').textContent = loginUsername
    window.location.href='./member.html'
    // document.querySelector('.loginName').textContent = loginUsername
    // loginUI(loginUsername)
    loginForm.reset()
    
    
})

const register = document.querySelector('.reg-container')
const login = document.querySelector('.login-container')
const logined = document.querySelector('.logined')
const loginDisplayName = document.querySelector('.loginName')
function loginUI(username){
    register.style.display= 'none'
    login.style.display = 'none'
    logined.style.display = 'block'
    loginDisplayName.textContent = username
}
function logout(){
    removeItem('loggedInStatus')
    alert('已登出')
    window.location.href = './index.html'
    // register.style.display = 'block'
    // login.style.display = 'block'
    // logined.style.display = 'none'
    // loginText.textContent =''
    // regText.textContent = ''
}