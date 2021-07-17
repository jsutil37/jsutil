export { removeFirstEle }
// TODO: convert all to (or at least add) non-prototype-changing forms

import { assert } from './bothClientAndServerSideUtil.js'

assert(Array.prototype.removeFirstEle == null)
Array.prototype.removeFirstEle = function () { return this.shift() }

function removeFirstEle(arr) {
	return arr.shift()
}

assert(Array.prototype.lastEle == null)
Array.prototype.lastEle = function () { return this[this.length - 1] }

assert(Array.prototype.removeLastEle == null)
Array.prototype.removeLastEle = function () { return this.pop() }

assert(Array.prototype.asyncForEach == null)
Array.prototype.asyncForEach = async function (fn) {
	for (let i = 0; i < this.length; i++) {
		await fn(this[i], i);
	}
}

/*
const mapWithThrow = <T,U>(arr:T[],func:(arg0:T)=>U):U[] {
	const mapErrors:any[] = [];
	const ry =arr.map((t:T)=>{
		try{
			return func(t);
		} catch(e) {
			mapErrors.push(e);
			return undefined as unknown as U;
		}
	};
	if(mapErrors.length!==0){throw mapErrors[0];}
	return rv;
};
*/
