/*
This file acts as a bridge between non-typescript jsutil code and typescript
clients of jsutil

Original location of this file:

*/

export {
    htmlEncode, el, sendJsonRequest, nxtId, setGlobVar, areFrmInpsValid,
    enableDisableChildInputCtrls
}

import { HTTPMethod } from 'http-method-enum'

function util37() {
    //@ts-ignore
    return globalThis.util37
}

function htmlEncode(s: string) {
    return util37().htmlEncode(s) as string
}

function el(id: string) {
    return util37().el(id) as HTMLElement
}

function nxtId() {
    return util37().nxtId() as number
}

async function sendJsonRequest(method: HTTPMethod, objForBody: any,
    commonPartOfApiUrl: string, uniquePartOfApiUrl: string) {
    /**
     *        checkParams(params, ['method', 'objForBody','commonPartOfApiUrl',
                'uniquePartOfApiUrl'])
     */
    const params = {
        method, objForBody, commonPartOfApiUrl, uniquePartOfApiUrl
    }
    return await util37().sendJsonRequest(params)
}

function setGlobVar(name: string, val: any) {
    (window as { [key: string]: any })[name] = val;

}
/*
function bindAllFns(thisObj: any, fnList: string[]) {
    return util37().bindAllFns(thisObj, fnList)
}*/

function areFrmInpsValid(frmSubmitBtn: HTMLButtonElement): boolean {
    return util37().areFrmInpsValid(frmSubmitBtn)
}

function enableDisableChildInputCtrls(
    ctnrEl: HTMLFormElement, enableOrDisable: boolean): void {
    util37().enableDisableChildInputCtrls(ctnrEl, enableOrDisable);
}