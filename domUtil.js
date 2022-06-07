/*
DOM (document object model) utils

 
BEGIN Do not remove this notice
Copyright 2018-22 jsutil37 Github user(s)
License location: https://github.com/jsutil37/jsutil/blob/master/LICENSE
File location: https://github.com/jsutil37/jsutil/blob/master/domUtil.js
Deployment location: https://jsutil37.github.io/jsutil/domUtil.js
END Do not remove this notice
*/
export {htmlEncode,el, getElementsIncludingSelfByTextContent, appendHtmlStrToBody}

let dbgload = window.dbgload
dbgload && console.log('start')
import './util.js'
dbgload && console.log('after importing util.js...')
import './parseUtil.js'

window.elExists = function elExists(id){return (document.getElementById(id)!=null)}

//shortcut for document.getElementById
function el(id)
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
window.el = el
window.getel = el
window.getEl = el

window.elVal = function elVal(id){return el(id).value}

window.setElVal = function setElVal(id,val){el(id).value=val}

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

window.getNearestSingleDescendantWhoseClassNameIs =
function (params)
{
	checkParams(params, ['el', 'className'])
	let el = params.el
	let className = params.className
	let children = Array.from(el.children)
	let retval = null
	children.forEach
	(
	function(el)
	{
		if(el.classList.contains(className))
		{
			assert(retval==null)
			retval = el
			return true
		}
		let oldEl = params.el
		params.el = el
		let retval2 = getNearestDescendantWhoseClassNameIs(params)
		if(retval2 != null) {
			assert(retval==null)
			retval = retval2
		}
		params.el = oldEl
	}
	)
	assert(retval!=null)
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
function appendHtmlStrToBody(html, url, doc)
{
	const dbg = false
	dbg && console.log('appendHtmlTxtToBody: Entry. url=\''+url+'\'')

	if(doc == null){doc = document}

	//See https://howchoo.com/g/mmu0nguznjg/learn-the-slow-and-fast-way-to-append-elements-to-the-dom
	let docFragment = doc.createRange().createContextualFragment(html)
	dbg && console.log('After parsing html...')
	
	//let dbghtml=''
	let dbghtml='\''+html+'\''
	dbg && console.log('parsed HTML but without urls made absolute='+dbghtml)
	
	dbg && console.log('Created a docFragment with children.length='+
		docFragment.children.length)
	
	dbg && console.log(uniqueMsg('Before setInnerHTML(),docFragment.html:\n'+
		docFragment.innerHTML))
	setInnerHTML(docFragment, html, url)
	dbg && console.log('After setInnerHTML(),docFragment.html with urls ' +
		'made absolute:\n'+docFragment.innerHTML)
	dbg && console.log('After setInnerHTML(),docFragment.children.length='+
		docFragment.children.length)
	dbg && console.log(uniqueMsg("Before appending doc fragment, "+
		"doc.body.children.length=" + doc.body.children.length))
	dbg && bigLog(new Error(), "Before appending doc fragment from url '"+
		url+"', doc.body.innerHTML:\n"+doc.body.innerHTML)
	doc.body.appendChild(docFragment)
	dbg && console.log(uniqueMsg("After appending doc fragment from url '"+url+
		"', doc.body.children.length=" + doc.body.children.length))
	dbg && bigLog(new Error(), "After appending doc fragment, doc.body.innerHTML:\n"+doc.body.innerHTML)
	/*
	dbg && console.log("indexOf <span id=\"appdescdesc\""+
		"> in doc.body.innerHTML = " + doc.body.innerHTML.indexOf("<span id=\"appdescdesc\""))
	*/
}
window.appendHtmlTxtToBody = window.appendHtmlStrToBody = appendHtmlStrToBody;

//See https://stackoverflow.com/questions/2592092/executing-script-elements-inserted-with-innerhtml
//http://plnkr.co/edit/MMegiu?p=preview
function setInnerHTML(elm, html,url) 
{
	let dbg=false
	dbg && console.log('setInnerHTML(): html:\n'+html)
	elm.innerHTML = html;
	dbg && console.log(uniqueMsg(
		'setInnerHTML(): url=\''+url+'\', elm.innerHTML:\n'+elm.innerHTML))
	if(url!='allUrlsAreAbsolute')
	{
		transformUrlsOfElesToBeAbsolute([elm],url)
	}
	dbg && console.log(uniqueMsg(
		'setInnerHTML(): After making urls absolute w.r.t \''+url+'\', elm.innerHTML:\n'+elm.innerHTML))
	Array.from(elm.querySelectorAll("script")).forEach(function(el) {
	  let newEl = document.createElement("script");
	  Array.from(el.attributes).forEach(function(el) { 
		newEl.setAttribute(el.name, el.value)
	  });
	  newEl.appendChild(document.createTextNode(el.innerHTML));
	  el.parentNode.replaceChild(newEl, el);
	})
	dbg && console.log('setInnerHTML(): At exit: elm.innerHTML:\n'+elm.innerHTML)
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
		function(ele) {
			transformUrlsOfEleToBeAbsolute(ele,url,dbg)
		}
	)
}

function transformUrlsOfEleToBeAbsolute (ele,url,dbg) {
	//3=text node, 8=comment node
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
			urlToChange, url)
		dbg && console.log('changedUrl=\''+changedUrl+'\'') 
		ele.src = changedUrl
	}
	if(ele.href!=null)
	{
		let urlToChange = ele.href
		dbg && console.log('urlToChange=\''+urlToChange+'\'')
		let changedUrl = getFullUrlOfUrlXThatIsRelativeToUrlY(
			urlToChange, url)
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

function transformUrlOfScriptToBeAbsolute(ele,url)
{
	let dbg = false
	dbg && console.log('script innerHTML ='+ele.innerHTML)
	dbg && console.log('url of HTML to load='+url)
	if(ele.innerHTML.indexOf('/*begin relpath*/')==-1){return}
	dbg && console.log('The script contains \'/*'+'begin relpath*/\'!!!')
	var scriptAreas = scriptCommentAndNonCommentAreas(ele.innerHTML)
	dbg && console.log('scriptAreas:\n'+str(scriptAreas))
	let relpathCaseState = 0
	scriptAreas.forEach
	(
		(scriptArea,idx)=>
		{
			if(scriptArea.type=='comment' && 
				scriptArea.text=='/*'+'begin relpath*/')
			{relpathCaseState = 1;return}
			if(relpathCaseState = 1 && scriptArea.type=='textInCode')
			{relpathCaseState = 2;return}
			if(relpathCaseState = 2 && scriptArea.type=='comment' && 
				scriptArea.text=='/*'+'end relpath*/')
			{
				scriptArea.text = '/*end converted relpath*/'
				let prevScriptAreaText = scriptAreas[idx-1].text
				let urlToChange = prevScriptAreaText.substring(
					1,prevScriptAreaText.length-1)
				let openingQuoteChar = prevScriptAreaText.substr(0,1)
				let closingQuoteChar = prevScriptAreaText.substr(
					prevScriptAreaText.length-1)
				assert(openingQuoteChar==closingQuoteChar)
				dbg && console.log('urlToChange=\''+urlToChange+'\'')
				let changedUrl = getFullUrlOfUrlXThatIsRelativeToUrlY(
					urlToChange, url)
				dbg && console.log('changedUrl=\''+changedUrl+'\'')
				scriptAreas[idx-1].text = openingQuoteChar + changedUrl +
				closingQuoteChar
				scriptAreas[idx-2].text = '/*begin converted relpath*/'
			}
			relpathCaseState = 0
			/*
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
			*/
		}
	)

	let s = ""
	scriptAreas.forEach
	(
		(scriptArea,idx)=>{s+=scriptArea.text}
	)
	ele.innerHTML = s
}

//reference: https://stackoverflow.com/questions/1219860/html-encoding-lost-when-attribute-read-from-input-field
function htmlEncode (value) {
// Create a in-memory div, set its inner text (which jQuery automatically encodes)
  // Then grab the encoded contents back out. The div never exists on the page.
  return $('<div/>').text(value).html();
}
window.htmlEncode = htmlEncode

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 * reference: https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
 */
window.htmlToElement = function(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

window.redrawHtml = function(html, parentEle) {
	var noSpaceHtml = html.replaceAll(" ","");
	var id = noSpaceHtml.rightOf('id="').leftOf('"');
	var ele = document.getElementById(id);
	if(ele == null) {
		if(parentEle == null){parentEle = document.body}
	} else {
		var parent = ele.parentElement;
		ele.remove();
		if(parentEle == null){parentEle = parent}
	}
	parentEle.appendChild(htmlToElement(html));
}

//the html string must for an element having a unique id
window.drawHtmlIfNeeded = function(html, parentEle) {
	var noSpaceHtml = html.replaceAll(" ","");
	var id = noSpaceHtml.rightOf('id="').leftOf('"');
	var ele = document.getElementById(id);
	if(ele == null) {
		if(parentEle == null){parentEle = document.body}
		parentEle.appendChild(htmlToElement(html));
	}
}
window.drawHtmlIfNotAlreadyDrawn = drawHtmlIfNeeded
window.drawHtmlIfNotAlready = drawHtmlIfNeeded
window.drawHtml = drawHtmlIfNeeded

window.insertAsFirstChild =
function insertAsFirstChild(parent, eleToIns) {
	if(parent.childNodes.length==0){
		parent.appendChild(eleToIns);
		return;
	}

	parent.insertBefore(eleToIns, parent.childNodes[0]);  
}

window.getElsByClsNm = function getElsByClsNm(nm){return document.getElementsByClassName(nm)}

  /**
   * textContent finds even hidden elements as opposed to innerText
   * @param {HTMLElement} container
   * @param {string} textContent
   * @returns {HTMLElement[]}
   */
  function getElementsIncludingSelfByTextContent(
    container,
    textContent 
  ) {
    const allEles = [container, ...container.querySelectorAll('*')];
    const filteredEles = allEles.filter((e) => {
      if (!(e instanceof HTMLElement)) {
        throw new Error('unexpected - this is not HTMLElement: ' + e.outerHTML);
      }
      const text = e.textContent;
      if (text == null) {
        throw new Error('unexpected - textContent is null: ' + e.outerHTML);
      }
      return text.trim() === textContent;
    });
    return filteredEles;
  }

/**
 * @param selectors string that uses css syntax, see https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors 
 */
export function closestPrevious(el, selectors) {
	function log(...args) {
		console.log("closestPrevious(): ", ...args);
	}
	const p = globalThis.jsutil37_dbgClosestPrevious ? log : null;
	p?.('input el = ', el.outerHTML);
	p?.('input selectors = '+selectors);
	let previous = el.previousSibling
	if(previous == null) {
		p?.('previous is null');
		previous = el.parentElement;
		if(previous == null) {
			p?.('parent is also null');
			return null;
		}
	}
	p?.('previous = ', previous.outerHTML);
	const findResult = previous.querySelector(selectors)
	if(findResult != null){
	   return findResult;
	}
	return closestPrevious(previous, selectors);
    }

export const closestPrior = closestPrevious;

(function($) {
    $.fn.closestPrior = function(selector){return closestPrior(this, selector);};
})(jQuery);

dbgload && console.log('reached end')
