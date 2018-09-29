///DOM (document object model) utils
let dbgload = window.dbgload
dbgload && console.log('start')
import './util.js'
dbgload && console.log('after importing util.js...')
import './parseUtil.js'

//shortcut for document.getElementById
window.el =
function(id)
{
	let rv = document.getElementById(id)
	checkThat
	(
	{
		condition:(rv!=null),
		errMsgFn:function(){return "ERROR: No element exists having id '"+id+"'!!!"}
	}
	)
	return rv
}
window.getel = el
window.getEl = el


window.getNearestAncestorWhoseIdContains =
function (params)
{
	checkParams(params, ['stringThatIsPartOfTheId', 'el', 'className'])
	
	let s=params.stringThatIsPartOfTheId.toLowerCase()
	let el = params.el
	if(el===document){return null}
	while(true)
	{
		el = el.parentNode
		if(el===document){return null}
		if(el.id.toLowerCase().includes(s)){return el}
	}
}

window.getSelfOrNearestAncestorWhoseClassNameIs =
function (params)
{
	checkParams(params, ['el', 'className'])
	let el = params.el
	if(el===document){return null}
	let className = params.className
	if(el.classList.contains(className))
	{
		return el
	}
	return getNearestAncestorWhoseClassNameIs(params)
}

window.getNearestAncestorWhoseClassNameIs =
function (params)
{
	checkParams(params, ['el', 'className'])
	let el = params.el
	if(el===document){return null}
	let className = params.className
	while(true)
	{
		el = el.parentNode
		//alert('getNearestAncestorWhoseClassNameIs: parentNode='+el.outerHTML)
		if(el===document){return null}
		if(el.classList.contains(className))
		{
			return el
		}
	}
}

window.getNearestPrevEleWhoseClassNameIs =
function (params)
{
	checkParams(params, ['el', 'className'])
	let el = params.el
	if(el===document){return null}
	let className = params.className
	while(true)
	{
		el=(el.previousElementSibling!=null)?el.previousElementSibling:el.parentNode
		if(el===document){return null}
		if(el.classList.contains(className))
		{
			return el
		}
	}
}

window.getNearestDescendantWhoseClassNameAndAttributeIs = 
function (params)
{
	checkParams(params, ['el', 'className','attrName','attrVal'])
	let el = params.el
	let className = params.className
	let attrName = params.attrName
	let attrVal = params.attrVal
	let children = Array.from(el.children)
	let retval = null
	children.some
	(
	function(el)
	{
		if(el.classList.contains(className) &&
		el.getAttribute(attrName)==attrVal)
		{
			retval = el
			return true
		}
		let oldEl = params.el
		params.el = el
		retval = getNearestDescendantWhoseClassNameAndAttributeIs(params)
		params.el = oldEl
		return (retval != null)
	}
	)
	return retval
}

window.getNearestDescendantWhoseClassNameIs =
function (params)
{
	checkParams(params, ['el', 'className'])
	let el = params.el
	let className = params.className
	let children = Array.from(el.children)
	let retval = null
	children.some
	(
	function(el)
	{
		if(el.classList.contains(className))
		{
			retval = el
			return true
		}
		let oldEl = params.el
		params.el = el
		retval = getNearestDescendantWhoseClassNameIs(params)
		params.el = oldEl
		return (retval != null)
	}
	)
	return retval
}

window.tabEleForTabPaneThatContains = 
function (el)
{
	//alert('tabEleForTabPaneThatContains(): el='+el.outerHTML)
	let tabPaneDiv = getSelfOrNearestAncestorWhoseClassNameIs
	({el:el,className:'tab-pane'})
	if(tabPaneDiv == null){return null}
	//alert('tabPaneDiv.id='+tabPaneDiv.id)
	let tabContentDiv = getNearestAncestorWhoseClassNameIs
	({el:el,className:'tab-content'})
	//alert('tabContentDiv.id='+tabContentDiv.id)
	let tabContentDivParent = tabContentDiv.parentNode
	//alert('tabContentDivParent.id='+tabContentDivParent.id)
	let tabEle = getNearestDescendantWhoseClassNameAndAttributeIs
	({el:tabContentDivParent,className:'nav-link',attrName:'href',attrVal:'#'+tabPaneDiv.id})
	return tabEle
}

window.makeallancestorsvisible =
function (el,nodesMadeVisible)
{
	//a('Consider '+el.outerHTML+'...')
	if($(el).is(':visible'))
	{
		//a(el.outerHTML+ ' is visible')
		return
	}
	//a("NOT VISIBLE: "+el.outerHTML)
	let gcs = getComputedStyle(el)
	//a('getComputedStyle(el).display='+gcs.display)
	if(gcs.display == 'none' || gcs.display == 'NONE')
	{
		assert(el.style.display == '')
		el.style.display = 'block'
		//a(el.outerHTML+ ' is MADE visible')
		nodesMadeVisible.push(el)
	}
	makeallancestorsvisible(el.parentNode,nodesMadeVisible)
	if(!$(el).is(':visible'))
	{
		a('IT DID NOT WORK!!!!')
	}
}

///url: url from which the html was imported. The html will be changed so that 
///relative links are made absolute w.r.t. this url.
window.appendHtmlTxtToBody =
function(html,url)
{
	let dbg = false
	dbg && console.log('Before parsing html...')

	/*3rd param is 'keepScripts' and is recommended to be 'false' for future 
	compatibility. But we are keeping this as true because this is needed for 
	loading bootstrap deferred, as well as for import HTML.
	*/
	//let eles = $.parseHTML(html,document,true)//doesn't run <script src=""...
	
	//See https://howchoo.com/g/mmu0nguznjg/learn-the-slow-and-fast-way-to-append-elements-to-the-dom
	let docFragment = document.createRange().createContextualFragment(html)
	dbg && console.log('After parsing html...')
	
	//let dbghtml=''
	let dbghtml='\''+html+'\''
	dbg && console.log('Before appending parsed HTML '+dbghtml+
		' to the body...')
	
	dbg && console.log('Created a docFragment with children.length='+docFragment.children.length)
	
	dbg && console.log('Before setInnerHTML(),docFragment.html:\n'+
		docFragment.innerHTML)
	setInnerHTML(docFragment, html, url)
	dbg && console.log('After setInnerHTML(),docFragment.html:\n'+
		docFragment.innerHTML)
	
	dbg && console.log("Before appending doc fragment, "+
		"document.body.children.length=" + document.body.children.length)
	document.body.appendChild(docFragment)
	dbg && console.log("After appending doc fragment, "+
		"document.body.children.length=" + document.body.children.length)
}

//See https://stackoverflow.com/questions/2592092/executing-script-elements-inserted-with-innerhtml
//http://plnkr.co/edit/MMegiu?p=preview
function setInnerHTML(elm, html,url) 
{
	elm.innerHTML = html;
	if(url!='allUrlsAreAbsolute')
	{
		transformUrlsOfElesToBeAbsolute([elm],url)
	}
	Array.from(elm.querySelectorAll("script")).forEach(function(el) {
	  let newEl = document.createElement("script");
	  Array.from(el.attributes).forEach(function(el) { 
		newEl.setAttribute(el.name, el.value)
	  });
	  newEl.appendChild(document.createTextNode(el.innerHTML));
	  el.parentNode.replaceChild(newEl, el);
	})
  }

function transformUrlsOfElesToBeAbsolute(eles,url)
{
	let dbg = false// true
	dbg && console.log('here: eles==null = '+(eles==null))
	if(eles != null)
	{
		dbg && console.log('eles.length='+eles.length)
	}
	Array.from(eles).forEach
	(
		function(ele)
		{
			//Below 'unexpected' types of nodes are present below of the initial
			//input to this function, that has the output of parseHTML() passed
			//as 'eles' to this function:
			if(ele.nodeType == 3 || ele.nodeType == 8)
			{
				return;
			}
			dbg && console.log('typeof ele = ' + typeof ele)
			dbg && console.log("ele='"+ele.outerHTML+"'...")
			if(ele.src!=null && ele.src != "")
			{
				let urlToChange = ele.src
				dbg && console.log('urlToChange=\''+urlToChange+'\'')
				let changedUrl = getFullUrlOfUrlXThatIsRelativeToUrlY(
					urlToChange,url)
				dbg && console.log('changedUrl=\''+changedUrl+'\'') 
				ele.src = changedUrl
			}
			if(ele.href!=null)
			{
				let urlToChange = ele.href
				dbg && console.log('urlToChange=\''+urlToChange+'\'')
				let changedUrl = getFullUrlOfUrlXThatIsRelativeToUrlY(
					urlToChange,url)
				dbg && console.log('changedUrl=\''+changedUrl+'\'') 
				ele.href = changedUrl
			}
			if(ele.tagName=='SCRIPT')
			{
				transformUrlOfScriptToBeAbsolute(ele,url)
			}
			dbg && console.log('ele.children==null = '+(ele.children==null))
			//debugger
			transformUrlsOfElesToBeAbsolute(ele.children,url)
		}
	)
}

function transformUrlOfScriptToBeAbsolute(ele,url)
{
	let dbg = false
	dbg && console.log('script innerHTML ='+ele.innerHTML)
	dbg && console.log('url of HTML to load='+url)
	if(ele.innerHTML.indexOf('import')==-1){return}	
	dbg && console.log('The script innerHTML contains \'import\'!!!')
	var scriptAreas = scriptCommentAndNonCommentAreas(ele.innerHTML)
	dbg && console.log('scriptAreas:\n'+str(scriptAreas))
	scriptAreas.forEach
	(
		(scriptArea,idx)=>
		{
			if(scriptArea.type=='code' && scriptArea.text.indexOf('import')!=-1)
			{
				let trimTxt = scriptArea.text.trim()
				dbg && console.log('scriptArea.text=\''+scriptArea.text+'\'')
				dbg && console.log('trimTxt=\''+trimTxt+'\'')
				if(trimTxt.startsWith('import') && trimTxt.endsWith('from'))
				{
					assert(idx<scriptAreas.length-1)
					let nextScriptArea = scriptAreas[idx+1]
					assert(nextScriptArea.type=='textInCode')
					let urlToChange = nextScriptArea.text.substring(
						1,nextScriptArea.text.length-1)
					dbg && console.log('urlToChange=\''+urlToChange+'\'')
					let changedUrl = getFullUrlOfUrlXThatIsRelativeToUrlY(
						urlToChange,url)
					dbg && console.log('changedUrl=\''+changedUrl+'\'')
					ele.innerHTML = ele.innerHTML.replaceAll(
					urlToChange, changedUrl)
					dbg && console.log(
						'Now changed innerHTML of the script:\n' +ele.innerHTML)
				}
				else
				{
					console.log('Need to examine this strange case...')
					debugger
				}
			}
		}
	)
}

dbgload && console.log('reached end')