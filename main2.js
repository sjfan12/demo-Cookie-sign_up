//实现封装
window.jQuery = function(nodeOrSelector){
	let nodes = {}
	nodes.addClass = function(){}
	nodes.html = function(){}
	return nodes
}

window.jQuery.ajax = function({url,method,body,headers}){
	return new Promise(function(resolve,reject){
		/*let url = options.url
	let method = options.method
	let body = options.body
	let successFn = options.successFn
	let failFn = options.failFn
	let headers = options.headers*/
	//ES6 析构赋值
	 //let {url,method,body,successFn,failFn,headers}= options



	/*如何接受两种参数
       let url
       if(arguments.length===1){
	      url= options.url
       }else if(arguments.length === 2){
	      url = arguments[0]
	      options= arguments[1]
       }

	*/

	let request = new XMLHttpRequest()
	request.open(method,url)//配置request
	for(let key in headers){
		let value = headers[key]
		request.setRequestHeader(key,value)
	}
	request.onreadystatechange = ()=>{
		if (request.readyState === 4) {
			console.log('请求响应都完毕了')
			if (request.status >=200 && request.status<300) {
				console.log('请求成功')
				resolve.call(undefined, request.responseText)
			}else if (ready.status >=400) {
				console.log('请求失败')
				reject.call(undefined, request)
			}
		}
	}
	request.send(body)

	})
}

window.$ = window.jQuery


myButton.addEventListener('click',(e)=>{
	window.jQuery.ajax({
		url: '/xxx',
		method: 'get',
		headers:{
			'content-type': 'application/x-www-form-urlencoded',
			'frank':'18'
		}
		/*successFn: (x)=>{
			console.log(x)//callback 让后台返回一个值，回调
		},
		failFn: ()=>{}*/
	}).then(
	  (text)=>{console.log(text)},
	  (request)=>{console.log(request)}
      
	)

})


/*promise的用途
myButton.addEventListener('click',(e)=>{
	$.ajax({
		url: '/frank',
		method: 'get',
	}).then(
      (responseText)=>{console.log(responseText)},
      (request)=>{console.log('error')}//不需要success
	)
})

*/



