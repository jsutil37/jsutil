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


// reference: https://stackoverflow.com/questions/7018337/find-closest-previous-element-jquery

export function closestPrevious(selector) {
        selector = selector.replace(/^\s+|\s+$/g, "");
        var combinator = selector.search(/[ +~>]|$/);
        var parent = selector.substr(0, combinator);
        var children = selector.substr(combinator);
        var el = this;
        var match = $();
        while (el.length && !match.length) {
            el = el.prev();
            if (!el.length) {
                var par = el.parent();
                // Don't use the parent - you've already checked all of the previous 
                // elements in this parent, move to its previous sibling, if any.
                while (par.length && !par.prev().length) {
                    par = par.parent();
                }
                el = par.prev();
                if (!el.length) {
                    break;
                }
            }
            if (el.is(parent) && el.find(children).length) {
                match = el.find(children).last();
            }
            else if (el.find(selector).length) {
                match = el.find(selector).last();
            }
        }
        return match;
    }

export const closestPrior = closestPrevious;

(function($) {
    $.fn.closestPrior = closestPrior
})(jQuery);
