function setItem(key, value){
    localStorage.setItem(key, JSON.stringify(value))
}

function getItem(key){
    return JSON.parse(localStorage.getItem(key))
}

function removeItem(key){
    localStorage.removeItem(key)
}