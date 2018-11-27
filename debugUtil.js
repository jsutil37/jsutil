let dbgload = window.dbgload
dbgload && console.log('start')

window.callingFnName=
function (){
	try {
		throw new Error('')
	} catch (e) 
	{
		let s = e.stack

		//skip this function ('callingFnName') itself 
		s = rightOf(s,'callingFnName')

//skip the function that called callingFnName because otherwise we would end up returning the function's own name to itself:
		s = rightOf(s, 'at ')
		
		//This 
		return stringBetween(s,'at ' , '(').trim()
	}
}

window.rightOf = (s,delim)=> {
	let i = s.indexOf(delim)
	if(i==-1) {
		alert('internal error, please open the debug console and then continue')
		debugger
	}
	return s.substr(i+delim.length)
}

window.stringBetween = function(s,startDelim,endDelim) {
	let i = s.indexOf(startDelim)
	if(i == -1) {
		alert('internal error. Open the debug window.')
		debugger
	}
	i+=startDelim.length
	s=s.substr(i)
	i=s.indexOf(endDelim)
	if(i==-1) {
		alert('internal error. Open the debug window.')
		debugger
	}
	return s.substr(0,i)
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
	let cfn = callingFnName()
	//alert('In checkParams(), cfn=\''+cfn+'\'')
	checkThat
	(
	{
		condition: (typeof(params)=="object"),
		errMsgFn: function(){return cfn+'(): The param of'+callingFnName()+'() is not an object!!!'}
	}
	)	
	checkThat
	(
	{
		condition: (typeof(arrayOfKeys)=="object" && 
			Array.isArray(arrayOfKeys)),
		errMsgFn: ()=> cfn+"(): param 'arrayOfKeys' is not an array! Instead its type is '"+typeof(arrayOfKeys)+"' and its value is '"+JSON.stringify(arrayOfKeys)+"'"
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
			errMsgFn: function(){return cfn+'(): param \''+key+'\' is missing!'}
		}
		)
	}
	)

	checkThat({
		condition: arrayOfKeys.length == Object.keys(params).length,
		errMsgFn: ()=>{cfn+'(): mismatch in number of expected arguments! The expected arguments are '+JSON.stringify(arrayOfKeys)}
	})
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
	if(!('condition' in params))
	{
		throw new Error('checkThat(): param \'condition\' is missing!')
	}
	if(!('errMsgFn' in params))
	{
		throw new Error('checkThat(): param \'errMsgFn\' is missing!')
	}
	if(params.condition){return}
	let msg = callingFnName() + "(): "+params.errMsgFn()
	//window.alert(msg)//we have an error message shown by the global error
	//handler
	throw new Error(msg)
}

window.onerror = 
function(message, url, line, col, error)
{
	let s = 'ERROR CAUGHT BY GLOBAL ERROR HANDLER\n'+message + '\nurl:' + url+
		'\nline: '+line+', col: '+col+
		//'\nerror: '+error +
		'\nerror.stack:\n'+error.stack
	this.console.log(s)
	alert(s)
}

dbgload && console.log('reached end')
