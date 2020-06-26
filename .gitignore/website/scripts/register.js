var button = document.getElementById("registerbtn")
button.onclick = register

document.body.addEventListener("keyup", function(event) {
    if(event.keyCode === 13){
        register()
    }
})




function register(){
    
    var username = document.getElementById("username").value
    var email = document.getElementById("email").value
    var firstname = document.getElementById("firstname").value
    var lastname = document.getElementById("lastname").value
    var password = document.getElementById("password").value
    let alert = document.getElementById("alert")
    var birthdate = document.getElementById("birthdate").value


    console.log(birthdate)
    if(!username || !email || !firstname || !lastname || !password){
        
        
        alert.innerHTML = "You forgot the "
        if(!username)
            alert.innerHTML += "username "
        if(!email)
            alert.innerHTML += "email "
        if(!firstname)
            alert.innerHTML += "firstname "
        if(!lastname)
            alert.innerHTML += "lastname "
        if(!password)
            alert.innerHTML += "password "
            if(!birthdate)
            alert.innerHTML += "birthdate "
    }
    else {
        let regexPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
        let regexUser = new RegExp("\\s", "g")
        if(!regexPass.test(password)){
            alert.innerHTML = "Choose a stronger password"
            console.log('slaaab')
            return
        }
        if(regexUser.test(username)){
            alert.innerHTML = "Your username contains a space!!!"
            console.log('spatii')
            return
        }
        var info = {
            "username": username,
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "password": password,
            "birthdate": birthdate,
            "friends": [],
            "blocked": []
        }
        var datapr = {
            method: 'POST',
            headers: {
            'Content-Type': "application/json"
            },
            body: JSON.stringify(info)
        }

        fetch('/nottaken', datapr)
        .then(response => response.json())
            .then(data => {
                if(data.usernamefree && data.emailfree){

                    alert.innerHTML = "you passed"
                    fetch('/addnew', datapr)
                    .then((response) =>{
                            window.location.replace('login.html')
                        })    
                }
                else {

                    if(!data.usernamefree && !data.emailfree)
                        alert.innerHTML = "Username and email already taken!"
                    if(data.usernamefree && !data.emailfree)
                        alert.innerHTML = "Email already taken!"
                    if(!data.usernamefree && data.emailfree)
                        alert.innerHTML = "Username already taken!"
                    
                    return
                }
            })
        
        
    }
}

