import * as u from '../../util.js'

let pageConfigs = {}
let prevPageNames = []
let page = null
let loadedPages = {}

function onRadioButtonClickChooseNextPage() {
	console.log('onRadioButtonClickChooseNextPage() called...')
	page.nextPageName = this.value;
	console.log('Setting page.nextPageName to \''+page.nextPageName+
		'\', page id=\''+page.id+'\'...')
	$('#nextButton').prop('disabled', false);
}

function onRadioButtonsClickChooseNextPage(radioButtonGroupName) {
	$('input[type=radio][name=\'' + radioButtonGroupName + '\']').click(onRadioButtonClickChooseNextPage);
}

function choicePageHtml(args) {
	checkParams(args,['pageId','pageHeading','choices'])
	let s ='';
	args.choices.forEach((choice)=>{
		s+=/*html*/`
		<input type="radio" name="${args.pageId}" value="${htmlEncode(choice.value)}"> 
		${htmlEncode(choice.name)} - ${htmlEncode(choice.longText)}<br>		
		`
	})
	return /*html*/`
	<div id="${args.pageId}" class="page">
	<b>${args.pageHeading}</b><br>
	Select one of the choices below:<br>
	${s}
	</div>
	`
}

pageConfigs['page1'] = {
	html:choicePageHtml({pageId:'page1',pageHeading:'Page 1',
	choices:[
		{value:'page2', name:'Choice1', longText:'some long text1'},
		{value:'page3', name:'Choice2', longText:'some long text2'},
		{value:'page4', name:'Choice3', longText:'some long text3'}
	]
}),
	initFn: () => {
		onRadioButtonsClickChooseNextPage('page1')
	}
}

pageConfigs['page2'] = {
	html:/*html*/`
<div id="page2" class="page">
<b>Page 2</b><br>
Select one of the choices below:<br>
<input type="radio" name="group2" value="page5"> Choice1 - some long text1<br>
<input type="radio" name="group2" value="page6"> Choice2 - some long text2<br>
<input type="radio" name="group2" value="page7"> Choice3 - some long text3<br>
</div>
`,
	initFn: () => {
		onRadioButtonsClickChooseNextPage('group2')
	}
}


const btnHtml =/*html*/`
<table style="width:100%">
<tr>
<td align="center" style="width:50%">
<button disabled id="backButton" type="button" onclick="onBackButtonClick()">Back</button>
</td>
<td align="center">
<button disabled id="nextButton" type="button" onclick="onNextButtonClick()">Next</button>
</td>
</tr>
</table>
`

window.onNextButtonClick = () => {
	showPage(page.nextPageName)
}

window.onBackButtonClick = () => {
	console.log('prevPageNames='+str(prevPageNames))
	el(page.name).style.display = 'none'
	page = null
	showPage(prevPageNames.pop())
	console.log('prevPageNames='+str(prevPageNames))
}

export function showPage(pageName) {
	showPage_dontWorryAboutButtonState(pageName)
	console.log('showPage():page.nextPageName=\''+page.nextPageName+'\'')
	$('#nextButton').prop('disabled', typeof(page.nextPageName) == 'undefined' || page.nextPageName == null);
	$('#backButton').prop('disabled', prevPageNames.length == 0);
}

function showPage_dontWorryAboutButtonState(pgName) {
	if (page != null) {
		prevPageNames.push(page.name)
		page.style.display = 'none'
	}
	if (pgName in loadedPages) {
		page = el(pgName)
		page.style.display = 'block'
		return
	}
	let pageConfig = pageConfigs[pgName]
	console.log('pgName=\''+pgName+'\'')
	let pageHtml = pageConfig.html
	console.log('Found pageHtml for pgName \'' + pgName + '\'?:' + (pageHtml != null))
	el('mainDiv').insertAdjacentHTML('beforeend', pageHtml)
	let pageInitFn = pageConfig.initFn
	console.log('Found pageInitFn for pgName \'' + pgName + '\'?:' + (pageInitFn != null))
	if (pageInitFn) {
		pageInitFn()
	}
	page = el(pgName)
	page.name = pgName
	loadedPages[pgName] = page
}

export function showPageNavButtons() {
	el('pageNavButtonsDiv').innerHTML = btnHtml
}