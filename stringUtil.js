window.leftOf = 
function leftOf(s,delim)
{
	var i = s.indexOf(delim)
	if(i==-1){throw "delim '"+delim+"' not in '"+s+"'!!!"}
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
	if(i==-1){throw "delim '"+delim+"' not in '"+s+"'!!!"}
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
