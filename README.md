# 🧪 🕸️ WebR + localForage

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