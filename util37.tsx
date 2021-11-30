/*
This file acts as a bridge between non-typescript jsutil code and typescript
clients of jsutil

Original location of this file: https://github.com/jsutil37/jsutil/blob/master/util37.tsx

license: MIT

how to use:
In index.html of the single-page app you can add code similar to the following:
  <!--
    typescript does not yet support importing es6 modules by their cdn urls,
    see https://github.com/microsoft/TypeScript/issues/29854
  So use a combination of global window variable and typescript interface implementation
  using the global variable
  -->
  <script>
    window.dontUseTitleAsPageHeading = true
  </script>
  <script type="module">
    import * as jsutil37 from "https://jsutil37.github.io/jsutil/util.js"
    globalThis.util37 = jsutil37
  </script>
... then COPY this file into your SPA and import this file 
*/

import { HTTPMethod } from 'http-method-enum';

export {
  htmlEncode,
  el,
  sendJsonRequest,
  nxtId,
  setGlobVar,
  areFrmInpsValid,
  enableDisableChildInputCtrls,
  assert,
  getTextAtUrl
};

function util37() {
  //@ts-ignore
  return globalThis.util37;
}

function htmlEncode(s: string) {
  return util37().htmlEncode(s) as string;
}

function el(id: string) {
  return util37().el(id) as HTMLElement;
}

function nxtId() {
  return util37().nxtId() as number;
}

async function sendJsonRequest(
  method: HTTPMethod,
  objForBody: any,
  commonPartOfApiUrl: string,
  uniquePartOfApiUrl: string
) {
  /**
     *        checkParams(params, ['method', 'objForBody','commonPartOfApiUrl',
                'uniquePartOfApiUrl'])
     */
  const params = {
    method,
    objForBody,
    commonPartOfApiUrl,
    uniquePartOfApiUrl,
  };
  return await util37().sendJsonRequest(params);
}

function setGlobVar(name: string, val: any) {
  (window as { [key: string]: any })[name] = val;
}
/*
function bindAllFns(thisObj: any, fnList: string[]) {
    return util37().bindAllFns(thisObj, fnList)
}*/

function areFrmInpsValid(frmSubmitBtn: HTMLButtonElement): boolean {
  return util37().areFrmInpsValid(frmSubmitBtn);
}

function enableDisableChildInputCtrls(
  ctnrEl: HTMLFormElement,
  enableOrDisable: boolean
): void {
  util37().enableDisableChildInputCtrls(ctnrEl, enableOrDisable);
}

/**
 * a more intelligent version of assert() that should be more helpful for
 * debugging
 */
function assert(condition: boolean): void {
  util37().assert(condition);
}

async function getTextAtUrl(url: string): string {
  return await util37().getTextAtUrl(url);
}
