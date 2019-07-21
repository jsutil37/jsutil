import * as u from '../../util.js'
/*
To see the output, go to https://jsutil37.github.io/usutil/test/jsAsTheBase/h.html

design points:
each control on own row
TODO: write out:
<style>
* {
	width: 100%; 
  }
</style>

...in a reusable way
*/
let pageConfigs = {}
let idsOfPreviousPages = []
let page = null
let loadedPages = {}

function onRadioButtonClickChooseNextPage() {
	console.log('onRadioButtonClickChooseNextPage() called...')
	page.idOfNextPage = this.value;
	console.log('Setting page.idOfNextPage to \''+page.idOfNextPage+
		'\', page id=\''+page.id+'\'...')
	$('#nextButton').prop('disabled', false);
}

function onRadioButtonsClickChooseNextPage(radioButtonGroupName) {
	$('input[type=radio][name=\'' + radioButtonGroupName + '\']').click(onRadioButtonClickChooseNextPage);
}

function choicePageHtml(args) {
	checkParams(args,['pageId','choices'])
	let s ='';
	args.choices.forEach((choice)=>{
		s+=/*html*/`
		<input type="radio" name="${args.pageId}" value="${htmlEncode(choice.value)}"> 
		${htmlEncode(choice.name)} - ${htmlEncode(choice.longText)}<br>		
		`
	})
	return /*html*/`
	Select one of the choices below:<br>
	${s}
	`
}

pageConfigs['page1'] = {
	pageHeading: 'Page 1',
	html:choicePageHtml({pageId:'page1',
	choices:[
		{value:'page2', name:'Choice2', longText:'some long text2'},
		{value:'page3', name:'Choice3', longText:'some long text3'},
		{value:'page4', name:'Choice4', longText:'some long text4'}
	]
}),
	initFn: () => {
		onRadioButtonsClickChooseNextPage('page1')
	}
}

pageConfigs['page2'] = {
	pageHeading: 'Page 2',
	html:choicePageHtml({pageId:'page2',
	choices:[
		{value:'page5', name:'Choice5', longText:'some long text5'},
		{value:'page6', name:'Choice6', longText:'some long text6'},
		{value:'page7', name:'Choice7', longText:'some long text7'}
	]
}),
	initFn: () => {
		onRadioButtonsClickChooseNextPage('page2')
	}
}

pageConfigs['page3'] = {
	pageHeading: 'Page 3',
	html:/*html*/`
	<textarea style="width:100%"></textarea>
	`,
	initFn: () => {}
}

const btnHtml =/*html*/`
<button disabled id="backButton" type="button" onclick="onBackButtonClick()">Back</button>
<br><br>
<button disabled id="nextButton" type="button" onclick="onNextButtonClick()">Next</button>
`

window.onNextButtonClick = () => {
	showPage(page.idOfNextPage)
}

window.onBackButtonClick = () => {
	console.log('idsOfPreviousPages='+str(idsOfPreviousPages))
	page.style.display = 'none'
	page = null
	showPage(idsOfPreviousPages.pop())
	console.log('idsOfPreviousPages='+str(idsOfPreviousPages))
}

export function showPage(pageId) {
	showPage_dontWorryAboutButtonState(pageId)
	console.log('showPage():page.idOfNextPage=\''+page.idOfNextPage+'\'')
	$('#nextButton').prop('disabled', typeof(page.idOfNextPage) == 'undefined' || page.idOfNextPage == null);
	$('#backButton').prop('disabled', idsOfPreviousPages.length == 0);
}

function showPage_dontWorryAboutButtonState(pageId) {
	if (page != null) {
		idsOfPreviousPages.push(page.id)
		page.style.display = 'none'
	}
	if (pageId in loadedPages) {
		page = el(pageId)
		page.style.display = 'block'
		return
	}
	let pageConfig = pageConfigs[pageId]
	console.log('pageId=\''+pageId+'\'')
	let pageHtml = pageConfig.html
	console.log('Found pageHtml for pageId \'' + pageId + '\'?:' + (pageHtml != null))
	pageHtml=/*html*/`
	<div id="${pageId}" class="page">
	<b>${pageConfig.pageHeading}</b><br>
	${pageHtml}
	</div>
	`
	el('mainDiv').insertAdjacentHTML('beforeend', pageHtml)
	let pageInitFn = pageConfig.initFn
	console.log('Found pageInitFn for pageId \'' + pageId + '\'?:' + (pageInitFn != null))
	if (pageInitFn) {
		pageInitFn()
	}
	page = el(pageId)
	page.id = pageId
	loadedPages[pageId] = page
}

export function showPageNavButtons() {
	el('pageNavButtonsDiv').innerHTML = btnHtml
}
