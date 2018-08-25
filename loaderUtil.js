//loader util
import './util.js'

//this polyfill is required for dynamic import of es6 modules
//import { importModule } from "https://uupaa.github.io/dynamic-import-polyfill/importModule.js"
//import * as SystemJs from 'https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.21.4/system-production.js'

const scriptStartMarker = "/"+"*script start*"+"/"
var loadedUrls = {}

///returns true if the specified url exists
///called only by checkAndRecordUrl()
async function checkUrlExists(url)
{
	return new Promise
	(
	function(resolve)
	{
	$.ajax
	(
	{
    type: 'HEAD',
    url: url,
	success: 	function() 
				{
					// page exists
					return resolve(true)
				},
	error: 		function(xhr,status,error) 
				{
					// page does not exist
					let s = 'Error!!!, (url does not exist?), url=\''+url+'\', status='+status+', error='+error
					a(s)
					throw new Error(s)
				}
	}
	);
	}
	)	
}

function urlRelativeToThisFile(url)
{
	/*
	Not yet: import.meta.url will come in FireFox 62 slated for 5th Sept 18, 
	about 2-3 weeks away
	
	assert(import.meta != null)
	assert(import.meta.url != null)
	//a('import.meta.url='+import.meta.url)
	let urlofthisfile = import.meta.url
	let baseurl = urlofthisfile.substring(0,urlofthisfile.length-("util.js").length)
	//a('baseurl='+baseurl)
	//a('url to make absolute=\''+url+'\'')	
	*/
	assert(window.absPathOfUtilDotJs,'window.absPathOfUtilDotJs is not defined')
	return new URL(url, window.absPathOfUtilDotJs).href;
	//a('101: url='+url)
}

///To be called only by loadCss() and loadScript() and loadHTML()
///Returns true if url was already checked and recorded
async function checkAndRecordUrl(url)
{	
	if(url in loadedUrls){return true}
	//console.log('Checking if url \''+url+'\' exists...')
	try{await checkUrlExists(url)}catch(e){throw e}
	loadedUrls[url]=0	
	return false
}

async function loadScript2(url,integrity,crossOrigin,scriptType)
{	
	//console.log('loadScript(): using promises...url=\''+url+'\'...')
	return new Promise
	(
	function (callbackfn)
	{		
		let callbackfn2 = 
		function(data)
		{
			//console.log('Callback function called for url \''+url+'\'...')
			return callbackfn(data)
		}
		//console.log('url \''+url+'\' not loaded before....')
		var head = document.getElementsByTagName('head')[0]
		var script = document.createElement('script')
		if(scriptType = null){scriptType = 'text/javascript'}
		script.type = scriptType
		script.src = url
		if(integrity != null)
		{
			script.integrity = integrity
		}
		script.crossOrigin = crossOrigin
		//script.async = false
		// Then bind the event to the callback function.
		// There are several events for cross browser compatibility.
		script.onreadystatechange = 
		function(data)
		{
			//console.log('onreadystatechange event triggered for \''+url+'\'')
			if (this.readyState == 'complete')
			{
				callbackfn2(data)
			}
		}
		script.onload = 
		function(data)
		{
			//console.log('onload event triggered for \''+url+'\'')
			return callbackfn2(data)
		}
		
		// Fire the loading
		//alert('script='+script.outerHTML)
		//alert('Before append: head.childElementCount='+head.childElementCount)
		head.appendChild(script)
		//alert('After append: head.childElementCount='+head.childElementCount)
		if(url.indexOf('blockUI') != 0){window.isBlockUiScriptLoaded=true}
	}
	)
}

function addCommonLogicForResourceLoadingFn(fn)
{
	return 	async function(url,integrity,crossOrigin,resourceType)
			{
				url = urlRelativeToThisFile(url)
				try{if(await checkAndRecordUrl(url)){return}}catch(e){throw e}
				try{return await fn(url,integrity,crossOrigin,resourceType)}
					catch(e){throw e}
			}
}

window.loadScript = addCommonLogicForResourceLoadingFn(loadScript2)
window.loadscript = loadScript

async function loadCss2(url,integrity,crossOrigin)
{	
	let np = new Promise
	(
	function(resolve)
	{
		//console.log('Calling the async part...')
		var head = document.getElementsByTagName('head')[0]
		var link = document.createElement('link')
		link.type = 'text/css'
		link.rel = 'stylesheet'
		link.href = url
		if(integrity != null)
		{
			link.integrity = integrity
		}
		link.crossOrigin = crossOrigin
		//link.async = false
		
		// Then bind the event to the callback function.
		// There are several events for cross browser compatibility.
		//console.log('resolve='+resolve)
		let resolve2 = 
		function(data)
		{
			//console.log('\'resolve()\' function of loadcss was called!!!')
			return resolve(data)
		}
		link.onreadystatechange = resolve2
		link.onload = resolve2
		
		// Fire the loading
		//console.log('before firing load css')
		head.appendChild(link)
		//console.log('after firing load css')
		if(url.indexOf('util.css') != 0){window.isUtilCssLoaded=true}
	}
	)
	//console.log('loadcss: returning a new Promise object...')
	return np
}
window.loadCss = addCommonLogicForResourceLoadingFn(loadCss2)
window.loadcss = loadCss

///expects the following global array variables to be predefined and pre-populated:
///cssFilesToLoad, jsFilesToLoad
window.loadAllTypesOfFiles = 
async function ()
{	
	//console.log('Loading all CSS and head JS files...')
	let typesOfFilesToLoad = 
	[
	{
		loaderFn: loadcss,
		listOfUrls: cssFilesToLoad
	},
	{
		loaderFn: loadscript,
		listOfUrls: jsFilesToLoad
	}
	]
	
	typesOfFilesToLoad.forEach
	(
		(filetype)=>
		{
			filetype.listOfUrls.forEach(filetype.loaderFn)
		}
	)
}

///This is really import
///Here the text at the url is just supposed to be some <template> nodes
///Each template node should have some unique id so that the loadWidget
///function can then do its magic
async function loadHtml2(url)
{
	let txt
	try{txt = await getTextAtUrl(url)}catch(e){throw e}
	appendHtmlToBody(txt)
}
window.loadHtml = addCommonLogicForResourceLoadingFn(loadHtml2)
window.loadHTML = loadHtml

///Does not return anything. We search from the given container (that should be 
///suitably empty if needed) in order to uniquely identify the loaded widget.
///As far as possible the template for the widget should not contain any ids but
///should use classes instead.
window.loadWidget =
function (templateClass, container)
{
	assert(typeof templateClass == 'string',
		'param \'templateClass\' should be a string!')
	let template = document.querySelector("template."+templateClass)
	assert(template, 'Cannot find template with class \''+templateClass+'\'!!!')
	let clone = document.importNode(template.content, true)	
	$(container).append(clone)
}

window.getTextAtUrl =
async function (url)
{
	return new Promise
	(
		function(resolve,reject)
		{
			if(url==null || url==''){reject(new Error('url must not be blank!!!'));return}			
			$.get(url)
			.done
			(
				function(data)
				{
					//alert('pass, url=\''+url+'\'\n data=\''+data+'\'')
					resolve(data)
				}
			)
			.fail
			(
				function(reason)
				{
					//alert('dot fail')
					reject(reason)
				}
			)			
		}
	)
}

async function loadScriptFromTextAtUrl2(url)
{
	let data
	try{data = await getTextAtUrl(url)}catch(e){throw e}
	if(data.includes(scriptStartMarker))
	{
		data = partBetween(data, scriptStartMarker,"<"+"/script>")
	}
	if(url){data = "// from " +url +"\n"+data}
	return await loadScriptFromText(data,'text/javascript')
}
window.loadScriptFromTextAtUrl = 
addCommonLogicForResourceLoadingFn(loadScriptFromTextAtUrl2)

var inlineScriptIdCtr=0
///loads inline scripts (that don't have src attribute)
///Uses some evil things from https://stackoverflow.com/questions/25688786/how-to-know-that-dynamically-created-script-tag-was-executed
///that are needed to work around an apparent bug.
async function loadScriptFromText(txt,scriptType)
{
	var head = document.getElementsByTagName('head')[0]
	var script = document.createElement('script')
	script.type = (scriptType==null)?'text/javascript':scriptType	
	script.async = true
	inlineScriptIdCtr++
	let inlineScriptId = inlineScriptIdCtr
	script.id = 'script'+inlineScriptId
	txt+= 	[
			"console.log('This is from script"+inlineScriptId+"');",
			"let script = document.getElementById('script"+inlineScriptId+"');",
            "let event = new UIEvent('load');",
            "script.dispatchEvent(event);"
			].join('');
	script.innerHTML = txt
	return new Promise
	(
	function(resolve,reject)
	{		
		script.onload = function(){resolve(null)}
		head.appendChild(script)
		console.log('here')
	}
	)
}

var es6moduleIdCtr =  0
///substitute for import() function that is still not supported by FireFox
///returns a reference to the imported module
async function loadEs6Module2(url)
{
	console.log('here')
	es6moduleIdCtr++
	let es6moduleId = es6moduleIdCtr
	var html = 	'import * as module'+es6moduleId+' from "'+url+'"\n'+
				'window.module'+es6moduleId+'=module'+es6moduleId+'\n'
	console.log('here')
	try{await loadScriptFromText(html,'module')}catch(e){throw e}
	console.log('here')
	return window['module'+es6moduleId]
}
window.loadEs6Module = addCommonLogicForResourceLoadingFn(loadEs6Module2)
