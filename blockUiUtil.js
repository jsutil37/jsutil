//wrapper around jquery's blockui plugin

import './util.js'

import "https://cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.min.js"

var blockUiMsgs = []

function composeWaitMsg()
{
	let s = ''
	let ctr=0
	blockUiMsgs.forEach
	(
		(msg)=>
		{
			if(msg==null){msg = 'Please wait...'}
			ctr++
			if(s=='')
			{
				s=msg
			}
			else
			{
				s='<br>' + '$nbsp;'.repeat(ctr)+msg
			}
		}
	)
	return s
}

function unblockUiIfCtrPermits()
{
	blockUiMsgs.pop()
	//console.log('Now blockUiCtr='+blockUiCtr)
	if(blockUiMsgs.length == 0)
	{
		$.unblockUI()
	}
	else
	{		
		$.blockUI({message: composeWaitMsg()})
	}
}

window.blockAndUnblockUI =
async function (fn,msg)
{
	blockUiMsgs.push(msg)
	$.blockUI({message: composeWaitMsg()})
	//console.log('Now blockUiCtr='+blockUiCtr)
	try{await fn()}catch(e)
	{
		blockUiMsgs.push('Error occurred!!! To try again, refresh the page...')
		$.blockUI({message: composeWaitMsg()})
		throw e
	}
	unblockUiIfCtrPermits()
}
export var blockAndUnblockUI = blockAndUnblockUI