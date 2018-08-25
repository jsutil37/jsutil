//text area resizing for browsers that don't provide the gripper

///add a 'resize gripper' feature for textareas, even for horrible browsers such as IE edge etc.
///This is thanks to jquery UI. Some supporting logic to make this compatible with bootstrap tabs
///(in general, compatible with textareas that are initially hidden) is there in util.css
import './util.js'

onDocumentReady
(
	function()
	{
		setTimeout(makeTextareasResizable,2000)
	}
)

function makeTextareasResizable()
{
	//a('not making textareas resizable for now');	return
	blockAndUnblockUI
	(
	function()
	{$("textarea").toArray().forEach(function(ta){makeTextareaResizable(ta)})}
	)		
}

function makeTextareaResizable(ta)
{
	let nodesMadeVisible = []
	if(true)//ta.id == 'signin-ta')
	{
		if(!$(ta).is(':visible'))
		{
			//a('The textarea is not visible')
			makeallancestorsvisible(ta,nodesMadeVisible)
		}
		/*
		alert('ta.style.display=\''+ta.style.display+'\'')
		alert('ta.offsetWidth=\''+ta.offsetWidth+'\'')
		alert('ta.offsetHeight=\''+ta.offsetHeight+'\'')
		*/
	}
	$(ta).resizable({handles: "se"})
	//ta.parentNode.style.width = ta.style.width
	//ta.parentNode.style.width = ta.style.width
	nodesMadeVisible.forEach
	(
		function(ele){ele.style.display=''}
	)
}