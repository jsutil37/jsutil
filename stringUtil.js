export { isStr, matches, str, leftOf, rightOf };

import { assert } from "./debugUtil.js";

function leftOf(/** @type {string} */ s, /** @type {string} */ delim) {
  var i = s.indexOf(delim);
  if (i == -1) {
    throw new Error("delim '" + delim + "' not in '" + s + "'!!!");
  }
  return s.substring(0, i);
}
globalThis.leftOf = globalThis.leftof = leftOf;

String.prototype["leftOf"] =
  String.prototype["leftOf"] ||
  function _leftOf(/** @type {any} */ delim) {
    var target = this;
    return leftOf(target, delim);
  };

/** shortcut for JSON.stringify, nicely formatted by default */
function str(/** @type {any} */ s) {
  return JSON.stringify(s, null, "\t");
}

/** what legacy clients could still be using this? */
globalThis.str = str;

export const formattedStr = str;

function rightOf(/** @type {string} */ s, /** @type {string } */ delim) {
  var i = s.indexOf(delim);
  if (i == -1) {
    throw new Error("delim '" + delim + "' not in '" + s + "'!!!");
  }
  return s.substring(i + delim.length);
}
globalThis.rightOf = globalThis.rightof = rightOf;

String.prototype["rightOf"] =
  String.prototype["rightOf"] ||
  function _rightOf(/** @type {any} */ delim) {
    var target = this;
    return rightOf(target, delim);
  };

globalThis.partBetween = function (
  /** @type {any} */ s,
  /** @type {any} */ leftDelim,
  /** @type {any} */ rightDelim
) {
  s = rightof(s, leftDelim);
  return leftof(s, rightDelim);
};

String.prototype.replaceAll = function (
  /** @type {any} */ search,
  /** @type {any} */ replacement
) {
  var target = this;
  return mysplit(target, search).join(replacement);
};

globalThis.capitalized = function capitalized(/** @type {string} */ string) {
  if (string == "") {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};
globalThis.capitalizeFirstLetter = capitalized;
globalThis.capitalise = capitalized;

///no regex confusion for delim!
///TODO: no you are the one who is confused, the parameter to split() must be of
/// a different form in order for it to be treated as a regex. So there is no
/// need to create a separate function for avoiding regex treatment of the
///parameter to split
///So TODO: Remove usage of mysplit
globalThis.mysplit = function (
  /** @type {string} */ s,
  /** @type {string} */ delim
) {
  let idx = s.indexOf(delim);
  if (idx == -1) {
    return [s];
  }
  let arr = [s.substring(0, idx)];
  s = s.substring(idx + delim.length);
  return arr.concat(mysplit(s, delim));
};

globalThis.isString = function (/** @type {any} */ value) {
  return typeof value === "string" || value instanceof String;
};

globalThis.upto100chars = function (/** @type {string | null} */ s) {
  if (s == null) {
    return ">>>NULL<<<";
  }
  if (s.length <= 100) {
    return s;
  }
  return s.substr(0, 100);
};

globalThis.withoutLastChar = function withoutLastChar(/** @type {string} */ s) {
  return s.substring(0, s.length - 1);
};

globalThis.withoutFirstChar = function withoutFirstChar(
  /** @type {string} */ s
) {
  return s.substr(1);
};

globalThis.isAlphabetic = function isAlphabetic(/** @type {string} */ ch) {
  return /^[A-Z]$/i.test(ch);
};
globalThis.isAlpha = isAlphabetic;

globalThis.isNumericChr = function isNumericChr(/** @type {string} */ chr) {
  let code = chr.charCodeAt(0);
  return code > 47 && code < 58;
};

globalThis.isUpperCase = function isUpperCase(/** @type {string} */ s) {
  return s == s.toUpperCase();
};

globalThis.decryptCamelCase = function decryptCamelCase(
  /** @type {string} */ s
) {
  s = capitalized(s);
  let s2 = "";
  for (let i = 0; i < s.length; i++) {
    let chr = s[i];
    if (isAlphabetic(chr) && isUpperCase(chr)) {
      s2 += " ";
    }
    s2 += chr;
  }
  return s2.trim();
};

globalThis.leftOfLast = function leftOfLast(
  /** @type {string} */ s,
  /** @type {string} */ delim
) {
  if (delim == "") {
    throw new Error("delim cannot be a blank string!");
  }
  let i = s.lastIndexOf(delim);
  if (i == -1) {
    throw new Error('string "' + s + '" does not contain "' + delim + '"!!!');
  }
  return s.substring(0, i);
};
String.prototype.leftOfLast = function leftOfLast(/** @type {any} */ delim) {
  return globalThis.leftOfLast(this, delim);
};

globalThis.rightOfLast = function rightOfLast(
  /** @type {string} */ s,
  /** @type {string } */ delim
) {
  if (delim == "") {
    throw new Error("delim cannot be a blank string!");
  }
  let i = s.lastIndexOf(delim);
  if (i == -1) {
    throw new Error('string "' + s + '" does not contain "' + delim + '"!!!');
  }
  return s.substr(i + delim.length);
};
String.prototype.rightOfLast = function rightOfLast(/** @type {any} */ delim) {
  return globalThis.rightOfLast(this, delim);
};

export function dosToUnix(
  /** @type {{ replaceAll: (arg0: string, arg1: string) => any; }} */ s
) {
  return s.replaceAll("\r\n", "\n");
}
export const dos2unix = dosToUnix;

globalThis.dosToUnix = dosToUnix;
globalThis.dos2Unix = dosToUnix;
globalThis.dos2unix = dosToUnix;

globalThis.indented = function indented(
  /** @type {string} */ s,
  /** @type {string} */ chr
) {
  return s
    .split("\n")
    .map((/** @type {any} */ s2) => (chr ? chr.repeat(4) : "\t") + s2)
    .join("\n");
};

/** @param {any} o */
function isStr(o) {
  return typeof o == "string";
}

/**
 *  checks whether the specified string 's' matches the specified pattern 'pattern'
	'pattern' is a string that is in my own weird pattern template.
	It may contain *1, *2 etc. which matches 0 or more characters,
	It may also contain ?1 ?2 etc. which match 1 and only 1 character.

   @param {string} s
   @param {string|any[]} pattern

   @returns {{ [x: string]: string; } | undefined } the variables'
					instantiatations if `s` matches `pattern`, else
					returns `undefined`
 */
function matches(s, pattern) {
  /** @type {{ [x: string]: string; }} */
  let instantiations = {};
  let didMatch = matchesStg2(s, parsePattern(pattern), instantiations);
  if (didMatch) {
    return instantiations;
  }
}

/**
 * @param {string} s
 * @param {any[]} pattern
 * @param {{ [x: string]: string; }} instantiations
 */
function matchesStg2(s, pattern, instantiations) {
  if (pattern.length == 0) {
    return s == "";
  }
  let part = pattern[0];
  pattern = [...pattern]; //shallow clone
  pattern.shift();
  if (!isStr(part)) {
    if (isStr(instantiations[part[0]])) {
      part = instantiations[part[0]];
    }
  }
  if (isStr(part)) {
    if (!s.startsWith(part)) {
      return false;
    }
    s = rightOf(s, part);
    return matchesStg2(s, pattern, instantiations);
  }
  const len = s.length;
  for (let i = 0; i <= len; i++) {
    let instantiationsTry = { ...instantiations };
    if (part[0].startsWith("?")) {
      if (i == 0) continue;
      if (i > 1) break;
    }
    instantiationsTry[part[0].trim()] = s.substr(0, i);
    let sRemaining = s.substr(i);
    if (matchesStg2(sRemaining, pattern, instantiationsTry)) {
      Object.assign(instantiations, instantiationsTry);
      return true;
    }
  }
  return false;
}

/**
 * @param {string|any[]} pattern
 */
function parsePattern(pattern) {
  if (typeof pattern !== "string") {
    return pattern; // we assume that the pattern is already parsed
  }
  let len = pattern.length,
    lenMinus1 = len - 1;
  let accum = "",
    numAccum = "";
  let rv = [];
  for (let i = 0; i < len; i++) {
    const c = pattern[i];
    if (c != "*" && c != "?") {
      accum += c;
      if (i != lenMinus1) continue;
    }
    if (accum != "") {
      rv.push(accum);
      accum = "";
    }
    if (i == lenMinus1) {
      break;
    }
    let varNum = null,
      numOfDigits = 0;
    assert(numAccum == "");
    for (let j = i + 1; j < len; j++) {
      const c2 = pattern[j];
      if ("0123456789".includes(c2)) {
        numOfDigits++;
        numAccum += c2;
        if (j < lenMinus1) {
          continue;
        }
      }
      assert(numAccum.length > 0);
      varNum = parseInt(numAccum);
      assert(varNum != null);
      break;
    }
    assert(varNum != null);
    rv.push([c + varNum]);
    numAccum = "";
    i += numOfDigits;
  }
  assert(numAccum == "");
  assert(accum == "");
  return rv;
}

/**
 * @param {string} str
 */
export function isFiniteWholeNumber(str) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

/**
 * @param {string} s
 * @param {string} endingToken
 * return {string}
 */
export function getJsonStringThatThisStringStartsWith(s, endingToken) {
  assert(s.startsWith('"'));
  const len = s.length;
  for (let i = 1; i < len; i++) {
    if (s.charAt(i) == '"') {
      if (s.charAt(i - 1) != "\\") {
        assert(s.substring(i + 1).startsWith(endingToken));
        return JSON.parse(s.substring(0, i + 1));
      }
    }
  }
  assert(false);
  return "";
}

/**
 * @param {string} s
 * @param {string} endingToken
 * @return {number|string}
 */
export function getJsonFiniteWholeNumberOrStringThatThisStringStartsWith(
  s,
  endingToken
) {
  if (s.startsWith('"')) {
    return getJsonStringThatThisStringStartsWith(s, endingToken);
  }
  return getFiniteWholeNumberThatThisStringStartsWith(s, endingToken);
}

/**
 * @param {string} s
 * @param {string} endingToken
 * @return {number}
 */
export function getFiniteWholeNumberThatThisStringStartsWith(s, endingToken) {
  const num = leftOf(s, endingToken);
  assert(isFiniteWholeNumber(num));
  return JSON.parse(num);
}

/**
 * @typedef {object} ElementParsingCondition
 * @property {string} delim
 * @property {(s:string,delim:string)=>any} parsingFn
 * @property {(parsingFnOutput:any)=>number} lenOfParsedStringFn
 */

/**
 * @param {string} s
 * @param {ElementParsingCondition[]} elementParsingConditions
 * @return {any[]}
 */
export function parseFancyArray(s, elementParsingConditions) {
  /** @type {any} */
  const output = [];
  for (const elementParsingCondition of elementParsingConditions) {
    const { delim, parsingFn, lenOfParsedStringFn } = elementParsingCondition;
    const ele = parsingFn(s, delim);
    output.push(ele);
    assert(s.substring(lenOfParsedStringFn(ele)).startsWith(delim));
    s = s.substring(lenOfParsedStringFn(ele) + delim.length);
  }
  assert(s === "");
  return output;
}
