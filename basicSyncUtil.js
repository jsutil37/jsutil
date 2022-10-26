export async function sleep(ms) {await new Promise(resolve => setTimeout(resolve, ms));}

/**
 * Periodically checks whether the specified 'condition function' is true, at an
 * interval specified in milliseconds. If true, calls the specified function
 * 'fn'  and exits. If the total time waited for equals or exceeds 'timeout'
 * milliseconds, then an exception is thrown last param 'timeoutsofar' is an
 * internal one, not to be specified by the user sleeptime and timeout are
 * optional parameters and default to 200 ms and 3 seconds respectively.
 */
export function waitToRun(fn, conditionfn, sleeptime, timeout, timeoutsofar) {
	let dbg = false
	fncallIdCtr++
	let fncallId = fncallIdCtr
	if (conditionfn()) {
		dbg && console.log('fncallId=' + fncallId + ': The wait for the conditionfn ' +
			conditionfn + ' to come true, is over!')
		setTimeout(fn, 0)
		return
	}
	dbg && console.log('fncallId=' + fncallId + ': The conditionfn ' + conditionfn +
		' did not come true yet, waiting further to run the fn...')

	//set defaults:
	if (sleeptime == null) { sleeptime = 200 }
	if (timeout == null) { timeout = 3000 }

	if (timeoutsofar == null) {
		timeoutsofar = sleeptime
	}
	else if (timeoutsofar >= timeout) {
		throw new Error('timeout reached: ' +
			timeout + ' millisecs, conditionfn=' + conditionfn)
	}
	else {
		timeoutsofar += sleeptime
	}
	setTimeout
		(
			function () { waitToRun(fn, conditionfn, sleeptime, timeout, timeoutsofar) },
			sleeptime
		)
}
globalThis.waitToRun = waitToRun

var fncallIdCtr = 0

globalThis.waitUntilSymbolAppearsAndThenRun =
	function (fn, symName, sleeptime, timeout) {
		assert(typeof fn == 'function')
		assert(typeof symName == 'string')
		waitToRun
			(
				fn,
				function () {
					//console.log('Waiting for symbol \''+symName+'\' to appear...')
					return (typeof (globalThis[symName]) != 'undefined')
				},
				sleeptime,
				timeout
			)
	}
globalThis.waitForSymbol = globalThis.waitUntilSymbolAppearsAndThenRun
globalThis.waitForSymbolAndThenRun = globalThis.waitUntilSymbolAppearsAndThenRun

globalThis.waitForSymbolsAndThenRun =
	function (fn, symNames, sleeptime, timeout) {
		waitForSymbolAndThenRun
			(
				function () {
					if (symNames.length > 1) {
						symNames.shift()
						waitForSymbolsAndThenRun(fn, symNames, sleeptime, timeout)
						return
					}
					fn()
				},
				symNames[0], sleeptime, timeout
			)
	}
globalThis.waitForSymbols = waitForSymbolsAndThenRun

globalThis.waitForFnAndThenRunIt = function (s, args, timeoutInMilliSec) {
	waitForSymbol(async function () {
		try { await globalThis[s](args) } catch (e) { throw e }
	}, s, 200, timeoutInMilliSec)
}

let lastSleepTime = new Date().getTime();
export async function sleepIfNotSleptRecently(milliseconds) {
  const millisecondsElapsed = new Date().getTime() - lastSleepTime;
  if (millisecondsElapsed >= 5000) {
    await sleep(milliseconds);
    lastSleepTime = new Date().getTime();
  }
}