import './status-message.js'
import './simple-message.js'
import "./action-button.js"
import "./data-frame-view.js"

import * as localforage from "localforage";

let webrMessage = document.getElementById("webr-status");
webrMessage.text = ""

import './r.js'

// `lf` is way easier to type
globalThis.lf = localforage

// configure our local storage
lf.config({
	name: 'webr-localforage', // the name of the localStorage object you'll look for again
	storeName: 'rObjs', // Should be alphanumeric, with underscores.
	description: 'Objects for R' // not really necessary
});

// get all the keys we've stored
const keys = await lf.keys()

// some setup stuffs
const simpleMessage = document.getElementById("msg")
const actionButton = document.getElementById("action")
const mtcars2 = document.getElementById("mtcars2")

const persistLabel = 'Persist a copy of `mtcars`'
const removeLabel = 'Remove local copy of `mtcars`'
const itsHereMessage = `Quit the browser (optional) and reload the page to see this automagically reappear! Hit '${removeLabel}' to make me (and the table) go away!`
const colsToShow = [ "wt", "mpg", "drat", "cyl", "qsec", "gear" ]

// if data existed, this will let us clear it
async function clearAction(e) {

	await lf.removeItem('mtcars')
	mtcars2.dataFrame = null

	actionButton.label = persistLabel
	actionButton.onClick = persistAction

	simpleMessage.text = ""

}

// if no data existed, this will let us persist it
async function persistAction(e) {

	const res = await R`serialize(mtcars, NULL)`
	await lf.setItem('mtcars', res.values)

	mtcars2.columns = colsToShow
	mtcars2.dataFrame = await R`mtcars`

	actionButton.label = removeLabel
	actionButton.onClick = clearAction

	simpleMessage.text = itsHereMessage

}

// if a persisted copy of `mtcars` exists, load it up!
if (keys.includes('mtcars')) {

	actionButton.label = removeLabel
	actionButton.onClick = clearAction;

	const opts = {
		env: { mtcars_serialized: await lf.getItem('mtcars') }
	}
	const res = await webR.evalR("unserialize(as.raw(mtcars_serialized))", opts)
	
	mtcars2.columns = colsToShow
	mtcars2.dataFrame = await res.toJs()

	simpleMessage.text = itsHereMessage

} else {

	actionButton.label = persistLabel
	actionButton.onClick = persistAction;

	simpleMessage.text = ""

}

webrMessage.text = "WebR Loaded!"

// toss a bit of `mtcars` in the console
const res = await webR.evalR(`options(width=60); serialize(head(mtcars, 1), NULL)`, {
	captureStreams: true,
	withAutoprint: true
})



