export {isStr, matches}

window.leftOf = 
function leftOf(s,delim)
{
	var i = s.indexOf(delim)
	if(i==-1){throw new Error("delim '"+delim+"' not in '"+s+"'!!!")}
	return s.substring(0,i)
}
window.leftof = leftOf

String.prototype.leftOf = String.prototype.leftOf ||
function _leftOf(delim)
{
    var target = this
    return leftOf(target,delim)
}
	
//shortcut for JSON.stringify
window.str = function str(s){return JSON.stringify(s)}

window.rightOf =
function rightOf(s, delim)
{
	var i = s.indexOf(delim)
	if(i==-1){throw new Error("delim '"+delim+"' not in '"+s+"'!!!")}
	return s.substring(i+delim.length)
}
window.rightof = rightOf

String.prototype.rightOf = String.prototype.rightOf ||
function _rightOf(delim)
{
    var target = this
    return rightOf(target,delim)
}

 window.partBetween =
 function (s,leftDelim,rightDelim)
{
	s = rightof(s,leftDelim)
	return leftof(s,rightDelim)
}

String.prototype.replaceAll =
function(search, replacement)
{
    var target = this
    return mysplit(target,search).join(replacement)
}

window.capitalized =
function capitalized(string)
{
	if(string == ''){return ''}
	return string.charAt(0).toUpperCase() + string.slice(1);
}
window.capitalizeFirstLetter =  capitalized
window.capitalise =  capitalized

///no regex confusion for delim!
window.mysplit = 
function(s,delim)
{
	let idx= s.indexOf(delim)
	if(idx==-1){return [s]}
	let arr = [s.substring(0,idx)]
	s=s.substring(idx+delim.length)
	return arr.concat(mysplit(s,delim))
}

window.isString = 
function (value) {
	return typeof value === 'string' || value instanceof String;
}

window.upto100chars = 
function(s)
{
	if(s==null){return ">>>NULL<<<"}
	if(s.length<=100){return s}
	return s.substr(0,100)
}

window.withoutLastChar = 
function withoutLastChar(s)
{
	return s.substring(0,s.length - 1)
}


window.withoutFirstChar = 
function withoutFirstChar(s)
{
	return s.substr(1)
}

window.isAlphabetic =
function isAlphabetic(ch)
{
	return /^[A-Z]$/i.test(ch)
}
window.isAlpha = isAlphabetic

window.isNumericChr =
function isNumericChr(chr)
{
	let code = chr.charCodeAt(0)
	return (code > 47 && code < 58)
}

window.isUpperCase = 
function isUpperCase(s)
{
	return s == s.toUpperCase()
}

window.decryptCamelCase =
function decryptCamelCase(s)
{
	s = capitalized(s);
	let s2 = ''
	for (let i = 0; i < s.length; i++)
	{
		let chr = s[i]
		if(isAlphabetic(chr) && isUpperCase(chr)){s2+=' '}
		s2+=chr
	}
	return s2.trim()
}

window.leftOfLast = 
function leftOfLast(s, delim)
{
	if(delim==''){throw new Error('delim cannot be a blank string!')}
	let i = s.lastIndexOf(delim)
	if(i == -1){throw new Error('string "'+s+'" does not contain "'+delim+'"!!!')}
	return s.substring(0, i)
}
String.prototype.leftOfLast = function leftOfLast(delim){return window.leftOfLast(this, delim)}

window.rightOfLast = 
function rightOfLast(s, delim)
{
	if(delim==''){throw new Error('delim cannot be a blank string!')}
	let i = s.lastIndexOf(delim)
	if(i == -1){throw new Error('string "'+s+'" does not contain "'+delim+'"!!!')}
	return s.substr(i+delim.length)
}
String.prototype.rightOfLast = function rightOfLast(delim){return window.rightOfLast(this, delim)}

window.dosToUnix =
function dosToUnix(s) {
    return s.replaceAll('\r\n','\n')
}
window.dos2Unix = dosToUnix
window.dos2unix = dosToUnix

window.indented = function indented(s,chr){return s.split('\n').map(s2=>((chr?chr.repeat(4):'\t')+s2)).join('\n')}

/** @param {any} o */
function isStr(o) { return (typeof o == 'string') }

/** 
	my own weird pattern template. pattern contains *1, *2 etc. 
	returns the variables instantiatations if s matches pattern, else returns null/undefined
*/
function matches(s, pattern) {
	let instantiations = {}
	let didMatch = matchesStg2(s, parsePattern(pattern), instantiations)
	if(didMatch){return instantiations}
}

function matchesStg2(s, pattern, instantiations) {
	if(pattern.length == 0) {return(s=='') }
	let part = pattern[0]
	pattern = [...pattern]//shallow clone
	pattern.shift()
	if(!isStr(part)) {
		if(isStr(instantiations[part])) {
			part = instantiations[part]
		}
	}
	if(isStr(part)) {
		if(!s.startsWith(part)){return false}
		s = rightOf(s, part)
		return matchesStg2(s, pattern, instantiations)
	}
	const len = s.length
	for(let i=0;i<=s.length) {
		let instantiationsTry = {...instantiations}
		instantiationsTry[(part+'').trim()] = s.substr(0,i)
		let sRemaining = s.substr(i)
		if(matchesStg2(sRemaining, pattern,instantiationsTry)){return true}
	}
	return false
}

function parsePattern(pattern) {
	let len = pattern.length, lenMinus1 = len - 1
	let accum = '', numAccum = ''
	let rv = []
	for(let i = 0; i < len; i++) {
		const c = pattern[i]
		if(c!='*'){
			accum+=c;
			if(i!=lenMinus1)continue
		}
		if(accum!='') {
			rv.push(accum)
			accum = ''
		}
		if(i==lenMinus1){break}
		let varNum = null, numOfDigits = 0
		assert(numAccum == '')
		for(let j = i+1;j<len;j++) {
			const c2 = pattern[j]
			if('0123456789'.includes(c2)) {
				numOfDigits++
				numAccum+=c2;continue
			} 
			assert(numAccum.length>0)
			varNum = parseInt(numAccum)
			break
		}
		assert(varNum != null)
		rv.push(varNum)
		numAccum = ''
		i+=numOfDigits
	}
	assert(numAccum == '')
	assert(accum == '')
	return rv
}
