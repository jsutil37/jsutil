window.leftOf = 
function(s,delim)
{
	var i = s.indexOf(delim)
	if(i==-1){throw "delim '"+delim+"' not in '"+s+"'!!!"}
	return s.substring(0,i)
}
window.leftof = leftOf

String.prototype.leftOf = String.prototype.leftOf ||
function(delim)
{
    var target = this
    return leftOf(target,delim)
}
	
//shortcut for JSON.stringify
window.str = function(s){return JSON.stringify(s)}

window.rightOf =
function (s,delim)
{
	var i = s.indexOf(delim)
	if(i==-1){throw "delim '"+delim+"' not in '"+s+"'!!!"}
	return s.substring(i+delim.length)
}
window.rightof = rightOf

String.prototype.rightOf = String.prototype.rightOf ||
function(delim)
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

window.capitalized 
function(string)
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

window.decryptCamelCase =
function decryptCamelCase(s)
{
	let s = capitalized(s);
	let s2 = ''
	for (let i = 0; i < s.length; i++){
		if(s[i] = s[i].toUpperCase()){s2+=' '}
		s2+=s[i]
	}
	return s2.trim()
}
