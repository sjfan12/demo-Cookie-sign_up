myButton.addEventListener('click',()=>{
	/*let request = new XMLHttpRequest()
	request.open('GET','/xxx')
	request.send()*/

	let request = new XMLHttpRequest()
	//实现交互的时候的代码
	//request.open('GET','http://localhost:8002/xxx')//配置request,
	request.open('GET','/xxx')//配置request
	request.setRequestHeader('frank','18')
	request.setRequestHeader('Content-Type','x-www-form-urlencoded')
	request.send()
	request.onreadystatechange = ()=>{
		if (request.readyState === 4) {
			console.log('请求响应都完毕了')
			console.log('request.statusText')

			if (request.status >=200 && request.status<300) {
				console.log('请求成功')
				console.log(request.getResponseHeader('Content-Type'))
				console.log(request.getAllResponseHeaders())
				console.log(typeof request.responseText)
				console.log(request.responseText)
				let string = request.responseText
				//把符合JSON语法的字符串转换成JS对应的值
				let object = window.JSON.parse(string)
				console.log(typeof object)
				console.log(object)
				console.log(object.note)
				console.log(object.note.from)
			}else if (readyState >=400) {
				console.log('请求失败')
			}
		}
	}
	

})


/*
请使用原生JS来发送AJAX请求
 
 JS           VS      JSON
 undefined           没有
 null                  null
 ['a','b']             ["a","b"]
 function               没有
 {name: 'frank'}        {"name": "frank"}
 'frank'                "frank"
 var a={}
 a.self=a               搞不定
 {__proto__}            没有原型链


*/

/*
只有 协议+端口+域名 一模一样才允许发 AJAX 请求

1. http://baidu.com 可以向 http://www.baidu.com 发请求嘛
不可以
*/

/*
GET /xxx HTTP/1.1
HOST: jack.com:8002
Content-Type: application/x-www-url-encoded



1. JS可以设置任意请求header 嘛
第一部分 request.open('get','/xxx')
第二部分 request.setHeader('content-type','x-www-form-urlencoded')
第四部分 request.send('a=1&b=2')
2. JS 可以获取任意响应 header 嘛
第一部分 request.status / request.statusText
第二部分 request.getResponseHeader()/ request.getAllResponseHeaders()
第四部分 request.responseText

HTTP/1.1 200 OK 
Content-Type: text/html

<!DOCTYPE html>
<html>...</html>

*/