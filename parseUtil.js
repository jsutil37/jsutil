import './util.js'

/**
 * Given text that is JS code, returns an array of elements. Each element is an
 * object having 2 members: 'type' and 'text'. 'text' is the text of the parsed
 * node. 'type' can be three values: 'code', 'comment' and 'textInCode'  
 */
window.scriptCommentAndNonCommentAreas =
function (scriptText)
{
    let dbg = false
	if(scriptText==''){return []}
	let outOfRangeIdx = scriptText.length
	let idx1 = scriptText.indexOf("'");if(idx1==-1)idx1=outOfRangeIdx
	let idx2 = scriptText.indexOf("\"");if(idx2==-1)idx2=outOfRangeIdx
	let idx3 = scriptText.indexOf("//");if(idx3==-1)idx3=outOfRangeIdx
	let idx4 = scriptText.indexOf("/*");if(idx4==-1)idx4=outOfRangeIdx
	const idx5 = scriptText.indexOf("`");if(idx5==-1)idx5=outOfRangeIdx
let leastVal = Math.min(idx1,idx2,idx3,idx4,idx5)
	if(leastVal==outOfRangeIdx)
	{
		return [{type:'code',text:scriptText}]
	}
	if(leastVal != 0)
	{
		return [{type:'code',text:scriptText.substring(0,leastVal)}]
			.concat(scriptCommentAndNonCommentAreas(
				scriptText.substr(leastVal)))
	}
	let searchEndIdx,areaType
	if([idx1,idx2,idx5].includes(leastVal))
	{
		areaType = 'textInCode'
		let quoteChr = (leastVal==idx1)?"'":
                    ((leastVal==idx2)?'"':"`")
		searchEndIdx = idxOfClosingQuoteOfTextInCode(quoteChr,scriptText,leastVal)
	}
	else if(leastVal==idx3)
	{
		areaType = 'comment'
		searchEndIdx = scriptText.indexOf("\n",idx3)
		if(searchEndIdx==-1){searchEndIdx=scriptText.length-1}
	}
	else
	{
		assert(idx4 == leastVal)
		areaType = 'comment'
		searchEndIdx = scriptText.indexOf("*/",idx4) 
		assert(searchEndIdx>0)
		searchEndIdx++//because this is the only ending thing that has two chars
	}
	let areaText = scriptText.substring(leastVal,searchEndIdx+1)
	let retval = [{type:areaType, text:areaText}]
	dbg && console.log('Parsed area \''+ str(retval) +'\'...')
	let remainingText = ""
	if(searchEndIdx<scriptText.length-1)
	{
		remainingText = scriptText.substring(searchEndIdx+1)
	}
	let remainingAreas = scriptCommentAndNonCommentAreas(remainingText)
	return retval.concat(remainingAreas)
}

window.idxOfClosingQuoteOfTextInCode =
function (quoteChr,scriptText,idxOfOpeningQuote)
{
	assert(["'",'"',"`"].includes(quoteChr))
	let idx1= idxOfOpeningQuote
	let strToSearchIn = scriptText.substr(idx1+1)
	let strToSearchInParts = mysplit(strToSearchIn,'\\'+quoteChr)
	let searchEndIdx=idx1+1
	let closingQuotesFound = false
	strToSearchInParts.some
	(
		(part)=>
		{
			if(part.indexOf(quoteChr)!=-1)
			{
				searchEndIdx+=part.indexOf(quoteChr)	
				closingQuotesFound = true
				return true
			}
			searchEndIdx+=part.length+2
		}
	)
	assert(closingQuotesFound)
	assert(scriptText.substr(searchEndIdx,1)==quoteChr)
	return searchEndIdx
}

window.withCommentsRemoved = function withCommentsRemoved(s) {
	const arr = scriptCommentAndNonCommentAreas(s)
	let rv = ''
	for(const ele of arr) {
		if(ele.type!='comment'){rv+=ele.text}
	}
	return rv
}
