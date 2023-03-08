/*
synchronization utilities

exported functions:
onDocumentReady()
appendHtmlTxtToBodyAfterDocumentIsReady()
waitToRun(fn,conditionfn,sleeptime,timeout,timeoutsofar)
waitUntilSymbolAppearsAndThenRun((fn,symName,sleeptime,timeout) --defined in basicSyncUtil.js
*/

let dbgload = window.dbgload
dbgload && console.log('start')
import './util.js'
import './basicSyncUtil.js'
dbgload && console.log('After import of util.js...')

window.onDocumentReady =
function(func)
{
	$(document).ready(func)
}

window.appendHtmlTxtToBodyAfterDocumentIsReady =
function(html, url)
{	
	let dbg = false
	onDocumentReady
	(
		function()
		{
			dbg && console.log(
				'Before appending '+html+' to the document body...')
			appendHtmlTxtToBody(html, url)
			dbg && console.log(
				'After appending '+html+' to the document body...')
		}
	)
}

window.loadNext = 
function(fn)
{
	let prevOnload = window.onload
}

/**
 * @param {any} storageObject
 * @param {string } storageAttribute
 * @param {any} fn
 */
export function runOnlyOnce(storageObject, storageAttribute, fn) {
  if (storageObject[storageAttribute] != null) {
    return;
  }
  storageObject[storageAttribute] = true;
  fn();
}

dbgload && console.log('reached end')
