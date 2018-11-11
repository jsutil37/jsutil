let dbgload = window.dbgload
dbgload && console.log('start')

window.callingFnName=
function {
return arguments.caller.caller.callee
}

window.assert =
function(x,errMsg)
{
	if(x){return}
	let s =(errMsg == null)?'assert failed':"Assert Failed\n"+errMsg
	a(s)	
	throw new Error(s)
}

//shortcut for alert
window.a = 
function (s)
{
	alert(s)
}

window.checkParams = 
function(params, arrayOfKeys)
{
	checkThat
	(
	{
		condition: (typeof(params)=="object"),
		errMsgFn: function(){return 'param \'params\' to checkParams() is not an object!!!'}
	}
	)	
	checkThat
	(
	{
		condition: (typeof(arrayOfKeys)=="object" && Array.isArray(arrayOfKeys)),
		errMsgFn: function(){return 'param \''+arrayOfKeys+'\' not an array!'}
	}
	)
		
	arrayOfKeys.forEach
	(
	function(key)
	{
		checkThat
		(
		{
			condition: (key in params),
			errMsgFn: function(){return 'param \''+key+'\' is missing!'}
		}
		)
	}
	)
}
window.checkArgs = window.checkParams

window.runWithAlertOnException =
async function (params)
{
	checkParams(params,['fn','exceptionMsgPrefix'])
	let fn = params.fn
	let exceptionMsgPrefix = params.exceptionMsgPrefix
	try
	{
		await fn()
	}
	catch(e)
	{
		a(exceptionMsgPrefix+'\n\nDetails:\n'+e.message+'\n'+e.stack)
		throw e
	}
}
window.runDebug = runWithAlertOnException
window.showCaughtError = runWithAlertOnException

///params are {condition, errMsgFn}
window.checkThat =
function (params)
{
	try
	{
		checkThat_internal(params)
	}
	catch(e)
	{
		a('Assertion failed.\n\nDetails:\n'+e.message+'\n'+e.stack)
		throw e
	}
}

function checkThat_internal(params)
{
	if(!('condition' in params))
	{
		throw new Error('param \'condition\' is missing!')
	}
	if(!('errMsgFn' in params))
	{
		throw new Error('param \'errMsgFn\' is missing!')
	}
	if(params.condition){return}
	throw new Error(params.errMsgFn())
}

window.onerror = 
function(message, url, line)
{
	let s = 'ERROR CAUGHT BY GLOBAL ERROR HANDLER\n'+message + '\nurl:' + url+
		'\nline: '+line
	alert(s)
}

dbgload && console.log('reached end')
