import './util.js'

export {parse}

function tokenIxOrFullLenIfAbsent(scriptText, token) {
	const ix = scriptText.indexOf(token)
	return (ix != -1) ? ix : scriptText.length
}

window.dbgScriptTexts = []

/**
 * Given text that is JS code, returns an array of elements. Each element is an
 * object having 2 members: 'type' and 'text'. 'text' is the text of the parsed
 * node. 'type' can be three values: 'code', 'comment' and 'textInCode'
 */
window.scriptCommentAndNonCommentAreas =
	function (scriptText) {
		let dbg = true
		dbgScriptTexts = []
		let rv = []
		while (true) {
			if (dbg) { dbgScriptTexts.push(scriptText) }
			if (scriptText == '') { return rv }
			const idx1 = tokenIxOrFullLenIfAbsent(scriptText, "'")
			const idx2 = tokenIxOrFullLenIfAbsent(scriptText, '"')
			const idx3 = tokenIxOrFullLenIfAbsent(scriptText, "//")
			const idx4 = tokenIxOrFullLenIfAbsent(scriptText, "/*")
			const idx5 = tokenIxOrFullLenIfAbsent(scriptText, "`")
			let leastVal = Math.min(idx1, idx2, idx3, idx4, idx5)
			if (leastVal == scriptText.length) {       //case of no tokens found
				rv.push({ type: 'code', text: scriptText });
				dbg && console.log('type: code, text: >>>' + scriptText + '<<<')
				return rv
			}
			if (leastVal != 0) {
				//case of tokens found, but not at start
				let text = scriptText.substring(0, leastVal)
				rv.push({ type: 'code', text  })
				dbg && console.log('type: code, text: >>>' + text + '<<<')
				scriptText = scriptText.substr(leastVal)
				continue
			}
			//case of token found at start
			let searchEndIdx, areaType
			//searchEndIdx will be set to the end of the areaType that scriptText starts with
			if ([idx1, idx2, idx5].includes(0)) {
				//case of (opening) quote found at start
				areaType = 'textInCode'
				let quoteChr = (0 == idx1) ? "'" : ((0 == idx2) ? '"' : "`")
				searchEndIdx = idxOfClosingQuoteOfTextInCode(quoteChr, scriptText)
			} else if (0 == idx3) {
				areaType = 'comment'
				searchEndIdx = scriptText.indexOf("\n", idx3)
				if (searchEndIdx == -1) { searchEndIdx = scriptText.length - 1 }
			} else {
				assert(idx4 == 0)
				areaType = 'comment'
				searchEndIdx = scriptText.indexOf("*/")
				assert(searchEndIdx > 0)
				searchEndIdx++//because this is the only ending thing that has two chars
			}
			let areaText = scriptText.substring(0, searchEndIdx + 1)
			rv.push({ type: areaType, text: areaText })
			dbg && console.log('type:' + areaType + ', text: >>>' + areaText + '<<<')
			let remainingText = ""
			if (searchEndIdx < scriptText.length - 1) {
				scriptText = scriptText.substring(searchEndIdx + 1)
			} else {
				assert(searchEndIdx == scriptText.length - 1)
				return rv
			}
		}
	}

window.idxOfClosingQuoteOfTextInCode =
	function (quoteChr, scriptText) {
		assert(["'", '"', "`"].includes(quoteChr))
		assert(scriptText.startsWith(quoteChr))
		let strToSearchIn = scriptText.substr(1)
		let strToSearchInParts = mysplit(strToSearchIn, '\\' + quoteChr)
		let searchEndIdx = 0
		let closingQuotesFound = false
		strToSearchInParts.some
			(
				(part) => {
					if (part.indexOf(quoteChr) != -1) {
						searchEndIdx += part.indexOf(quoteChr)
						closingQuotesFound = true
						return true
					}
					searchEndIdx += part.length + 2
				}
			)
		assert(closingQuotesFound)
		searchEndIdx++ //strToSearchIn was 1 char after scriptText
		assert(scriptText.substr(searchEndIdx, 1) == quoteChr)
		return searchEndIdx
	}

window.withCommentsRemoved = function withCommentsRemoved(s) {
	const arr = scriptCommentAndNonCommentAreas(s)
	let rv = ''
	for (const ele of arr) {
		if (ele.type != 'comment') { rv += ele.text }
	}
	return rv
}

function parse(str,rules) {
	let s = {parseIx:0,str,rules}
	loopFn(s, shouldParsingContinue, doParseStep, initForNxtParseStep)
	return s.result
}

function shouldParsingContinue(s) {
	if(s.isEndReached){return false}
	return (s.parseErr != null)
}

function doParseStep(s) {
	s.isEndReached = (s.parseIx >= s.str.length)
	if(s.isEndReached) {assert(s.parseIx == s.str.length)}
	doParseStepStg2(s)
}

function initForNxtParseStep(s) {
	s.parseIx++
}

function doParseStepStg2(s) {
	for(const rule of s.rules){
		s.rule = rule
		ifFn(s, parseRuleMatches, applyParseRule)
	}
}

function parseRuleMatches(s) {
	todo()
}

function applyParseRule(s) {
	todo()
}
