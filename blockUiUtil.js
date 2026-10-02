//wrapper around jquery's blockui plugin
let dbgload = window.dbgload;
dbgload && console.log("here");
import "./util.js";
dbgload && console.log("end here");

//import "https://cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.min.js";

var blockUiMsgs = [];

let overlay = null;
 
function ensureOverlay() {
  if (overlay) return;
   
  overlay = document.createElement("div");
  overlay.style.cssText = `
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.35);
  z-index: 999999;
  display: none;
  justify-content: center;
  align-items: center;
  white-space: pre-wrap;
  font-family: sans-serif;
  `;
   
  const msgDiv = document.createElement("div");
  msgDiv.id = "blockui-message";
  msgDiv.style.cssText = `
  background: white;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0,0,0,.3);
  max-width: 80vw;
  `;
   
  overlay.appendChild(msgDiv);
  document.body.appendChild(overlay);
}
 
function showOverlay(msg) {
  ensureOverlay();
  overlay.querySelector("#blockui-message").textContent = msg;
  overlay.style.display = "flex";
}
 
function hideOverlay() {
  if (overlay) {
    overlay.style.display = "none";
  }
}

function composeWaitMsg() {
  let s = "";
  let ctr = 0;
  blockUiMsgs.forEach((msg) => {
    if (msg == null) {
      msg = "Processing...";
    }
    ctr++;
    if (s == "") {
      s = msg;
    } else {
      s += "\n" + " ".repeat(ctr) + msg;
    }
  });
  return s;
}

function unblockUiIfCtrPermits() {
  blockUiMsgs.pop();
  //console.log('Now blockUiCtr='+blockUiCtr)
  if (blockUiMsgs.length == 0) {
    hideOverlay();//$.unblockUI();
  } else {
    showOverlay(composeWaitMsg())//$.blockUI({ message: composeWaitMsg() });
  }
}

window.disableBtnWhileRunning = function (args) {
  checkArgs(args, ["btn", "fn", "exceptionMsgPrefix"]);
  args.btn.disabled = true;
  let args2 = { fn: args.fn, exceptionMsgPrefix: args.exceptionMsgPrefix };
  showCaughtError(args2);
  args.btn.disabled = false;
};

window.blockAndUnblockUI = async function (fn, msg) {
  blockUiMsgs.push(msg);
  showOverlay(composeWaitMsg())//$.blockUI({ message: composeWaitMsg() });
  //console.log('Now blockUiCtr='+blockUiCtr)
  try {
    await fn();
  } catch (e) {
    blockUiMsgs.push("Error occurred!!! To try again, refresh the page...");
    showOverlay(composeWaitMsg())//$.blockUI({ message: composeWaitMsg() });
    throw e;
  }
  unblockUiIfCtrPermits();
};
export var blockAndUnblockUI = blockAndUnblockUI;
dbgload && console.log("reached end");
