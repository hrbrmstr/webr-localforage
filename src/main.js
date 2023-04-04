import './status-message.js'
import './simple-message.js'
import "./action-button.js"
import "./data-frame-view.js"

import { text } from 'd3'

import * as localforage from "localforage";

let webrMessage = document.getElementById("webr-status");
webrMessage.text = ""

import './r.js'

globalThis.lf = localforage

lf.config({
	name: 'webr-localforage', // the name of the localStorage object you'll look for again
	storeName: 'rObjs', // Should be alphanumeric, with underscores.
	description: 'Objects for R' // not really necessary
});

const keys = await lf.keys()

console.log(`What keys do we have? ${keys}`)

const simpleMessage = document.getElementById("msg")
const actionButton = document.getElementById("action")
const mtcars2 = document.getElementById("mtcars2")

async function clearAction(e) {

	await lf.removeItem('mtcars')
	mtcars2.dataFrame = null

	actionButton.label = 'Persist a copy of `mtcars`'
	actionButton.onClick = persistAction

	simpleMessage.text = ""

}

async function persistAction(e) {

	const res = await R`serialize(mtcars, NULL)`
	await lf.setItem('mtcars', res.values)

	mtcars2.columns = [ "wt", "mpg", "drat", "cyl", "qsec", "gear" ]
	mtcars2.dataFrame = await R`mtcars`

	actionButton.label = 'Remove local copy of `mtcars`'
	actionButton.onClick = clearAction

	simpleMessage.text = "Quit the browser (optional) and reload the page to see this automagically re-appear!"

}

if (keys.includes('mtcars')) {

	actionButton.label = "Clear Local Storage"
	actionButton.onClick = clearAction;

	const opts = {
		env: { mtcars_serialized: await lf.getItem('mtcars') }
	}
	const res = await webR.evalR("mtcars2 <<- unserialize(as.raw(mtcars_serialized))", opts)
	
	mtcars2.columns = [ "wt", "mpg", "drat", "cyl", "qsec", "gear" ]
	mtcars2.dataFrame = await res.toJs()

	simpleMessage.text = "Quit the browser (optional) and reload the page to see this automagically re-appear!"

} else {

	actionButton.label = "Persist a copy of `mtcars`"
	actionButton.onClick = persistAction;

	simpleMessage.text = ""

}

webrMessage.text = "WebR Loaded!"
