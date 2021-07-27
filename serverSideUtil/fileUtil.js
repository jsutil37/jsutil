/* this utility can only be run via nodejs */

export {
    fileToString, folderContentToString, pathExists, isFolder,
    createFolderIfNotExists, hadPathExisted, fileExists
}

//#region requiredLibs
import {
    readFileSync, readdirSync, lstatSync, existsSync, mkdirSync
} from 'fs'
import gblPath from 'path'
import { assert } from '../debugUtil.js'
//#endregion requiredLibs

let hadPathExisted = false

/** 
 * checks whether the specified path is a folder
 * pre-requisite: the path must exist
 * @param {string} path
*/
function isFolder(path) {
    assert(pathExists(path))
    return lstatSync(normalize(path)).isDirectory()
}

/**
 * checks whether the specified path is a file
 * pre-requisite: the path must exist
 * @param {string} path
*/
function isFile(path) {
    assert(pathExists(path))
    return lstatSync(normalize(path)).isFile()
}

/** @param {string} path */
function normalize(path) {
    path = gblPath.normalize(path)
    if (path.startsWith('\\')) { path = path.substr(1) }//bug in windows nodejs???
    return path
}

/** @param {string} path */
function fileToString(path) {
    //to open a text file AND read its content as string, it is needed to
    //assume some encoding. Here we assume utf8
    let rv = readFileSync(normalize(path), 'utf8')
    //log('Done reading file ' + path)
    return rv
}

/**
 * @param {string} path
 */
function readDir(path) {
    return readdirSync(normalize(path), { withFileTypes: true })
}

/** @param {string} path */
function isEmptyFolder(path) {
    assert(isFolder(path))
    let dirEnts = readDir(path)
    return (dirEnts.length == 0)
}

/**
 * returns the ENTIRE content of a folder into a single string
 * @param {string} path
 */
function folderContentToString(path) {
    let dirEnts = readDir(path)
    let s = ''
    for (const dirEnt of dirEnts) {//NOSONAR
        if (dirEnt.isDirectory()) {
            s += folderContentToString(path + '/' + dirEnt.name)
            continue
        }
        assert(dirEnt.isFile())
        let path2 = path + '/' + dirEnt.name
        s += '\nfile path: ' + path2 + '\n'
        s += fileToString(path2)
    }
    return s
}

/** @param {string} path */
function pathExists(path) { return existsSync(normalize(path)) }

function fileExists(filePath) {
    const rv = pathExists(filePath)
    if (rv) { assert(isFile(filePath)) }
    return rv
}

/** @param {string} path */
function createFolderIfNotExists(path) {
    path = normalize(path)
    hadPathExisted = pathExists(path)
    if (!hadPathExisted) { mkdirSync(path) }
}