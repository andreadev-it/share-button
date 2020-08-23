(() => {
    let template = document.createElement("template");
    template.innerHTML = `
    <style>
    #share-text {
        position: absolute;
        left: -1000000px;
    }
    </style>
    <button id="share-btn">
        <slot></slot>
    </button>
    <input type="text" id="share-text" />
    `

    class ShareButton extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: 'open'});
        }

        connectedCallback() {
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            
            let buttonDOM = this.shadowRoot.querySelector("#share-btn");

            buttonDOM.addEventListener("click", () => {
                this.triggerShare();
            }, true);
        }

        triggerShare() {
            /*
            Share Data = {
                title: string
                text: string
                url: string
                files: FileList (check for navigator.canShare && navigator.canShare({ fileList }) )
            } 
            */
            if (window.navigator.share) {
                this._share({});
            }
            else if (window.navigator.clipboard) {
                this._clipboardAPI("Con clipboard API");
            }
            else if (document.execCommand) {
                this._execCommand("prova");
            }
        }

        async _share(data) {
            try {
                await navigator.share(data);
                alert("Condiviso con successo!");
            }
            catch(error) {
                alert("Errore!");
                console.error("Errore durante la condivisione ", error);
            }
        }

        async _clipboardAPI(text) {
            await navigator.clipboard.writeText(text);
            alert("testo copiato!");
        }

        _execCommand(text) {
            let textDOM = this.shadowRoot.getElementById("share-text");
            textDOM.value = text;

            textDOM.select();
            textDOM.setSelectionRange(0,999999);
            document.execCommand("copy");

            alert("Copiato testo");
        }
    }

    window.customElements.define("share-button", ShareButton);
})();