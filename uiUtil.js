export {randLightColor}

import {randEl} from './util.js'

function randLightColor() {
	let letters = 'BCDEF'.split(''), color = '#'
	for (let i = 0; i < 6; i++) { color += randEl(letters) }
	return color
}
