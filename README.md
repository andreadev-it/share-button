# share-button-custom-element

## Description
This is a custom elements that allows you to share informations using the
native share dialog on mobile. On desktop, it fallbacks to copying the text
to the clipboard.

## Installation
Download the `share-button.js` file and import it in your HTML like this:
```
<script type="module" src="share-button.js"></script>
```

## Usage
Usage within HTML:
```
<share-button
    title="Shared title"
    text="This is the text that will be shared"
    url="https://example.com"
    fallbacktext="Text that will be copied to your clipboard"
>
    Share!
</share-button>
```

## Attributes
| Name           | Description |
| -------------- | ----------- |
| `title`        | It will be sent to the native share dialog. How it's used depends on the share target.
| `text`         | This is the text that will be shared. If no fallback text has been set, it's the text that will also be copied to your clipboard when the Web Share API is not available.
| `url`          | The URL that you want to share.
| `fallbacktext` | The text that will be copied to the clipboard if the Web Share API is not available. You may want to insert here a short text that includes the URL that you want to share. If this is not present, the `text` attribute is copied instead.

## Events

| Name            | Description |
| --------------- | ----------- |
| `share`         | Fired when the user clicks the share button. It can be used to prevent the default share behaviour. |
| `sharesuccess`  | Fired when the share was successful. If the clipboard API was used, it fires before the alert, so that you can prevent it. |
| `sharecanceled` | Fired when the user canceled the share by clicking outside the share dialog on mobile. |
| `sharefailed`   | Fired when the share event encounters some error. |

## Methods

| Name            | Description |
| --------------- | ----------- |
| `triggerShare`  | This method allows you to trigger a share action, as if the user clicked on the share button. It also allows you to share files. When used, no `share` event will be generated. |


## Useful tips

### How to remove "The text has been copied to your clipboard" message

This message was included because it is very important to notify your users when the
share text has been copied to their clipboard. You can remove that warning in two ways.

Using the `quiet` attribute:
```html
<share-button text="test without warning" quiet >Share</share-button>
```

Preventing the default behaviour on `sharesuccess` event:
```js
let shareBtn = document.getElementById(...);

shareBtn.addEventListener("sharesuccess", (event) => {

    event.preventDefault(); // will remove the message

    if (event.detail.method === "clipboard-api") {
        // Implement your own logic to warn the user
    }
});
```

### When is the Web Share API used?

The Web Share API is available **only on mobile browsers**. Also, the page must be
**served over https**. There are other requirements, for a full list check out this
[article on web.dev](https://web.dev/web-share/#capabilities-and-limitations).

Only one thing to point out, in that article it says that on Android it is available
only on Chromium forks, but that's not true anymore, since it is available in the newer
version of Firefox.

### Implementing custom share logic

Let's say you're happy with the Web Share API on mobile, but don't like how this button
works for desktop users. You can always prevent the default button behaviour and use this
element like a regular button:
```js
let shareBtn = document.getElementById(...);

shareBtn.addEventListener("share", (event) => {

    // Check if the Web Share API is not available
    if (!window.navigator.share) {
        event.preventDefault();
        // Implement custom logic
    }
});

```

### Why my `triggerShare` call doesn't work?

When triggering a share action programmatically, you must **always be sure that it was
triggered by a user interaction**. Many browsers will stop you from using the Web Share
or Clipboard API if the code wasn't triggered by some user action.

### How to share files

You can share files when the Web Share API is used, which means that it does not work
out of the box for desktop users. You can only do it from the Javascript API, using the
`triggerShare` function:

```js
let shareBtn = document.getElementById(...);

let files = document.getElementById("my-file-picker").files;

shareBtn.triggerShare({
    title: "Test File Sharing",
    text: "This will share some files along with these informations.",
    files: files
});
```