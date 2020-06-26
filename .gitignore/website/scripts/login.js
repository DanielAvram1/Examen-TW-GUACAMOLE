
var button = document.getElementById('loginbtn')
button.onclick = login
document.body.addEventListener("keyup", function(event) {
    if(event.keyCode === 13){
        login()
    }
})


function login(){
        var username = document.getElementById('username').value
        var password = document.getElementById('password').value
        var alert = document.getElementById('alert')
        if(!username || !password){
            if(!username && !password){
                alert.innerHTML = 'You forgot to introduce the username and the password!'
            }
            else if(!username){
                alert.innerHTML = 'You forgot to introduce the username!'
            } else if(!password){
                alert.innerHTML = 'You forgot to introduce the password!'
            }
        }
        else {
            
            var info = {
                "username": username,
                "password": password
            }
            var data = {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(info)
            }
            fetch('/userexists', data)
            .then(response => response.json())
                .then(data => {
                    if(data.verified){
                        localStorage.currUser = username
                        window.location = '/global.html'
                    }
                    else {
                        alert.innerHTML = "wrong username or password"
                    }
                })
        }
    }