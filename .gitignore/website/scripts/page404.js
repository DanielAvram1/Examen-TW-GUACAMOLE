var currusername = document.getElementById("curruser")
currusername.innerHTML = localStorage.currUser
currusername.href = '/user/' +  localStorage.currUser

function global(){
    window.location = '/global'
  }

function logOut(){
    localStorage.currUser = 'noone'
    window.location = '/login'
}