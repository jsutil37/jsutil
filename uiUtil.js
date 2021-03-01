export {randLightColor}

import {randEl} from './util.js'

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
      const id = collapsibleDiv.id
      assert(id!=null)
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
