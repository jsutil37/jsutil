//math utilities including arbitrary precision math
export {
	wholeIntTo32bitBinaryString,
	wholeIntTo32bitArray,
	stringToBinaryStringPrefixedWithItsLength,
	ThirtyTwoBitBinaryStringToWholeInt,
	stringToBinaryString,
	stringToBigInt
}

//whole int means whole number, i.e. a non-negative int
function wholeIntTo32bitBinaryString(i) {
	const maxAllowedInt = 0xffffffff;
	//alert('maxAllowedInt='+maxAllowedInt);
	assert(i <= maxAllowedInt);
	assert(i >= 0);
	let rv = i.toString(2);
	assert(rv.length <= 32);
	let numOfZeroesToPrefix = 32 - rv.length;
	for (let j = 0; j < numOfZeroesToPrefix; j++) {
		rv = '0' + rv;
	}
	return rv;
}

/**
 * @param {number} i
 */
function wholeIntTo32bitArray(i) {
  const str = wholeIntTo32bitBinaryString(i);
  const output = [];
  assert(str.length == 32);
  for (let j = 0; j < 32; j++) {
    const bitChr = str.charAt(j);
    assert(["0", "1"].includes(bitChr));
    output.push(bitChr == "1");
  }
  return output;
}

function stringToBinaryStringPrefixedWithItsLength(s) {
	let a = wholeIntTo32bitBinaryString(s.length * 8);
	let b = stringToBinaryString(s);
	let rv = a + b;
	console.log('stringToBinaryStringPrefixedItsLength(): ' +
		's=\'' + s + '\', return value=' + a + ' ' + b);
	return rv;
}

function ThirtyTwoBitBinaryStringToWholeInt(s) {
	let i = Number(BigInt('0b' + s));
	const maxAllowedInt = 0xffffffff;
	//alert('maxAllowedInt='+maxAllowedInt);
	assert(i <= maxAllowedInt);
	assert(i >= 0);
	return i;
}

function stringToBinaryString(s) {
	let retval = '';
	for (let i = 0; i < s.length; i++) {
		let charr = s.charAt(i);
		let binn = charr.charCodeAt(0).toString(2);
		assert(binn.length <= 8);
		let numOfZeroesToPrefix = 8 - binn.length;
		for (let j = 0; j < numOfZeroesToPrefix; j++) {
			binn = '0' + binn;
		}
		retval += binn;
	}
	//alert('retval='+retval);
	return retval;
}

function stringToBigInt(s) {
	return BigInt('0b' + stringToBinaryString(s));
}
