export {
  randLightColor,
  areFrmInpsValid,
  enableDisableChildInputCtrls,
  p,
  configP,
  logDivHtml,
  appendLogDiv,
  createOrUpdateDiv,
  createOrUpdateSpan,
  persist,
};

import {
  randEl,
  nxtId,
  isArray,
  el,
  appendHtml,
  leftOf,
  rightOf,
  htmlEncode,
  htmlToElement,
} from "./util.js";

function randLightColor() {
  let letters = "BCDEF".split(""),
    color = "#";
  for (let i = 0; i < 6; i++) {
    color += randEl(letters);
  }
  return color;
}

$(initCollapsibleDivs);

export function initCollapsibleDivs() {
  const collapsibleDivs = document.querySelectorAll("[data-title]");
  //alert('test.length='+test.length)
  for (const collapsibleDiv of collapsibleDivs) {
    initCollapsibleDiv(collapsibleDiv);
    collapsibleDiv.removeAttribute("data-title");
  }
}

/**
 * @param {Element} collapsibleDiv
 */
function initCollapsibleDiv(collapsibleDiv) {
  let id = collapsibleDiv.id;
  if (id == null || id == "") {
    id = collapsibleDiv.id = "id" + nxtId();
  }
  const outerDiv = htmlToElement(/*html*/ `
<div style="border:1px solid black; padding:5px"><button 
id="${id}btn" class="btn btn-primary" data-toggle="collapse" data-target="#${id}"
>${htmlEncode("▶ " + collapsibleDiv.dataset.title)}</button>
</div>
      `);
  const parent = collapsibleDiv.parentElement;
  parent.insertBefore(outerDiv, collapsibleDiv);
  collapsibleDiv.remove();
  outerDiv.appendChild(collapsibleDiv);
  const btn = el(id + "btn");
  collapsibleDiv.classList.add("collapse");
  btn.addEventListener("click", () => {
    if (btn.innerText.trim().startsWith("▶ ")) {
      btn.innerText = "⯆ " + withoutFirstChar(btn.innerText).trim();
    } else {
      btn.innerText = "▶ " + withoutFirstChar(btn.innerText).trim();
    }
  });
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
  const form = frmSubmitBtn.form;
  if (!form.reportValidity()) {
    return false;
  }
  enableDisableChildInputCtrls(form, false);
  return true;
}

/**
 * @param {HTMLButtonElement} submitButton
 * @param {(arg0: any) => void} clickHandlerFn
 */
export async function submitForm(
  submitButton, //: HTMLButtonElement,
  clickHandlerFn //: (submitButton: HTMLButtonElement) => void
) {
  //: Promise<void> {
  if (areFrmInpsValid(submitButton)) {
    try {
      clickHandlerFn(submitButton);
    } finally {
      enableDisableChildInputCtrls(
        submitButton.form /*as HTMLFormElement*/,
        true
      );
    }
  }
}

/**
 * @param {HTMLFormElement} ctnrEl
 * @param {boolean} enableOrDisable
 */
function enableDisableChildInputCtrls(ctnrEl, enableOrDisable) {
  //The :input selector basically selects all form controls
  $(ctnrEl).find(":input").prop("disabled", !enableOrDisable);
}

// https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
export const openInPopupWindow = (
  /** @type {string | URL | undefined} */ url,
  /** @type {string | undefined} */ title,
  /** @type {number} */ w,
  /** @type {number} */ h
) => {
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

/**
 * @param {string} obj
 */
export function objToCollapsibleDivs(obj) {
  if (typeof obj == null) {
    return "(null)";
  }
  if (isArray(obj)) {
    let s = "<ul>\n";
    for (const ele of obj) {
      s += "<li>\n" + objToCollapsibleDivs(ele) + "\n</li>\n";
    }
    return s + "</ul>";
  }
  if (typeof obj == "object") {
    let s = "";
    for (const key in obj) {
      s +=
        '<div data-title="' +
        htmlEncode(key) +
        '">\n' +
        objToCollapsibleDivs(obj[key]) +
        "\n</div>";
    }
    return s;
  }
  return (
    '<span style="white-space: pre-wrap;">' + htmlEncode("" + obj) + "</span>"
  );
}

/**
 * @param {any[]} args
 */
function p(...args) {
  let prefix = new Date() + ": ";
  let s = prefix + args.map((arg) => arg.toString()).join(" ");
  if (loggingDiv == null) {
    prefix = "(no loggingDiv yet) " + prefix;
  } else {
    try {
      loggingDiv.innerText += s + "\n";
    } catch (e) {
      if (loggingDiv.innerText != null) {
        throw e;
      }
      loggingDiv.innerText = s + "\n";
    }
  }
  console.log(prefix, ...args);
}

/**
 * @param {string | null|undefined} loggingDivId
 */
function configP(loggingDivId) {
  if (loggingDivId == null) {
    loggingDivId = "logDiv";
  }
  loggingDiv = el(loggingDivId);
}

/**
 * @type {HTMLElement}
 */
let loggingDiv;

/**
 * @param {string | null|undefined} id
 */
function logDivHtml(id) {
  if (id == null) {
    id = "logDiv";
  }
  // @ts-ignore
  const currentScript = import.meta.url;
  const jsFileLocation = currentScript.replace("uiUtil.js", ""); // the js folder path
  return /*html*/ `
  <div style="background:silver;display:flex;justify-content:flex-end;padding:3px">
    <div>
      <img width="25px"
        src="${jsFileLocation}/ui/icons/copy-to-clipboard.svg"
        alt="Copy"
        style="color:black;"
        onclick="doCopyFrom('${id.replaceAll("'", "\\'")}')"
      />
    </div>
  </div>
  <div id="${id}" style="background: gainsboro" class="collapsibleDiv"></div>`;
}

/**
 * @param {any} id
 */
function doCopyFrom(id) {

  const copyText = el(id).innerText;

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText);

  // Alert the copied text
  growl("Copied the text to clipboard");
}

//Otherwise the event handler for copy icon click won't be able to see this fn
window.doCopyFrom = doCopyFrom;

/**
 * @param {undefined|null|string} [id]
 */
function appendLogDiv(id) {
  appendHtml(logDivHtml(id));
  configP(id);
}

/**
 * @param {string} id
 * @param {string} initialHtml
 * @param {{ (ele: HTMLElement): void; }} updateFn
 */
export function createOrUpdateEl(id, initialHtml, updateFn) {
  let ele = document.getElementById(id);
  if (ele != null) {
    updateFn(ele);
    return;
  }
  initialHtml =
    leftOf(initialHtml, " ") + ' id="' + id + '" ' + rightOf(initialHtml, " ");
  appendHtml(initialHtml);
  const tryUpdate = () => {
    ele = document.getElementById(id);
    if (ele == null) {
      setTimeout(tryUpdate, 100);
      return;
    }
    updateFn(ele);
  };
  tryUpdate();
}

/**
 * @param {string} divId
 * @param {any} divText
 */
function createOrUpdateDiv(divId, divText) {
  return createOrUpdateEl(
    divId,
    /*html*/ `<div class="collapsibleDiv"></div>`,
    (div) => {
      div.innerText = divId + ":\n" + divText;
    }
  );
  /*
  let div = document.getElementById(divId);
  if (div == null) {
    appendHtml(/*html* / `<div id=${divId} class="collapsibleDiv"></div>`);
    div = el(divId);
  }
  div.innerText = divId + ":\n" + divText;
  */
}

/**
 * @param {string } spanId
 * @param {string | number | undefined} spanText
 */
function createOrUpdateSpan(spanId, spanText) {
  let span = document.getElementById(spanId);
  if (span == null) {
    //w/o inline-block, padding overlaps with div on previous row etc. see https://stackoverflow.com/a/6078087/15814452
    appendHtml(
      /*html*/ `<span id=${spanId} style="display:inline-block;padding:5px;background:${randLightColor()}"></span>`
    );
    span = el(spanId);
  }
  span.innerText = spanId + ": " + spanText;
}

/**
 * @param {string} textBoxOrTextAreaId
 */
function persist(textBoxOrTextAreaId) {
  const textBoxOrArea = el(textBoxOrTextAreaId);
  textBoxOrArea.value = localStorage.getItem(textBoxOrTextAreaId) ?? "";
  textBoxOrArea.addEventListener("keyup", function (e) {
    localStorage.setItem(textBoxOrTextAreaId, textBoxOrArea.value);
    /*--console.log(
      `Saving ${textBoxOrTextAreaId}, value=${textBoxOrArea.value}`
    );*/
  });
}
