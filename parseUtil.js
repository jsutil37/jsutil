import { loopFn, ifFn } from './bothClientAndServerSideUtil.js'

export { parse }

/**
 * @param {string} scriptText
 * @param {string} token
 */
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
	function (/** @type {string} */ scriptText) {
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
				rv.push({ type: 'code', text })
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
	function (/** @type {string} */ quoteChr, /** @type {string} */ scriptText) {
		assert(["'", '"', "`"].includes(quoteChr))
		assert(scriptText.startsWith(quoteChr))
		let strToSearchIn = scriptText.substr(1)
		let strToSearchInParts = mysplit(strToSearchIn, '\\' + quoteChr)
		let searchEndIdx = 0
		let closingQuotesFound = false
		strToSearchInParts.some
			(
				(/** @type {string } */ part) => {
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

window.withCommentsRemoved = function withCommentsRemoved(/** @type {string} */ s) {
	const arr = scriptCommentAndNonCommentAreas(s)
	let rv = ''
	for (const ele of arr) {
		if (ele.type != 'comment') { rv += ele.text }
	}
	return rv
}

/**
 * @param {string} str
 * @param {any} rules
 */
function parse(str, rules) {
	let parentToken = { parentToken: null, childTokens: [] }
	let s = { parseIx: 0, str, rules, token: '', result: parentToken, parentToken }
	loopFn(s, shouldParsingContinue, doParseStep, initForNxtParseStep)
	return s.result
}

/**
 * @param {{ isEndReached: boolean; parseErr: any; }} s
 */
function shouldParsingContinue(s) {
	return !(s.isEndReached || (s.parseErr != null))
}

/**
 * @param {{ isEndReached: boolean; parseIx: number; str: string | any[]; }} s
 */
function doParseStep(s) {
	s.isEndReached = (s.parseIx >= s.str.length)
	if (s.isEndReached) { assert(s.parseIx == s.str.length) }
	doParseStepStg2(s)
}

/**
 * @param {{ [x: string]: any; parseIx: number; chr: any; rmgStr: any; str: string; }} s
 */
function initForNxtParseStep(s) {
	s.parseIx++
	s.chr = s[s.parseIx]
	s.rmgStr = s.str.substr(s.parseIx)
}

/**
 * @param {{ someRuleMatched: boolean; rules: any; rule: any; parseErr: string; chr: string; parseIx: string; }} s
 */
function doParseStepStg2(s) {
	s.someRuleMatched = false
	for (const rule of s.rules) {
		s.rule = rule
		ifFn(s, parseRuleMatches, applyParseRule)
	}
	if (s.someRuleMatched) { return }
	s.parseErr = "unexpected character '" + s.chr + "' at index " + s.parseIx + " (row #TODO, col #TODO)"
}

/**
 * returns true or false depending on whether the current parsing rule matches
 *  the start of the remaining string
   @param {{ rule: { isApplicable: any; token: null; isForEndReached: any; }; isEndReached: any; rmgStr: string; }} s
 */
function parseRuleMatches(s) {
	if (!s.rule.isApplicable) { return false }
	if (s.rule.token == null) {
		if (s.rule.isForEndReached) { return s.isEndReached }
		return true
	}
	return (s.rmgStr.startsWith(s.rule.token))
}

/**
 * @param {{ someRuleMatched: boolean; rule: { namesOfApplicableRules: any; }; rules: any; }} s
 */
function applyParseRule(s) {
	s.someRuleMatched = true
	ifFn(isTokenRule, collectToken, extendToken)
	const namesOfApplicableRules = s.rule.namesOfApplicableRules
	//after a token match, the applicability of some rules might change:
	for (const rule of s.rules) {
		rule.isApplicable = namesOfApplicableRules.includes(rule.name)
	}
}

/**
 * @param {{ rule: { tokenType: string; token: string | any[]; name: any; }; parentToken: { parentToken?: any; childTokens?: any; ruleName?: any; parseIx?: any; token?: any; } | null; parseErr: string; parseIx: string | number; token: string; }} s
 */
function collectToken(s) {
	assert(['opening', 'closing', 'sibling'].includes(s.rule.tokenType))
	if (s.rule.tokenType == 'closing') {
		s.parentToken = s.parentToken.parentToken
		if (s.parentToken == null) {
			s.parseErr = "unexpected closing token '" + s.rule.token + "' at index " + s.parseIx + " (row #TODO, col #TODO)"
			return
		}
	}
	let token = { ruleName: s.rule.name, parseIx: s.parseIx, token: s.rule.token }
	s.parentToken.childTokens.push(token)
	s.token = ''
	s.parseIx += s.rule.token.length - 1
	if (s.rule.tokenType == 'opening') {
		s.parentToken = token
	}
}

/**
 * @param {{ rule: { token: null; }; }} s
 */
function isTokenRule(s) {
	return (s.rule.token != null)
}

/**
 * @param {{ token: any; chr: any; }} s
 */
function extendToken(s) {
	s.token += s.chr
}
