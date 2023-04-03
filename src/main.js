import './status-message.js'
import { text } from 'd3'
import * as localforage from "localforage";

let webrMessage = document.getElementById("webr-status");
webrMessage.text = ""

import './r.js'

try {
	rip = await text("https://rud.is/rip")
} catch (e) {

}

globalThis.lf = localforage

localforage.config({
	name: 'webr-localforage',
	storeName: 'rObjs', // Should be alphanumeric, with underscores.
	description: 'Objects for R'
});

const keys = await lf.keys()

if (keys.includes('mtcars')) {

	const opts = {
		env: { mtcars_serialized: await lf.getItem('mtcars') }
	}
	const res = await webR.evalR("mtcars2 <<- unserialize(as.raw(mtcars_serialized))", opts)
	console.log(await R`mtcars2`)

} else {
	const res = await R`serialize(mtcars, NULL)`
	await lf.setItem('mtcars', res.values)
}

webrMessage.text = "WebR Loaded!"
