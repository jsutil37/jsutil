//Javascript utility functions
//latest online version at https://jsutil37.github.io/jsutil/util.js
//License: MIT
//Github repository: https://github.com/jsutil37/jsutil

//Import this file as an ES6 module.
//Once this file is run, it also exposes itself as window.u
//TODO: Get rid of all 'window.' stuff and be a good citizen following es6 module explicit exports and imports

//Always use the latest version of jquery and hope for the best
export * from 'https://unpkg.com/jquery/dist/jquery.min.js'
const $ = globalThis.$
export {$}

export * from "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"
export * from "https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"

//Put basic functions and shortcuts at the top, and those that depend on them,  further below:
//Below exports are done synchronously and this keeps things simple...
export * from './abbreviations.js'
export * from './arrayUtil.js'
export * from './basicSyncUtil.js'
export * from './blockUiUtil.js'
export * from './debugUtil.js'
export * from './diffUtil.js'
export * from './domUtil.js'
export * from './loaderUtil.js'
export * from './mathUtil.js'
export * from './objUtil.js'
export * from './parseUtil.js'
export * from './randomUtil.js'
export * from './stringUtil.js'
export * from './syncUtil.js'
export * from './taResizeUtil.js'
export * from './uiUtil.js'

export {loopFn, ifFn}

//In a js file imported as a module, "use strict" is not necessary
//"use strict";
let dbgload = window.dbgload
dbgload && console.log('util.js: loading started. This log message is expected to come only once per page load...')		
console.log('loaded '+scriptPath());

//====== BOOTSTRAP INCLUDES START=======
//bootstrap says: 'load me last after all the html is loaded', but that seems less beneficial; it may actually
//cause a flicker on the page!

//Below gives some strange runtime error about 'Popper not found'
//import "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js";
//import "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js";
	
//Below bundle includes Popper, but not jquery, and solves the issue of the runtime error of 'Popper not found':
//Also note that https://stackpath.bootstrapcdn.com/bootstrap/latest/js/bootstrap.bundle.min.js points to an old version :(
export * from "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js";
		
//The bootstrap css is included via util.css

//For icons, the latest bootstrap says 'use font awesome or something else'.
//Following url is taken from w3schools tutorial on font awesome 5:
//import "https://kit.fontawesome.com/a076d05399.js"
//But this gives a runtime error. So let's try to load it using  jsFilesToLoad

//====== BOOTSTRAP INCLUDES END=======

assert($!=null)
assert(window.$!=null)

$('head').prepend('<meta http-equiv="X-UA-Compatible" content="ie=edge">'+
'<meta charset="UTF-8">'+
'<meta name="viewport" content="width=device-width, initial-scale=1.0">')

assert($("textarea").resizable!=null)
//Note: this is also needed by the jquery plugin blockUI



//Guard against duplicate inclusion of the jquery imports by recording that 
//they are imported:
//TODO: can't remember how exactly this will help to avoid duplicate imports given that we are using 'import'
// This might be reinventing the wheel; import might be taking care of this already?
//checkAndRecordUrl('https://unpkg.com/jquery/dist/jquery.min.js')

//checkAndRecordUrl("https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js")

//It has been experimentally validated that relative paths are relative to this file's folder:
dbgload && console.log('here')
import * as u from "./util.js"
dbgload && console.log('end here')
window.u = u

//CSS is always loaded in the <head> tag
//AFAIK there is no way to restrict css scope (or need to)
window.cssFilesToLoad = window.cssFilesToLoad || [] 
window.cssFilesToLoad.push('./util.css')

//The js files to import (load asynchronously in <head> tag)
window.jsFilesToLoad = window.jsFilesToLoad || []

//Below is no longer found, so commenting out:
//jsFilesToLoad.push("https://kit.fontawesome.com/a076d05399.js")

jsFilesToLoad.push("https://cdn.jsdelivr.net/npm/jquery.growl/javascripts/jquery.growl.min.js")

loadAllTypesOfFiles()

//Taken from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
//The function did not seem to be includable via its own .js file
//awaiting clarification from author on how to do it
//TODO: reuse https://github.com/shrpne/clipbrd
window.copyToClipboard =
function(str)
{
	const el = document.createElement('textarea');  // Create a <textarea> element
	el.value = str;                                 // Set its value to the string that you want copied
	el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
	el.style.position = 'absolute';
	el.style.left = '-9999px';                      // Move outside the screen to make it invisible
	document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
	const selected =
	document.getSelection().rangeCount > 0        // Check if there is any content selected previously
	? document.getSelection().getRangeAt(0)     // Store selection if found
	: false;                                    // Mark as false to know no selection existed before
	el.select();                                    // Select the <textarea> content
	document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
	document.body.removeChild(el);                  // Remove the <textarea> element
	if (selected) 									// If a selection existed before copying
	{
		document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
		document.getSelection().addRange(selected);   // Restore the original selection
	}
}

window.dontShowGoToParentPageLink = window.dontShowGoToParentPageLink || false

window.useTitleAsPageHeading =
function useTitleAsPageHeading()
{
	let d=document
	if(d.title==''){return}
	let heading = d.createElement('p')
	heading.innerText = d.title
	heading.style.fontSize = 'large'
	heading.style.fontWeight = 'bold'
	insertAsFirstChild(d.body, heading)
	if(!dontShowGoToParentPageLink){showGoToParentPageLink()}
	scrollToTop()
}

window.showGoToParentPageLink = 
function showGoToParentPageLink()
{
	let url = window.location.href
	if(url.endsWith('index.html')) 
	{
		url = leftOfLast(url, 'index.html')
	}
	let urlParts = url.split('/')
	if(urlParts.length <= 4)
	{
	   	return;
	}
	let d=document
	let a= d.createElement('a')
	a.innerText='Go to parent page'
	if(!window.location.href.endsWith('.html'))
	{
		a.href='..' 
	}
	else
	{
		a.href=leftOfLast(window.location.href,'/') 
	}
	a.setAttribute('class', 'btn btn-secondary btn-sm');
	insertAsFirstChild(d.body, a)
}

window.dontShowPathInTitle = window.dontShowPathInTitle || false

window.autoTitlePageFromUrl = 
function autoTitlePageFromUrl()
{
	if(document.title != ''){return}
	let url = window.location.href
	url = url.replaceAll('.github.io','')
	url = url.replaceAll('/index.html','')
	if(url.endsWith('/')){url = withoutLastChar(url)}
	if(url.endsWith('.html')){url = url.substring(0,url.length-5)}
	let urlParts = url.split('/')
	urlParts = urlParts.slice(2)
	urlParts.forEach((urlPart,idx)=>{
		urlPart = decodeURIComponent(urlPart)
		let replacement  = window.urlPartsToTitleParts ? urlPartsToTitleParts[urlPart] : null
		urlParts[idx] = replacement ? replacement : decryptCamelCase(urlPart)
	})
	if(urlParts.length > 0 && urlParts[0]==''){
		urlParts.removeFirstEle()
	}
	if(dontShowPathInTitle)
	{
		document.title = urlParts.lastEle()
	}
	else
	{
		document.title = urlParts.join(' - ')
	}
}

window.scrollToTop = function scrollToTop()
{ 
    window.scrollTo(0, 0); 
}

window.dontAutoTitlePage = window.dontAutoTitlePage || false 
if(!dontAutoTitlePage){autoTitlePageFromUrl()}

window.dontUseTitleAsPageHeading = window.dontUseTitleAsPageHeading || false
if(!dontUseTitleAsPageHeading){useTitleAsPageHeading()}

window.growl = function growl(msg){$.growl.notice({ message: msg })}

/** reduce code complexity of loops! */
function loopFn(whileFn,stepFn){
	while(whileFn()){
		stepFn()
	}
}

/** reduce code complexity of IF statements! */
function ifFn(condFn,thenFn,elseFn){
	if(whileFn()){
		thenFn()
	} else if (elseFn != null){
		elseFn()
	}
}



dbgload && console.log('util.js loaded!!!')
