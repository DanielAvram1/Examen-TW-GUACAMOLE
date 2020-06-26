var currUserEl = document.getElementById("currUser")
currUserEl.href = 'user/' + localStorage.currUser;
var postContent = document.getElementById('postcontent')
postContent.className = 'contentwrapper'

var mode = document.getElementById("mode")
var navwrapper = document.getElementById("navwrapper")
var mainname = document.getElementById("mainname")
        
if(localStorage.mode == 'true'){ //darkmode
    navwrapper.style.backgroundColor = '#015201'
    mainname.style.color = '#fff'
    currUserEl.style.color = '#fff'
    document.body.style.backgroundColor = '#101310'
    console.log(1)
  }
  else {  //lightmode
    navwrapper.style.backgroundColor = '#04fc04'
    mainname.style.color = '#000000'
    currUserEl.style.color = '#000000'
    document.body.style.backgroundColor = '#cfdbcf'
    console.log(0)
  }
  mode.checked = localStorage.mode == 'true'
  mode.oninput = changeMode

function transferToPost() {
    window.location.replace("post.html")
}

currUserEl.innerHTML = localStorage.currUser
console.log(localStorage.currUser)

var info = {
    "waiter" : localStorage.currUser
  }
var data = {
    method: 'POST',
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify(info)
  }
fetch('/getfriendsposts', data)
.then(response => response.json())
    .then(data => {
        for(var i = 0;i<data.length;i++){
            var table = document.createElement("TABLE")
            table.id = "table" + i
            var title = document.createElement("p")
            title.id = "title" + i
            title.innerHTML = data[i].title
            var username = document.createElement("a")
            username.id = "username" + i
            username.href = "/user/" + data[i].username
            var span = document.createElement('span')
            span.innerHTML = ' is feeling ' + data[i].state
            username.innerHTML = data[i].username
            var date = document.createElement("p")
            date.id = "date" + i
            date.innerHTML = data[i].date
            var text = document.createElement("p")
            text.id = "text" + i
            text.innerHTML = data[i].text
            
            var temp = document.createElement("TR")
            temp.appendChild(username)
            temp.appendChild(span)
            
            table.appendChild(temp)
            
            temp = document.createElement("TR")
            temp.appendChild(title)
            table.appendChild(temp)

            temp = document.createElement("TR")
            temp.appendChild(text)
            table.appendChild(temp)

            temp = document.createElement("TR")
            //var col = document.createElement("TD")
            temp.appendChild(date)
            

            col = document.createElement("TD")
            if(data[i].username == localStorage.currUser){
                console.log(data[i].username)
                var del = document.createElement("button")
                del.id = i
                del.innerHTML = "Delete"
                del.onclick = deletePost
                temp.appendChild(del)
                
            }
            table.appendChild(temp)
            if(data[i].state == 'happy'){
                table.style.backgroundColor = 'rgba(144, 241, 125, 0.725)'
            }
            if(data[i].state == 'sad'){
                table.style.backgroundColor = 'rgba(241, 125, 125, 0.725)'
            }
            if(data[i].state == 'bored'){
                table.style.backgroundColor = 'rgba(51, 43, 43, 0.725)'
            }
            if(data[i].state == 'excited'){
                table.style.backgroundColor = 'rgba(219, 252, 32, 0.725)'
            }
            postContent.appendChild(table)
        }
    })

function logOut(){
    localStorage.currUser = 'noone'
    window.location = '/login'
}

function deletePost(){
    var parent = this.parentNode
    parent = parent.parentNode
    
    console.log(parent.childNodes)
    var info = {
        "username" : parent.childNodes[0].childNodes[0].innerHTML,
        "date":parent.childNodes[3].childNodes[0].innerHTML
    }
    console.log(info)
    var data = {
        method: 'POST',
        headers: {
        'Content-Type': "application/json"
        },
        body: JSON.stringify(info)
    }
    fetch('/deletePost', data)
    .then((response) =>{})
    parent.remove()
}

function changeMode() {
    if(mode.checked == true){ //darkmode
      navwrapper.style.backgroundColor = '#015201'
      mainname.style.color = '#fff'
      currUserEl.style.color = '#fff'
      document.body.style.backgroundColor = '#101310'
      localStorage.mode = true
    }
    else {  //lightmode
      navwrapper.style.backgroundColor = '#04fc04'
      mainname.style.color = '#000000'
      currUserEl.style.color = '#000000'
      document.body.style.backgroundColor = '#cfdbcf'
      localStorage.mode = false
    }
    
    console.log(localStorage)
  }