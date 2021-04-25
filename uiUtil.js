export {randLightColor, areFrmInpsValid, enableDisableChildInputCtrls}

import {randEl,nxtId} from './util.js'

function randLightColor() {
	let letters = 'BCDEF'.split(''), color = '#'
	for (let i = 0; i < 6; i++) { color += randEl(letters) }
	return color
}

$(initCollapsibleDivs)

function initCollapsibleDivs() {
   const collapsibleDivs = document.querySelectorAll('[data-title]')
    //alert('test.length='+test.length)
    for(const collapsibleDiv of collapsibleDivs) {
      initCollapsibleDiv(collapsibleDiv)
    }
}

    function initCollapsibleDiv(collapsibleDiv) {
      let id = collapsibleDiv.id
      if(id==null || id==''){id = collapsibleDiv.id = 'id'+nxtId()}
      const outerDiv = htmlToElement(/*html*/`
<div style="border:1px solid black; padding:5px"><button 
id="${id}btn" class="btn btn-primary" data-toggle="collapse" data-target="#${id}"
>${htmlEncode('▶ '+collapsibleDiv.dataset.title)}</button>
</div>
      `)
      const parent = collapsibleDiv.parentElement
      parent.insertBefore(outerDiv, collapsibleDiv)
      collapsibleDiv.remove()
      outerDiv.appendChild(collapsibleDiv)
      const btn = el(id+'btn')
      collapsibleDiv.classList.add('collapse')
      btn.addEventListener('click',()=>{
        if(btn.innerText.trim().startsWith('▶ ')) {
          btn.innerText='⯆ ' + withoutFirstChar(btn.innerText).trim()
        } else {
          btn.innerText='▶ ' + withoutFirstChar(btn.innerText).trim()
        }
      })
    }

/**
 * validates the form's input controls using the built-in html validation
 * function of the special input controls such as email etc. and returns
 * true/false accordingly. IF valid, also disables the form's input controls
 * (they can be re-enabled once the server response is received)
 * @param {HTMLButtonElement} frmSubmitBtn
 */
function areFrmInpsValid(frmSubmitBtn) {
	const form = frmSubmitBtn.form
	if ((!form.reportValidity())) { return false }
	enableDisableChildInputCtrls(form, false)
	return true
}

/**
 * @param {HTMLFormElement} ctnrEl
 * @param {boolean} enableOrDisable
 */
function enableDisableChildInputCtrls(ctnrEl, enableOrDisable) {
	//The :input selector basically selects all form controls
	$(ctnrEl).find(":input").prop("disabled", (!enableOrDisable))
}
