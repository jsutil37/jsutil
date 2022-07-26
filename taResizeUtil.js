//text area resizing for browsers that don't provide the gripper

///add a 'resize gripper' feature for textareas, even for horrible browsers such as IE edge etc.
///This is thanks to jquery UI. Some supporting logic to make this compatible with bootstrap tabs
///(in general, compatible with textareas that are initially hidden) is there in util.css
///Better still, do intelligent auto-resizing.

export { autoAdjustTaHeight };
window.dbgload && console.log("loading taResizeUtil.js");

onDocumentReady(function () {
  //---console.log("here: taResizeUtil: onDocumentReady");
  setTimeout(makeTextareasResizable, 200);
});

// prefer to autoresize

function makeTextareasResizable() {
  if (
    window.shouldMakeTextAreasResizeable != null &&
    !window.shouldMakeTextAreasResizeable
  ) {
    //a('not making textareas resizable for now');
    return;
  }
  blockAndUnblockUI(function () {
    $("textarea")
      .toArray()
      .forEach(function (ta) {
        //---makeTextareaResizable(ta)
        //---console.log("Making auto-adjustable ta...");
        autoAdjustTaHeight(ta);
      });
  });
}

function makeTextareaResizable(ta) {
  //console.log('temp disabled');return
  let nodesMadeVisible = [];
  if (true) {
    //ta.id == 'signin-ta')
    if (!$(ta).is(":visible")) {
      //a('The textarea is not visible')
      makeallancestorsvisible(ta, nodesMadeVisible);
    }
    /*
		alert('ta.style.display=\''+ta.style.display+'\'')
		alert('ta.offsetWidth=\''+ta.offsetWidth+'\'')
		alert('ta.offsetHeight=\''+ta.offsetHeight+'\'')
		*/
  }
  $(ta).resizable({ handles: "se" });
  //ta.parentNode.style.width = ta.style.width
  //ta.parentNode.style.width = ta.style.width
  nodesMadeVisible.forEach(function (ele) {
    ele.style.display = "";
  });
}

const autoAdjustTaHeight = (ta) => {
  const dbg = false;
  let originalHeight = ta.getBoundingClientRect().height;
  if (dbg) console.log("ENTRY: originalHeight=", originalHeight);
  let programmaticResizeCtr = 0;
  let selectionStart = -1;
  let selectionEnd = -1;
  new ResizeObserver(() => {
    if (programmaticResizeCtr > 0) {
      programmaticResizeCtr--;
      return;
    }
    originalHeight = ta.getBoundingClientRect().height;
    if (dbg) console.log("ResizeObserver: Now originalHeight=", originalHeight);
  }).observe(ta);
  const adjustHeight = () => {
    if (dbg) console.log("adjusting ta height...");
    programmaticResizeCtr++;
    if (document.activeElement === ta) {
      ta.style.height = "1px";
      const certainlyHideScrollbarHeight = ta.scrollHeight + 17;
      ta.style.height = certainlyHideScrollbarHeight + "px";
      ta.style.resize = "none";
    } else {
      // There is some shrink for unclear reasons, so add 17:
      ta.style.height = Math.ceil(originalHeight /*+ 17*/) + "px";
      ta.style.resize = "vertical";
      if (dbg) console.log("now height=", ta.offsetHeight);
    }
  };
  ta.addEventListener("input", adjustHeight);
  let isProgrammaticBlurOrFocus = false;
  ta.addEventListener("focus", () => {
    if (isProgrammaticBlurOrFocus) {
      return;
    }
    adjustHeight();
    const scrollToCursor = () => {
      isProgrammaticBlurOrFocus = true;
      ta.blur();
      ta.focus();
      isProgrammaticBlurOrFocus = false;
    };
    if (selectionStart !== -1) {
      if (dbg) console.log("focus: selectionStart=" + selectionStart);
      setTimeout(() => {
        ta.selectionStart = selectionStart;
        scrollToCursor();
      }, 100);
    }
    if (selectionEnd !== -1) {
      setTimeout(() => {
        ta.selectionEnd = selectionEnd;
        scrollToCursor();
      }, 100);
    }
  });
  ta.addEventListener("blur", () => {
    if (isProgrammaticBlurOrFocus) {
      return;
    }
    selectionStart = ta.selectionStart;
    selectionEnd = ta.selectionEnd;
    if (dbg) console.log("blur: selectionStart=" + selectionStart);
    adjustHeight();
  });
  setTimeout(adjustHeight, 100);
};
