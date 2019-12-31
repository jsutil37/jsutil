const debugencdec = false;

"use strict"

let a=alert

waitForSymbolsAndThenRun(replaceAesEncryptAndAesDecryptWithAWrapper,['aesGcmEncrypt','aesGcmDecrypt'],200,10000)

function replaceAesEncryptAndAesDecryptWithAWrapper() {
	var aesGcmEncrypt_orig = aesGcmEncrypt
	var aesGcmDecrypt_orig = aesGcmDecrypt
  window.aesGcmEncrypt = async function(plaintext, password) {
    //a('In aesGcmEncrypt (wrapper)')
    if (debugencdec) {
      alert("plaintext='" + plaintext + "'");
      alert("password='" + password + "'");
    }

    var rv = await aesGcmEncrypt_orig(plaintext, password)
    if (debugencdec) {
      alert("encryption result='" + rv + "'");
    }
    return rv;
  }

  window.aesGcmDecrypt = async function (ciphertext, password) {
    if (debugencdec) {
      alert("ciphertext='" + ciphertext + "'");
      alert("password='" + password + "'");
    }

    var rv = await aesGcmDecrypt_orig(ciphertext, password)

    if (debugencdec) {
      alert("decrypted text='" + rv + "'");
    }

    return rv;
  }
}
