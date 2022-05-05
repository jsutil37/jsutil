export { ifFn, loopFn }
/**
 reduces code complexity of loops! Do not pass anon fns as params!

@param {any} s 		the thread state
@param {initNxtStepFn} if provided, then is executed in an optimized way such that whileCondFn is checked before the first call to stepFn
and is also checked before each call to initNxtStepFn
*/
function loopFn(s, whileCondFn, stepFn, initNxtStepFn) {
    if (initNxtStepFn == null) {
        while (whileCondFn(s)) { stepFn(s) }
        return
    }
    if (!whileCondFn(s)) { return }
    stepFn(s)
    while (whileCondFn(s)) {
        initNxtStepFn(s)
        stepFn(s)
    }
}

/**
@param {any} s 		the thread state
*/
export function loopFnWithProgress(s, whileCondFn, stepFn, progressUpdateIntervalInSeconds, progressUpdaterFn) {
 let time = Date.now()
 while(whileCondFn(s)) {
   stepFn(d)
  if(((Date.now()-time)/1000)>=progressUpdateIntervalInSeconds) {
   time = Date.now()
   progressUpdaterFn()
  }
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
