export class Card extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const headerContent = this.querySelector('[slot="header"]');
    const bodyContent = this.querySelector('[slot="body"]');

    this.className = "block w-full card";

    this.innerHTML = `
      <div class="card-header">
        <slot name="header"></slot>
      </div>
      
      <div class="card-body">
        <slot name="body"></slot>
      </div>
    `;

    if (headerContent) {
      this.querySelector('slot[name="header"]')?.replaceWith(headerContent);
    }

    if (bodyContent) {
      this.querySelector('slot[name="body"]')?.replaceWith(bodyContent);
    }
  }
}

customElements.define("app-card", Card);
