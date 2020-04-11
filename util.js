//Javascript utility functions
//latest online version at https://jsutil37.github.io/jsutil/util.js
//License: MIT
//Github repository: https://github.com/jsutil37/jsutil

//Import this file as an ES6 module.
//Once this file is run, it exposes itself via window.u

//In a js file imported as a module, "use strict" is not necessary
//"use strict";
let dbgload = window.dbgload
dbgload && console.log('util.js: loading started. This log message is expected to come only once per page load...')		
console.log('loaded '+scriptPath());

//Put basic functions and shortcuts at the top, and those that depend on them, 
//further below:

import './stringUtil.js'
import './debugUtil.js'

//Below imports are done synchronously and this keeps things simple...
import 'https://unpkg.com/jquery/dist/jquery.min.js'
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"

//====== BOOTSTRAP INCLUDES START=======
//bootstrap says: 'load me last after all the html is loaded', but that seems less beneficial; it may actually
//cause a flicker on the page!

//Required by bootstrap. We do not bow to the version specificity unless we see a problem.
//Same is the case with jquery. We will just use the latest version and see if we face problems.
import "https://cdn.jsdelivr.net/npm/popper.js/dist/umd/popper.min.js"

//https://stackpath.bootstrapcdn.com/bootstrap/latest/js/bootstrap.min.js points to OLD version :(
import "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"

//The bootstrap is included via util.css
//====== BOOTSTRAP INCLUDES END=======

assert($!=null)
assert(window.$!=null)

$('head').prepend('<meta http-equiv="X-UA-Compatible" content="ie=edge">'+
'<meta charset="UTF-8">'+
'<meta name="viewport" content="width=device-width, initial-scale=1.0">')

assert($("textarea").resizable!=null)
//Note: this is also needed by the jquery plugin blockUI

import './objUtil.js'
import * as ldr from './loaderUtil.js'
import './domUtil.js'
import './syncUtil.js'
import './blockUiUtil.js'
import './taResizeUtil.js'

//Guard against duplicate inclusion of the jquery imports by recording that 
//they are imported:
//TODO: can't remember how exactly this will help to avoid duplicate imports given that we are using 'import'
// This might be reinventing the wheel; import might be taking care of this already?
ldr.checkAndRecordUrl('https://unpkg.com/jquery/dist/jquery.min.js')

ldr.checkAndRecordUrl
("https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js")

//It has been experimentally validated that relative paths are relative to this file's folder:
dbgload && console.log('here')
import * as u from "./util.js"
dbgload && console.log('end here')
window.u = u

//CSS is always loaded in the <head> tag
//AFAIK there is no way to restrict css scope (or need to)
window.cssFilesToLoad = ['./util.css']

//The js files to import (load in <head> tag)
//Currently below list is empty because all these essential js files are being synchronously 
//imported.
window.jsFilesToLoad = []

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

window.useTitleAsPageHeading =
function useTitleAsPageHeading(dontShowGoToParentPageLink)
{
	let d=document
	let h1= d.createElement('h1')
	h1.innerText=d.title
	insertAsFirstChild(d.body, h1)
	if(!dontShowGoToParentPageLink){showGoToParentPageLink()}
}

window.showGoToParentPageLink = 
function showGoToParentPageLink()
{
	let d=document
	let a= d.createElement('a')
	a.innerText='Go to parent page'
	a.href='..'
	a.setAttribute('class', 'btn btn-secondary btn-sm');
	insertAsFirstChild(d.body, a)
}

dbgload && console.log('util.js loaded!!!')
