//Javascript utility functions
//latest online version at https://jsutil37.github.io/jsutil/util.js
//License: MIT
//Github repository: https://github.com/jsutil37/jsutil

//Import this file as an ES6 module.
//Once this file is run, it exposes itself via window.u

//"use strict";
//x=null//uncomment this and you will see that in a js file imported as a 
//module, "use strict" is not necessary

console.log('util.js: loading started. This log message is expected to come only once per page load...')		

//Put basic functions and shortcuts at the top, and those that depend on them, 
//further below:

import './stringUtil.js'
import './debugUtil.js'

//Below imports are done synchronously and this keeps things simple...
import 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'
assert($!=null)
assert(window.$!=null)

$('head').prepend('<meta http-equiv="X-UA-Compatible" content="ie=edge">'+
'<meta charset="UTF-8">'+
'<meta name="viewport" content="width=device-width, initial-scale=1.0">')

import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"
assert($("textarea").resizable!=null)
//Note: this is also needed by the jquery plugin blockUI

import './objUtil.js'
import './loaderUtil.js'
import './domUtil.js'
import './syncUtil.js'
import './blockUiUtil.js'
import './taResizeUtil.js'

//It has been experimentally validated that relative paths are relative to this file's folder:
import * as u from "./util.js"
window.u = u

//CSS is always loaded in the <head> tag
//AFAIK there is no way to restrict css scope (or need to)
window.cssFilesToLoad = ['./util.css']

//The js files to import (load in <head> tag)
//Currently below list is empty because all these essential js files are being synchronously 
//imported.
window.jsFilesToLoad = []

loadAllTypesOfFiles()

//bootstrap js needs to be at the end of the document... so:
appendHtmlToBodyAfterDocumentIsReady
(
'<'+'script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"'+
' integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></'+
'script>'
)
/**/


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

console.log('util.js loaded!!!')