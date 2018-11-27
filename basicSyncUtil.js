//this can be included as a non-module script

///Periodically checks whether the specified 'condition function' is true, at an interval specified
///in milliseconds. If true, calls the specified function 'fn'  and exits. If the total time waited
///for equals or exceeds 'timeout' milliseconds, then an exception is thrown
///last param 'timeoutsofar' is an internal one, not to be specified by the user
///sleeptime and timeout are optional parameters and default to 200 ms and 3 seconds respectively.
var fncallIdCtr=0
window.waitToRun =
function (fn,conditionfn,sleeptime,timeout,timeoutsofar)
{
	let dbg = false
	fncallIdCtr++
	let fncallId = fncallIdCtr
	if(conditionfn())
	{
		dbg && console.log('fncallId='+fncallId+': The wait for the conditionfn '+
			conditionfn+' to come true, is over!')
		setTimeout(fn,0)
		return
	}
	dbg && console.log('fncallId='+fncallId+': The conditionfn '+conditionfn+
		' did not come true yet, waiting further to run the fn...')
	
	//set defaults:
	if(sleeptime == null){sleeptime = 200}
	if(timeout == null){timeout = 3000}
	
	if(timeoutsofar == null)
	{
		timeoutsofar = sleeptime
	}
	else if(timeoutsofar >= timeout)
	{
		throw new Error('timeout reached: '+
			timeout+' millisecs, conditionfn='+conditionfn)
	}
	else
	{
		timeoutsofar+=sleeptime
	}
	setTimeout
	(
	function(){waitToRun(fn,conditionfn,sleeptime,timeout,timeoutsofar)},
	sleeptime
	)
}

window.waitUntilSymbolAppearsAndThenRun =
function (fn,symName,sleeptime,timeout)
{
	waitToRun
	(
	fn,
	function()
	{
		//console.log('Waiting for symbol \''+symName+'\' to appear...')
		return (typeof(window[symName]) != 'undefined')
	},
	sleeptime,
	timeout
	)
}
window.waitForSymbol=window.waitUntilSymbolAppearsAndThenRun
