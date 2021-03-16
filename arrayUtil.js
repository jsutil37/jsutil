//TODO: convert to (or at least add) non-prototype-changing forms

//copy-paste assert function into this file, so as to prevent circular dependencies (bad hack, TODO: if needed create a basic debug util file):
function assert(x, errMsg) {
	if(x){return}
	let s =(errMsg == null)?'assert failed':"Assert Failed\n"+errMsg
	debugger
	a(s)
	throw new Error(s)
}

assert(Array.prototype.removeFirstEle==null)
Array.prototype.removeFirstEle=function(){return this.shift()}

assert(Array.prototype.lastEle==null)
Array.prototype.lastEle=function(){return this[this.length-1]}

assert(Array.prototype.removeLastEle==null)
Array.prototype.removeLastEle=function(){return this.pop()}

assert(Array.prototype.asyncForEach==null)
Array.prototype.asyncForEach = async function (fn) {
    for (let i = 0; i < this.length; i++) {
      await fn(this[i], i);
    }
}
