---
{
  "title": "🧪 Webr + localForage 🫙",
   "description": "When you need to keep R stuff around for a bit.",
  "og" : {
    "site_name": "WebR Exeriments",
    "url": "https://rud.is/w/webr-localforage",
    "description": "When you need to keep R stuff around for a bit.",
    "image": {
      "url": "https://rud.is/w/webr-localforage/preview.png",
      "height": "836",
      "width": "1014",
      "alt": "example"
    }
  },
  "twitter": {
    "site": "@hrbrmstr",
    "domain": "rud.is"
  },
	"extra_header_bits": [
		"<link rel='apple-touch-icon' sizes='180x180' href='./favicon/apple-touch-icon.png'>",
		"<link rel='icon' type='image/png' sizes='32x32' href='./favicon/favicon-32x32.png'>",
		"<link rel='icon' type='image/png' sizes='16x16' href='./favicon/favicon-16x16.png'>",
		"<link rel='manifest' href='./favicon/site.webmanifest'>",
		"<link href='./src/index.css' rel='stylesheet'>",		
		"<link href='./src/components.css' rel='stylesheet'>",		
		"<script type='module' src='./src/main.js'></script>"
	],
	"extra_body_bits": [
		"<!-- extra body bits -->"
	]
}
---
# 🧪 🕸️ 🫙 WebR + localForage

<status-message id="webr-status" text="WebR Loading…"></status-message>

## When you need to keep R stuff around for a bit.

Experiment hypothesis:

>We can keep actual R objects around for a while thanks to R's `[un]serialze()` and [`localForage`](https://localforage.github.io/localForage/)

Experiment parameters:

- Webr
- <span class="pill">New!</span> The ^^ mentioned `localForage`
- <span class="pill">New!</span> A fairly reusable (but basic) Lit component to display a data frame with selected columns
- Lit (web components)
- Vite (for building)
_________________

## Fiddling With Local Storage

<action-button id="action" label=""></action-button>

<simple-message id="msg"></simple-message>

<data-frame-view id="mtcars2" label="Copy of mtcars (serialized to local storage)"></data-frame-view>
_________________

## If nothing else, you _sure_ are a persistent one, hrbrmstr

Aye, that I am!

I'm willing to bet you _(almost)_ never use R's super cool [`serialize()`]([removeLabel](https://rdrr.io/r/base/serialize.html)) function (directly). That function takes an R object and transforms it into a format that can be persisted outside R. If the second parameter to it is `NULL`, then you get back a `raw` vector. It has a corresponding `unserialize()` which does what you think it does.

Modern browsers have [lots of ways to store things locally](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage). You can _persist_ data as well, meaning you can store stuff — like R objects! — to be used later. This could come in handy!

Using those storage APIs directly is, quite frankly, painful. However, that [`localForage`](https://localforage.github.io/localForage/) library abstracts the pain away, providing familiar key/value idioms to store, retrieve, and remove persisted copies of any data. That means we can do something like this:

```js
const res = await R`serialize(mtcars, NULL)`
await lf.setItem('mtcars', res.values)
```

We can get that back from local storage via:

```js
const opts = {
  env: { mtcars_serialized: await lf.getItem('mtcars') }
}
const res = await webR.evalR("unserialize(as.raw(mtcars_serialized))", opts)
```

And, we can get rid of it just as easily:

```js
await lf.removeItem('mtcars')
```

If you open up Developer Tools, you'll see the bytes for the serialized first row of `mtcars` (I did not want to clutter up this page with hex string output). `res.values` contains the entire copy of `mtcars` in that raw format.

You should not go crazy with this feature, meaning try not to DoS your visitors with a gigantic amount of local storage. And, you will need to read up on `localForage` and web client storage in general to grok the nuances, limits, and "gotchas".

Reading up on R's `[un]serialize()` is also required, since there are limits to what it can do, especially with complex objects (an example of which might be parsed HTML/XML via {xml2}).

## Some JavaScript Stuff

`main.js` does all the hard work (it is also annotated), so I avoided putting large swaths of code blocks in this write-up.

There are four oddly (for me) reusable Lit web components included:

- `status-message`: _(you know this one by now)_
- `simple-message`: Basic message displayer without much adornment
- `action-button`: Generic action button _(pass in a label and click handler)_
- `data-frame-view`: It doesn't validate that you passed in a valid data frame (i.e., a full [`WebRDataJsNull`](https://docs.r-wasm.org/webr/latest/api/js/modules/RObject.html#webrdatajsnull) `data.frame` structure), but if you do pass one in with a label and columns to display, it'll toss out a basic scrollable `div` with said table. It could be way more generic, but it should be sufficient for you to riff from.

## FIN

Go forth and persist all the things!

Source is on [GitHub](https://github.com/hrbrmstr/webr-localforage)

<p style="text-align:center">Brought to you by @hrbrmstr</p>