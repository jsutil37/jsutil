export { todo, assert, printAndReturn }

let dbgload = globalThis.dbgload
dbgload && console.log('start')

// ensure browser's 'alert' API wherever used, does not prevent code from
// running if called from nodejs:
if (typeof alert === 'undefined') {
	globalThis.alert = console.log
}

globalThis.callingFnName =
	function () {
		try {
			throw new Error('')
		} catch (e) {
			let dbg = false
			let s = e.stack
			dbg && console.log('e.stack=' + s)
			//debugger
			//skip this function ('callingFnName') itself 
			s = rightOf(s, 'callingFnName')
			dbg && console.log('rightOf \'callingFnName\'=' + s)
			//skip the function that called callingFnName because otherwise we would end up returning the function's own name to itself:
			s = rightOf(s, ' at ')
			dbg && console.log('rightOf \' at \'=>>>' + s + '<<<')
			//This 
			let retval = stringBetween(s, ' at ', '(').trim()
			dbg && console.log('retval=\'' + retval + '\'')
			return retval
		}
	}

globalThis.rightOf = (/** @type {string} */ s, /** @type {string } */ delim) => {
	let i = s.indexOf(delim)
	if (i == -1) {
		alert('internal error, please open the debug console and then continue')
		debugger
	}
	return s.substr(i + delim.length)
}

globalThis.stringBetween = function (/** @type {string} */ s, /** @type {string } */ startDelim, /** @type {string} */ endDelim) {
	let i = s.indexOf(startDelim)
	if (i == -1) {
		alert('internal error. Open the debug globalThis.')
		debugger
	}
	i += startDelim.length
	s = s.substr(i)
	i = s.indexOf(endDelim)
	if (i == -1) {
		alert('internal error. Open the debug globalThis.')
		debugger
	}
	return s.substr(0, i)
}

function assert(
	/** @type {any} */ x,
	/** @type {string | null | Function} */ errMsg) {
	if (x) { return }
	let s = (errMsg == null) ? 'assert failed' : "Assert Failed\n"
	if (typeof (errMsg) === 'string') {
		s += errMsg
	} else if (errMsg != null) {
		const fnVal = errMsg()
		if (typeof (fnVal) === 'string') {
			s += fnVal
		}
	}
	console.log(s);
	debugger;
	a(s)
	debugger;
	throw new Error(s)
}

globalThis.assert = assert

/** shortcut for alert*/
globalThis.a = alert

/** shortcut for console.log */
globalThis.p = console.log

globalThis.checkParams =
	function (/** @type {{}} */ params, /** @type {any[]} */ arrayOfKeys) {
		let dbg = false
		let cfn = callingFnName()
		dbg && console.log('cfn=>>>' + cfn + '<<<')
		checkThat
			(
				{
					condition: (typeof (params) == "object"),
					errMsgFn: function () { return cfn + '(): The param of' + callingFnName() + '() is not an object!!!' }
				}
			)
		checkThat
			(
				{
					condition: (typeof (arrayOfKeys) == "object" &&
						Array.isArray(arrayOfKeys)),
					errMsgFn: function () { return cfn + "(): param 'arrayOfKeys' is not an array! Instead its type is '" + typeof (arrayOfKeys) + "' and its value is '" + JSON.stringify(arrayOfKeys) + "'" }
				}
			)

		arrayOfKeys.forEach
			(
				function (/** @type {string} */ key) {
					checkThat
						(
							{
								condition: (key in params),
								errMsgFn: function () { return cfn + '(): param \'' + key + '\' is missing!' }
							}
						)
				}
			)

		checkThat({
			condition: arrayOfKeys.length == Object.keys(params).length,
			errMsgFn: function () { return cfn + '(): mismatch in number of expected arguments! The expected arguments are ' + JSON.stringify(arrayOfKeys) }
		})
	}
globalThis.checkArgs = globalThis.checkParams

globalThis.runWithAlertOnException =
	async function (/** @type {{ fn: any; exceptionMsgPrefix: any; }} */ params) {
		checkParams(params, ['fn', 'exceptionMsgPrefix'])
		let fn = params.fn
		let exceptionMsgPrefix = params.exceptionMsgPrefix
		try {
			await fn()
		}
		catch (e) {
			a(exceptionMsgPrefix + '\n\nDetails:\n' + e.message + '\n' + e.stack)
			throw e
		}
	}
globalThis.runDebug = runWithAlertOnException
globalThis.showCaughtError = runWithAlertOnException

///params are {condition, errMsgFn}
globalThis.checkThat =
	function checkThat(/** @type {{ condition: any; errMsgFn: () => string; }} */ params) {
		if (!('condition' in params)) {
			debugger
			throw new Error('checkThat(): param \'condition\' is missing!')
		}
		if (!('errMsgFn' in params)) {
			debugger
			throw new Error('checkThat(): param \'errMsgFn\' is missing!')
		}
		if (params.condition) { return }
		let msg = callingFnName() + "(): " + params.errMsgFn()
		//globalThis.alert(msg)//we have an error message shown by the global error
		//handler
		debugger
		throw new Error(msg)
	}

globalThis.onerror =
	function (
		/** @type {string|event} */ message,
		/** @type {string|undefined} */ url,
		/** @type {number|undefined} */ line,
		/** @type {number|undefined} */ col,
		/** @type {Error|undefined} */ error) {
		let s = 'ERROR\n' +
			message +
			'\nurl:' + url +
			'\nline: ' + line +
			', col: ' + col +
			'\nerror.stack:\n' + (error ?
				(error.stack ? error.stack : '(error.stack is null)')
				: '(error is null)')
		this.console.log(s)
		alert("(This has also been logged to the debug console)\n\n" + s)
		debugger
	}

globalThis.uniqueMsgCtr = (globalThis.uniqueMsgCtr == null) ? 0 :
	globalThis.uniqueMsgCtr

globalThis.uniqueMsg =
	function (/** @type {string} */ s) {
		globalThis.uniqueMsgCtr++
		return "unique msg #" + uniqueMsgCtr + ":\n" + s +
			"\nEND unique msg #" + uniqueMsgCtr
	}

globalThis.bigLog =
	function (/** @type {{ stack: any; }} */ err, /** @type {string} */ s) {
		let errPart = stringBetween(err.stack, ' at ', ')').trim() + ')'
		s = uniqueMsg(s)
		let sArr = s.split("\n")
		//console.log("bigLog(): fileName: '"+fileName+"', lineNumber: "+lineNumber)
		console.log("bigLog(): " + errPart)
		sArr.forEach(function (/** @type {any} */ s) {
			console.log(s)
		})
		//console.log("bigLog(): END fileName: '"+fileName+
		//	"', lineNumber: "+lineNumber)
		console.log("bigLog(): END " + errPart)
	}

function todo() {
	debugger;
	alert('TODO (open debugger to see the applicable line)');
	debugger;
	throw new Error('TODO');
}

//to print out an array of strings for debugging purposes
globalThis.strWithoutQuotes = function (/** @type {any[]} */ arr, /** @type {any} */ useEnter) {
	let rv = '[';
	let wasFirstEleEncountered = false;
	arr.forEach((/** @type {string} */ ele) => {
		if (wasFirstEleEncountered) { rv += ','; }
		if (useEnter) { rv += '\n'; }
		assert(isString(ele));
		rv += ele;
		wasFirstEleEncountered = true;
	});
	if (useEnter) { rv += '\n'; }
	return rv + ']';
}

globalThis.scriptPath = function scriptPath() {
	try {
		//Throw an error to generate a stack trace
		throw new Error();
	}
	catch (e) {
		//Split the stack trace into each line
		var stackLines = e.stack.split('\n');
		//Now walk though each line until we find a path reference
		for (let i in stackLines) {
			let s = stackLines[i];
			//console.log('s',s);
			if (s.indexOf('scriptPath') != -1) { continue; }
			if (s.match(/http[s]?:\/\//)) {
				return s.substr(s.indexOf('http'));
			}
			if (s.match(/file?:\/\//)) {
				return s.substr(s.indexOf('file://'));
			}
		}
	}
}

export const primitiveTypes = ['string', 'number', 'bigint', 'boolean', 'undefined', 'symbol']

/**
 * Traverses a javascript object, and deletes all circular and duplicate values.
 * This can be used to print out circular objects in JSON format, for debugging purposes.
 * @returns a clone of the object with circular values deleted
 */
export function preventCircularJson(source, encounteredObjects, path) {
	//  primitive data types: string, number, bigint, boolean, undefined, symbol, and null
	if(source == null) {
		return null
	}
	const typeStr = typeof source
	if(primitiveTypes.includes(typeStr)) {
		return source
	}

	//init recursive values if this is the first call
    	encounteredObjects= encounteredObjects || new Map();
	assert(path == null || Array.isArray(path));
	path = path || ['$$$rootObj'];
	assert(path == null || Array.isArray(path));
	
	const check = encounteredObjects.get(source) 
	if(check != null) {
		return check 
	}
	encounteredObjects.set(source, path.join("/"))
	if(Array.isArray(source)) {	
		let idx = -1
		let newArr = []
		for(const ele of source) {
			idx++
			const newPath = [...path]
			newPath.push(`[${idx}]`)
			newArr.push(preventCircularJson(ele,encounteredObjects,newPath))
		}
		return newArr
	}
	if(typeStr != 'object') {
		return 'object of type '+typeStr
	}
	let retVal = {}
	for (const [key, value] of Object.entries(source)) {
		const newPath = [...path]
		newPath.push(key)
		retVal[key] = preventCircularJson(value, encounteredObjects, newPath)
	}
    	return retVal;
}

/**
	like JSON.stringify() but handles circular references. Useful for debugging.
	See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify for parameter
*/
export function safeJsonStringify(o, replacer, space) {
	return JSON.stringify(preventCircularJson(o),replacer,space)
}

const printAndReturn = (s, o) => {
  console.log(s + ': ', o);
  return o;
};

dbgload && console.log('reached end')
