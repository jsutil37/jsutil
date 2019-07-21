window.randomAlphaNumericChar = function() {
    let num = Math.round (Math.random() * 35)
    if(num >= 26) {
        num-= 26
        return num.toString()
    }
    return String.fromCharCode('a'.charCodeAt(0) + num)
}

window.randomAlphanumericString = function(len) {
    let rv = ''
    for(let i=0;i<len;i++) {
        rv += randomAlphaNumericChar()
    }
    return rv
}
