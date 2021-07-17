export { ifFn, loopFn }
/**
 reduces code complexity of loops! Do not pass anon fns as params!

@param {any} s 		the thread state
*/
function loopFn(s, whileFn, stepFn, initNxtStepFn) {
    if (initNxtStepFn == null) {
        while (whileFn(s)) { stepFn(s) }
        return
    }
    if (!whileFn(s)) { return }
    stepFn(s)
    while (whileFn(s)) {
        initNxtStepFn(s)
        stepFn(s)
    }
}

/**
reduces code complexity of IF statements, do not pass anon fns as params!

@param s 	the thread state
*/
function ifFn(s, condFn, thenFn, elseFn) {
    if (condFn(s)) {
        thenFn(s)
    } else if (elseFn != null) {
        elseFn(s)
    }
}