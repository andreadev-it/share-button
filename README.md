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
| Name         | Description |
| ------------ | ----------- |
| title        | It will be sent to the native share dialog. How it's used depends on the share target.
| text         | This is the text that will be shared. If no fallback text has been set, it's the the text that will also be copied to your clipboard when the Web Share API is not available.
| url          | The URL that you want to share.
| fallbacktext | The text that will be copied to the clipboard if the Web Share API is not available. You may want to insert here a short text that includes the URL that you want to share .

## Methods

This component has only one method: `triggerShare`.