///DOM (document object model) utils
import './util.js'

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

console.log('Here...')

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

console.log('Here2...')

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

window.appendHtmlToBody =
function(html)
{
	/*3rd param is 'keepScripts' and is recommended to be 'false' for future 
	compatibility. But we are keeping this as true because this is needed for 
	loading bootstrap deferred, as well as for import HTML.
	*/
	let eles = $.parseHTML(html,document,true)

	$('body').append(eles)
	//console.log('Appended HTML \''+html+'\' to the body...')
}