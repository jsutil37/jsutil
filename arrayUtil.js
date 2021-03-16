//TODO: convert to (or at least add) non-prototype-changing forms
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
