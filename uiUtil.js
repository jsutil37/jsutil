export {randLightColor, areFrmInpsValid, enableDisableChildInputCtrls}

import {randEl,nxtId,isArray} from './util.js'

function randLightColor() {
	let letters = 'BCDEF'.split(''), color = '#'
	for (let i = 0; i < 6; i++) { color += randEl(letters) }
	return color
}

$(initCollapsibleDivs)

export function initCollapsibleDivs() {
   const collapsibleDivs = document.querySelectorAll('[data-title]')
    //alert('test.length='+test.length)
    for(const collapsibleDiv of collapsibleDivs) {	    
      initCollapsibleDiv(collapsibleDiv)
	    collapsibleDiv.removeAttribute("data-title");
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
 *
 * TODO: deprecate this and make it private. Use submitForm() instead!
 */
function areFrmInpsValid(frmSubmitBtn) {
	const form = frmSubmitBtn.form
	if ((!form.reportValidity())) { return false }
	enableDisableChildInputCtrls(form, false)
	return true
}

export async function submitForm(
  submitButton,//: HTMLButtonElement,
  clickHandlerFn,//: (submitButton: HTMLButtonElement) => void
){//: Promise<void> {
  if (areFrmInpsValid(submitButton)) {
    try {
      clickHandlerFn(submitButton);
    } finally {
      enableDisableChildInputCtrls(submitButton.form /*as HTMLFormElement*/, true);
    }
  }
}

/**
 * @param {HTMLFormElement} ctnrEl
 * @param {boolean} enableOrDisable
 */
function enableDisableChildInputCtrls(ctnrEl, enableOrDisable) {
	//The :input selector basically selects all form controls
	$(ctnrEl).find(":input").prop("disabled", (!enableOrDisable))
}

// https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
  export const openInPopupWindow = (url, title, w, h) => {
    assert(w >= 0);
    assert(h >= 0);
    // Fixes dual-screen position                             Most browsers      Firefox
    const dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width;
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height;

    const systemZoom = width / window.screen.availWidth;
    assert(!isNaN(systemZoom));
    assert(systemZoom > 0);
    assert(!isNaN(dualScreenLeft));
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    assert(!isNaN(left));
    const top = (height - h) / 2 / systemZoom + dualScreenTop;
    const windowOpenOptions = `
        scrollbars=yes,
        width=${w / systemZoom},
        height=${h / systemZoom},
        top=${top},
        left=${left}
        `;
    //alert("windowOpenOptions=" + windowOpenOptions);
    const newWindow = window.open(url, title, windowOpenOptions);
    if (window.focus) newWindow.focus();
  };

export function objToCollapsibleDivs(obj) {
	if(typeof obj == null) {
		return "(null)";
	}
	if(isArray(obj)) {
		let s="<ul>\n";
		for(const ele of obj) {
			s+="<li>\n"+objToCollapsibleDivs(ele)+"\n</li>\n";
		}
		return s+"</ul>";
	}
	if(typeof obj == "object") {
		let s="";
		for(const key in obj) {
			s+= "<div data-title=\""+htmlEncode(key)+"\">\n" + objToCollapsibleDivs(obj[key]) + "\n</div>"
		}
		return s;
	}
	return "<span style=\"white-space: pre-wrap;\">"+htmlEncode(""+obj)+"</span>";
}


