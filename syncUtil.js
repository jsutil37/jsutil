/*
synchronization utilities

exported functions:
onDocumentReady()
appendHtmlTxtToBodyAfterDocumentIsReady()
waitToRun(fn,conditionfn,sleeptime,timeout,timeoutsofar)
waitUntilSymbolAppearsAndThenRun((fn,symName,sleeptime,timeout)
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


dbgload && console.log('reached end')