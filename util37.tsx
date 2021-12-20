/* eslint-disable @typescript-eslint/ban-ts-comment */
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
  So import the es6 module in the index.html as follows:
  -->
  <script>
    window.dontUseTitleAsPageHeading = true
  </script>
  <script type="module">
    import * as jsutil37 from "https://jsutil37.github.io/jsutil/util.js"
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
  getTextAtUrl,
  awaitUtil37Import,
};
//reference: https://stackoverflow.com/questions/64195920/typescript-error-accessing-globalthis-property
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-var
  var jsutil37_jsutil: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function util37(): any {
  //@ts-ignore
  if (globalThis.jsutil37_jsutil == null) {
    const errMsg = 'fatal error: globalThis.jsutil37_jsutil is null!!!';
    alert(errMsg);
    throw new Error(errMsg);
  }
  return globalThis.jsutil37_jsutil;
}

const sleep = (milliseconds: number) =>
  new Promise((r) => setTimeout(r, milliseconds));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function awaitUtil37Import(): Promise<any> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (globalThis.jsutil37_jsutil != null) {
      return globalThis.jsutil37_jsutil;
    }
    await sleep(400);
  }
}

function htmlEncode(s: string): string {
  return util37().htmlEncode(s) as string;
}

function el(id: string): HTMLElement {
  return util37().el(id) as HTMLElement;
}

function nxtId(): number {
  return util37().nxtId() as number;
}

async function sendJsonRequest(
  method: HTTPMethod,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  objForBody: any,
  commonPartOfApiUrl: string,
  uniquePartOfApiUrl: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
function setGlobVar(name: string, val: any): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

async function getTextAtUrl(url: string): Promise<string> {
  return await util37().getTextAtUrl(url);
}

export function closesPrevious(
  ele: HTMLElement,
  searchPattern: string
): HTMLElement {
  return util37().closesPrevious(ele, searchPattern);
}
