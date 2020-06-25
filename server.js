var http = require('http')
var fs = require('fs')
var url = require('url')

var port = process.argv[2]

if (!port) {
	console.log('请指定端口号好不啦？\nnodes server.js 8888 这样不会嘛？')
	process.exit(1)
}

var server = http.createServer(function(request, response){
	var parsedUrl = url.parse(request.url, true)
	var pathWithQuery = request.url
	var queryString = ''
	if (pathWithQuery.indexOf('?') >= 0) {
		queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
	}
	var path = parsedUrl.pathname
	var query = parsedUrl.query
	var method = request.method

	/*******从这里开始看，上面不要看**************/


console.log('HTTP 路径为\n' + pathWithQuery)
if(path === '/'){
  let string = fs.readFileSync('./index.html', 'utf8')
  //console.log(request.headers.cookie)
  let cookies = request.headers.cookie.split('; ')
  let hash ={}
  for(let i=0; i<cookies.length;i++){
    let parts = cookies[i].split('=')
    let key = parts[0]
    let value = parts[1]
    hash[key] = value
  }
  let email = hash.sign_in_email
  let users = fs.readFileSync('./db/users','utf8')
  users = JSON.parse(users)
  let foundUser
  for(let i=0; i< users.length; i++){
    if (users[i].email === email) {
      //说明用户存在
      foundUser = users[i]
      break
    }
  }
  if (foundUser) {
    string = string.replace('--password--',foundUser.password)
  }else{
    string = string.replace('--password--','不知道')
  }
  response.statusCode=200
  response.setHeader('Content-Type', 'text/html; charset=utf-8')
  response.write(string)
  response.end()
}else if(path === '/sign_up' && method === 'GET'){
  let string = fs.readFileSync('./sign_up.html', 'utf8')
  response.statusCode=200
  response.setHeader('Content-Type', 'text/html; charset=utf-8')
  response.write(string)
  response.end()
}else if(path === '/sign_up' && method === 'POST'){
  readBody(request).then((body)=>{
    let strings = body.split('&')//['eamil=1'  ]
    let hash = {}
    strings.forEach((string)=>{
      let parts = string.split('=')//['email','1']
      let key = parts[0]
      let value = parts[1]
      //js不让存在@，则需要转换
      hash[key]= decodeURIComponent(value)
    })
    console.log(hash)
   // let email = hash['email']
    //let password = hash['password']
    //let password_confirmation = hash['password_confirmation']
    let {email, password, password_confirmation} = hash
    if (email.indexOf('@') === -1) {
      response.statusCode = 400
      response.setHeader('Content-Type', 'application/json; charset=utf-8')
      response.write(`{ 
        "errors":{
          "email": "invalid"
        }
      }`)
    }else if(password !== password_confirmation){
      console.log(password_confirmation)
      console.log(password)
      response.statusCode = 400
      response.write('password not match')
    }else{
      var users = fs.readFileSync('./db/users','utf8')//字符串
      try{
        users = JSON.parse(users)
      }catch(exception){
        users=[]
      }
      let inUse = false;
      for(let i=0; i< users.length; i++){
        let user = users[i]

        if (user.email === email) {
          inUse = true
          break;
        }
      }
      if (inUse) {
        response.statusCode = 400
        response.write('email in use')
      }else{
        users.push({email: email,password: password})
        var usersString = JSON.stringify(users)
        fs.writeFileSync('./db/users', usersString)
        response.statusCode = 200
      }
    }
    response.end()  
  })
}else if (path === '/sign_in' && method === 'GET') {
  let string = fs.readFileSync('./sign_in.html', 'utf8')
  response.statusCode=200
  response.setHeader('Content-Type', 'text/html; charset=utf-8')
  response.write(string)
  response.end()
}else if (path === '/sign_in' && method === 'POST') {
   readBody(request).then((body)=>{
    let strings = body.split('&')//['eamil=1'  ]
    let hash = {}
    strings.forEach((string)=>{
      let parts = string.split('=')//['email','1']
      let key = parts[0]
      let value = parts[1]
      //js不让存在@，则需要转换
      hash[key]= decodeURIComponent(value)
    })
    console.log(hash)
    let {email, password} = hash
    var users = fs.readFileSync('./db/users','utf8')//字符串
      try{
        users = JSON.parse(users)
      }catch(exception){
        users=[]
      }
      let found;
      for(let i=0; i< users.length; i++){
        let user = users[i]
        if (user.email === email && user.password === password) {
          found = true
          break;
        }
      }
      if (found) {
        response.setHeader('Set-Cookie', `sign_in_email=${email}`)
        response.statusCode = 200
      }else{
        response.statusCode = 401
      }
    response.end()  
  })
}else if(path==='/main2.js'){
  let string = fs.readFileSync('./main2.js', 'utf8')
  response.statusCode=200
  response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
  response.write(string)
  response.end()
}else if(path==='/xxx'){
  response.statusCode=200
  response.setHeader('Content-Type', 'text/json; charset=utf-8')
  //后台加的相应头
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8001')
  response.write(`
    {
      "note":{
        "to": "小谷",
        "from": "范范",
        "heading": "打招呼",
        "content": "hi"
      }
    }
    `)
  response.end()
}else{
   response.statusCode = 404
   response.setHeader('Content-Type', 'text/html;charset=utf-8')
   response.write('呜呜呜')
   response.end()
}

/*************代码结束，下面不要看***********/


})

function readBody(request){
  return new Promise((resolve, reject)=>{
    let body=[]
    request.on('data',(chunk)=>{
    body.push(chunk);
  }).on('end',()=>{
    body = Buffer.concat(body).toString();
    console.log(body)//拿到用户上传的第四部分
     resolve(body)
   })

  })
}

server.listen(port)
console.log('监听' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
