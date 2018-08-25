//object utils
import './stringUtil.js'
import './debugUtil.js'

window.deepClone = 
function(o)
{
	return JSON.parse(JSON.stringify(o))
}

///makes a 2d array 
window.make2DArray =
function(d1, d2)
{
    var arr = new Array(d1)
    for(let i = 0; i < d1; i++)
    {
        arr[i] = new Array(d2);
	}
    return arr;
}

window.concatMaps = 
function()
{
	let rv = {}
	Array.from(arguments).forEach
	(
	function(m2)
	{
		for(let k in m2)
		{
			checkThat
			(
			{
				condition:
				!(k in rv),
				errMsgFn:
				function()
				{
					return 'Error: concatMaps(): the maps to be concatenated both have common key \''+k+'\''
				}
			}
			)
			rv[k]=m2[k]
		}
	}
	)
	return rv
}

window.areMapsEqual =
function(m1,m2)
{
	if(Object.keys(m1).length!=Object.keys(m2).length){return false}
	for(let k in m1)
	{
		if(m2[k] != m1[k]){return false}
	}
	return true
}