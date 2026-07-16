export type FileSelectedEvent = CustomEvent<{ files: FileList }>;

export class FileCard extends HTMLElement {
  static get observedAttributes() {
    return ["accept", "multiple"];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    const headerContent = this.querySelector('[slot="header"]');
    const bodyStartContent = this.querySelector('[slot="body-start"]');

    const accept = this.getAttribute("accept") || "";
    const multiple = this.getAttribute("multiple") || "false";

    this.className = "block w-full card";

    this.innerHTML = `
      <div class="card-header">
        <slot name="header"></slot>
      </div>
      
      <div class="card-body flex flex-col items-center gap-3">
        <slot name="body-start"></slot>
        <input class="hidden" type="file" accept="${accept}" multiple="${multiple}" />
        <button type="button" class="btn-primary">Húzd ide a fájlt</button>
      </div>
    `;

    if (headerContent) {
      this.querySelector('slot[name="header"]')?.replaceWith(headerContent);
    }

    if (bodyStartContent) {
      this.querySelector('slot[name="body-start"]')?.replaceWith(
        bodyStartContent,
      );
    }

    this.setupListeners();
  }

  private setupListeners() {
    const fileInput =
      this.querySelector<HTMLInputElement>('input[type="file"]');
    const uploadBtn = this.querySelector<HTMLButtonElement>("button");

    if (!fileInput || !uploadBtn) {
      return;
    }

    uploadBtn.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files?.length) return;

      this.emitFileEvent(target.files);

      target.value = "";
    });

    this.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.classList.add("border-indigo-500", "border-dashed");
    });

    this.addEventListener("dragleave", () => {
      this.classList.remove("border-indigo-500", "border-dashed");
    });

    this.addEventListener("drop", (e) => {
      e.preventDefault();
      this.classList.remove("border-indigo-500", "border-dashed");

      const files = e.dataTransfer?.files;
      if (!files?.length) return;

      this.emitFileEvent(files);
    });
  }

  private emitFileEvent(files: FileList) {
    this.dispatchEvent(
      new CustomEvent("file-selected", {
        detail: { files: files },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define("app-file-card", FileCard);
