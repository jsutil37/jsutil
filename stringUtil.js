window.leftOf = 
function(s,delim)
{
	var i = s.indexOf(delim)
	if(i==-1){throw "delim '"+delim+"' not in '"+s+"'!!!"}
	return s.substring(0,i)
}
window.leftof = leftOf

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

window.capitalizeFirstLetter = 
function(string)
{
	if(string == ''){return ''}
	return string.charAt(0).toUpperCase() + string.slice(1);
}

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

