const fs = require('fs')
const bodyParser = require('body-parser')
const updateJsonFile = require('update-json-file')
const express = require('express')
const Swal = require('sweetalert2')
const app = express()

app.use(express.static('website', {'index' : 'login.html'}))
app.set('view engine', 'ejs')
const server = app.listen(3000, listening)
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())

function listening() {
    console.log('listening...')
}


app.get('/', function(request, response) {
    response.redirect('/login')
})

app.get('/login', function(request, response) {
   response.sendFile(__dirname + '/website/login.html')
})

app.get('/register', function(request, response) {
   response.sendFile(__dirname + '/website/register.html')
})

app.get('/global', function(request, response) {
   response.sendFile(__dirname + '/website/global.html')
})

app.get('/user/:username', (request, response) => {
    users = JSON.parse(fs.readFileSync('users/users.json'))
    let keys = Object.keys(users)
    
    if(!(keys.includes(request.params.username))){
        console.log('ssss')
        response.redirect('/global')
        response.end()
        return
    }
    else {
        var userinfo = users[request.params.username]
        console.log(request.params.username)
        userinfo["username"] = request.params.username
        console.log(userinfo)
        var userposts = JSON.parse(fs.readFileSync('users/' +request.params.username+ '/posts.json'))
        console.log(userinfo)
        console.log(userposts)
        response.render('profile', {data: {info: userinfo, posts: userposts}})
    }
})


app.post('/addnew', addNew)

function addNew(request, response){
    recieved = request.body
    console.log("addnew" + c)
    var newUser = {
        "firstname" : request.body.firstname,
        "lastname" : request.body.lastname,
        "email" : request.body.email,
        "password" : request.body.password,
        "birthdate" : request.body.birthdate,
        "friends" : [],
        "blocked" : []
    }
    var newUsername = request.body.username

    fs.mkdirSync('users/'+newUsername, 0o776)
    fs.writeFileSync('users/'+newUsername + '/posts.json', "[]")
    fs.writeFileSync('users/'+newUsername + '/requests.json', "[]")
    fs.writeFileSync('users/'+newUsername + '/messages.json', "[]")
    console.log(newUser)
    if(fs.existsSync('users/users.json')){
        updateJsonFile('users/users.json', (data) =>{
            data[newUsername] = newUser
            return data
        })
    }
    else {
        var newEl = {
            newUsername : newUser
        }
        var data = JSON.stringify(newEl, null, 2)
        console.log('users/users.json')
        fs.writeFileSync('users/users.json', data)
    }
    
    
    //response.render('website/login.html');
    response.end();
    
}

app.post('/addpost', addPost)

function addPost(request, response) {
    recieved = request.body
    console.log(recieved)
        
    if(fs.existsSync('users/' + recieved.username + '/posts.json')){
        updateJsonFile('users/' + recieved.username + '/posts.json', (data) =>{
            data.push(recieved)
            return data
        })
    }
    else {
        var posts = [recieved]
        var data = JSON.stringify(posts, null, 2)
        fs.writeFileSync('users/' + recieved.username + '/posts.json', data)
    }
   
    response.end();
    
}

app.post('/deletePost', deletePost)

function deletePost(request, response){
    recieved = request.body
    console.log(recieved)
    
    updateJsonFile('users/' + recieved.username +'/posts.json', (data) => {
        for(let i = 0;i<data.length;i++){
            console.log(data[i])
            if(data[i].username == recieved.username && data[i].date == recieved.date){
                data.splice(i, 1)
                return data
            }
        }
    })

}

app.post('/sendrequest', sendRequest)

function sendRequest(request, response){
    var recieved = request.body
    console.log(recieved)
    if(fs.existsSync('users/' + recieved.accepter + '/requests.json')){
        console.log('users/' + recieved.accepter + '/requests.json')
        updateJsonFile('users/' + recieved.accepter + '/requests.json', (data) =>{
            if(!data.includes(recieved.user))
                data.push(recieved.sender)
            return data
        })
    }
    else {
        var posts = [recieved.sender]
        var data = JSON.stringify(posts, null, 2)
        console.log('users/' + recieved.accepter + '/requests.json')
        fs.writeFileSync('users/' + recieved.accepter + '/requests.json', data)
    }
}

app.post('/getrequests', getRequests)

function getRequests(request, response) {
    var recieved = request.body
    if(fs.existsSync('users/' + recieved.user + '/requests.json')){
        console.log('users/' + recieved.user + '/requests.json')
        var data = fs.readFileSync('users/' + recieved.user + '/requests.json')
        var posts = JSON.parse(data)
        response.json(posts)
        
    }
    else {
        response.json()
    }
    response.end()
}

app.post('/acceptrequest', acceptRequest)

function acceptRequest(request, response) {
    var recieved = request.body
    console.log(recieved)
    updateJsonFile('users/users.json', (data) => {
        console.log(data)
        console.log(recieved)
        data[recieved.sender].friends.push(recieved.accepter)
        data[recieved.accepter].friends.push(recieved.sender)
        return data
    })
    updateJsonFile('users/'+ recieved.accepter + '/requests.json', (data) => {
        for(let i = 0; i < data.length; i++){
            if(data[i] == recieved.sender){
                data.splice(i, 1)
                return data
            }
        }
    })
}

app.post('/declinerequest', declineRequest)

function declineRequest(request, response){
    var recieved = request.body
    console.log(recieved)
    updateJsonFile('users/'+ recieved.decliner + '/requests.json', (data) => {
        for(let i = 0; i < data.length; i++){
            if(data[i] == recieved.sender){
                data.splice(i, 1)
                return data
            }
            
        }
        return data
    })
}

app.post('/deletefriend', deleteFriend)

function deleteFriend(request, response){
    var recieved = request.body
    console.log('bleaaaaa')
    updateJsonFile('users/users.json', (data) => {
        for(let i = 0;i<data[recieved.friend].friends.length;i++){
            if(data[recieved.friend].friends[i] == recieved.deleter){
                data[recieved.friend].friends.splice(i, 1)
                break
            }
        }
        for(let i = 0;i<data[recieved.deleter].friends.length;i++){
            if(data[recieved.deleter].friends[i] == recieved.friend){
                data[recieved.deleter].friends.splice(i, 1)
                break
            }
        }
        return data
    })
    response.end()
}

app.post('/getfriendsposts', getFriendsPosts)

function getFriendsPosts(request, response){
    var recieved = request.body
    console.log(recieved)
    var waiter = recieved.waiter
    var toSend = []
    var data = JSON.parse(fs.readFileSync('users/' +waiter + '/posts.json'))
    toSend = data
    data = JSON.parse(fs.readFileSync('users/users.json'))
    for(var i = 0;i<data[waiter].friends.length; i++){
        console.log('users/' + data[waiter].friends[i] + '/posts.json')
        let str = fs.readFileSync('users/' + data[waiter].friends[i] + '/posts.json')
        if(str){
            var temp = JSON.parse(str)
            toSend = toSend.concat(temp)
        }
    }
     
    toSend.sort((a,b) => {return new Date(b.date) - new Date(a.date)})
    console.log(toSend)
    response.json(toSend)
}

app.post('/userexists', userExists)

function userExists(request, response) {
    var recieved = request.body
    console.log(recieved)
    var toSend = {
        "verified": false
    }
    var users = JSON.parse(fs.readFileSync('users/users.json'))
    console.log(Object.keys(users))
        
    if(Object.keys(users).includes(recieved.username)){
        if(users[recieved.username].password == recieved.password){
            toSend.verified = true
        }
    }
    response.json(toSend)
    response.end()
}

app.post('/nottaken', notTaken)

function notTaken(request, response){
    var recieved = request.body
    console.log(recieved)

    var toSend = {
        "usernamefree": true,
        "emailfree": true
    }

    var users = JSON.parse(fs.readFileSync('users/users.json'))
    var keys = Object.keys(users)
    for(var i = 0; i < keys.length; i++){
        if(keys[i] == recieved.username)
            toSend.usernamefree = false
        if(users[keys[i]].email == recieved.email)
            toSend.emailfree = false
    }
    response.json(toSend)
    response.end()
}

app.post('/getuserfriendsandblocked', getUserFriendsAndBlocked)

function getUserFriendsAndBlocked(request, response) {
    var recieved = request.body
    console.log(recieved)
    var users = JSON.parse(fs.readFileSync('users/users.json'))
    var toSend = {
        "friends": users[recieved.username].friends,
        "blocked": users[recieved.username].blocked
    }
    response.json(toSend)
    response.end()
}

app.post('/getposts', getPosts)

function getPosts(request, response){
    recieved = request.body
    console.log(recieved)
    var toSend = JSON.parse(fs.readFileSync('users/' + recieved.waiter + '/posts.json'))
    toSend.reverse()
    response.json(toSend)
    response.end()
}

app.post('/sendmessage', sendMessage)

function sendMessage(request, response) {
    var recieved = request.body
    if(fs.existsSync('users/' + recieved.reciever + '/messages.json')){
        updateJsonFile('users/' + recieved.reciever + '/messages.json', data =>{
            data.push(recieved)
            return data
        })
    }
    else {
        var messages = [recieved]
        var data = JSON.stringify(messages, null, 2)
        console.log('users/' + recieved.reciever + '/messages.json')
        fs.writeFileSync('users/' + recieved.reciever + '/messages.json', data)
        

    }
    response.send('sent!')
}

app.post('/getmessages', getMessages)

function getMessages(request, response){
    var recieved = request.body
    console.log(recieved)
    var toSend = JSON.parse(fs.readFileSync('users/' + recieved.username + '/messages.json'))
    response.json(toSend)
    response.end()
}

app.post('/deletemessage', deleteMessage)

function deleteMessage(request, response){
    var recieved = request.body
    console.log(recieved)
    updateJsonFile('users/' + recieved.username + '/messages.json', data => {
        for(let i = 0; i < data.length; i++){
            if(data[i].sender == recieved.sender && data[i].date == recieved.date){
                data.splice(i, 1)
                return data
            }
        }
    })
}

app.get('*', (req, res) =>{
    res.status(404).sendFile(__dirname + '/website/page404.html')
})

