import './util.js'

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
	let leastVal = Math.min(idx1,idx2,idx3,idx4)
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
	if(leastVal==idx1 || leastVal == idx2)
	{
		areaType = 'textInCode'
		let quoteChr = (leastVal==idx1)?"'":'"'
		searchEndIdx = idxOfClosingQuoteOfTextInCode(quoteChr,scriptText,leastVal)
	}
	else if(leastVal==idx3)
	{
		areaType = 'comment'
		searchEndIdx = scriptText.indexOf("\n",idx3)
		if(searchEndIdx==-1){searchEndIdx=scriptText.length}
	}
	else
	{
		assert(idx4 == leastVal)
		areaType = 'comment'
		searchEndIdx = scriptText.indexOf("*/",idx4)
		assert(searchEndIdx!=-1)
	}
	let areaText = scriptText.substring(leastVal,searchEndIdx+1)
	let retval = [{type:areaType, text:areaText}]
	dbg && console.log('Parsed area \''+ str(retval) +'\'...')
	let remainingText = scriptText.substring(searchEndIdx+1)
	let remainingAreas = scriptCommentAndNonCommentAreas(remainingText)
	return retval.concat(remainingAreas)
}

window.idxOfClosingQuoteOfTextInCode =
function (quoteChr,scriptText,idxOfOpeningQuote)
{
	assert(quoteChr=='\''||quoteChr=='"')
	let idx1= idxOfOpeningQuote
	let searchEndIdx = scriptText.indexOf('\n',idx1+1)
	if(searchEndIdx==-1){searchEndIdx=scriptText.length}
	let strToSearchIn = scriptText.substring(idx1+1,searchEndIdx)
	let strToSearchInParts = mysplit(strToSearchIn,'\\'+quoteChr)
	searchEndIdx=idx1+1
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