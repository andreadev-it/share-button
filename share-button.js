let template = document.createElement("template");
template.innerHTML = `
<style>
:host {
    padding: 0.4em 1em;
    border: solid 1px #aaa;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    user-select: none;
}

:host(:hover) {
    background-color: #ddd;
}

:host(:active) {
    background-color: #ccc;
}

#share-text {
    position: absolute;
    left: -1000000px;
}
</style>
<slot></slot>
<input type="text" id="share-text" />
`

class ShareButton extends HTMLElement {

    get title() {
        return this.getAttribute("title");
    }

    set title(val) {
        this.setAttribute("title", val);
    }

    get text() {
        return this.getAttribute("text");
    }

    set text(val) {
        this.setAttribute("text", val);
    }

    get url() {
        return this.getAttribute("url");
    }

    set url(val) {
        this.setAttribute("url", val);
    }

    get fallbackText() {
        return this.getAttribute("fallbacktext");
    }

    set fallbackText(val) {
        this.setAttribute("fallbacktext", val)
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        this.addEventListener("click", function (e) {
            this.triggerShare({
                title: this.title,
                text: this.text,
                url: this.url,
                fallbackText: this.fallbackText
            });
        }, true);
    }

    triggerShare(data) {

        let event = new CustomEvent("share", {
            detail: {
                title: data.title,
                text: data.text,
                url: data.url,
                files: data.files,
                fallbackText: data.fallbackText,
            },
            cancelable: true
        });

        let continueShare = this.dispatchEvent(event);

        if (continueShare) {
            if (window.navigator.share) {
                this._share(data);
            }
            else if (window.navigator.clipboard) {
                this._clipboardAPI(data.fallbackText || data.text);
            }
            else if (document.execCommand) {
                this._execCommand(data.fallbackText || data.text);
            }
        }
    }

    async _share(data) {
        try {
            await navigator.share(data);

            let event = new CustomEvent("sharesuccess", {
                detail: {
                    method: "share-api",
                    title: data.title,
                    text: data.text,
                    url: data.url,
                    files: data.files,
                    fallbackText: data.fallbackText
                }
            });

            this.dispatchEvent(event);
        }
        catch(error) {
            if (error.name === "AbortError") {

                let event = new CustomEvent("sharecanceled", {
                    detail: {
                        method: "share-api",
                        title: data.title,
                        text: data.text,
                        url: data.url,
                        files: data.files
                    }
                });

                this.dispatchEvent(event);
            }
            else {
                let event = new CustomEvent("sharefailed", {
                    detail: {
                        method: "share-api",
                        title: data.title,
                        text: data.text,
                        url: data.url,
                        files: data.files
                    }
                })
                this.dispatchEvent(event);
            }
        }
    }

    async _clipboardAPI(text) {
        try {
            await navigator.clipboard.writeText(text);

            let event = new CustomEvent("sharesuccess", {
                detail: {
                    method: "clipboard-api",
                    text: text
                }
            });

            this.dispatchEvent(event);
        }
        catch(error) {
            let event = new CustomEvent("sharefailed", {
                detail: {
                    method: "clipboard-api",
                    text: text
                }
            });

            this.dispatchEvent(event);

            throw "Error while trying to copy to clipboard. Was this event triggered by a user interaction?";
        }
    }

    _execCommand(text) {
        let textDOM = this.shadowRoot.getElementById("share-text");
        textDOM.value = text;

        try {
            textDOM.select();
            textDOM.setSelectionRange(0,999999);
            document.execCommand("copy");

            let event = new CustomEvent("sharesuccess", {
                detail: {
                    method: "clipboard-legacy",
                    text: text
                }
            });
            this.dispatchEvent(event);
        }
        catch(error) {
            let event = new CustomEvent("sharefailed", {
                detail: {
                    method: "clipboard-legacy",
                    text: text
                }
            });
            this.dispatchEvent(event);

            throw "Error while trying to copy using 'document.execCommand(`copy`). Check the documentation relative to the browser in use.'";
        }
    }
}

window.customElements.define("share-button", ShareButton);