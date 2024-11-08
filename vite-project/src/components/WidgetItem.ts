import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("widget-item")
export class WidgetItem extends LitElement {
  @property({ type: Object }) item!: {
    type: string;
    content: string;
    customCSS?: string;
  };

  @property({ type: String }) gridId!: string;
  @property({ type: Number }) itemIndex!: number;

  render() {
    return html`
      <div class="sortable-item" style="${this.item.customCSS || ""}">
        <button
          class="settings-btn btn btn-secondary btn-sm position-absolute top-0 end-0"
          @click=${this.openSidebar}
        >
          ⚙️
        </button>
        <button
          class="remove-btn btn btn-danger btn-sm position-absolute top-0 start-0"
          @click=${this.removeWidget}
        >
          &times;
        </button>
        <div>${this.item.content}</div>
      </div>
    `;
  }

  openSidebar() {
    this.dispatchEvent(
      new CustomEvent("open-sidebar", {
        detail: {
          gridId: this.gridId,
          itemIndex: this.itemIndex,
          content: this.item.content, // Contenuto attuale
        },
        bubbles: true,
        composed: true,
      })
    );
    console.log("Sidebar event dispatched with content:", this.item.content);
  }
  
  
  removeWidget() {
    this.dispatchEvent(
      new CustomEvent("remove-widget", {
        detail: { gridId: this.gridId, itemIndex: this.itemIndex },
        bubbles: true,
        composed: true,
      })
    );
  }
  connectedCallback() {
    super.connectedCallback();
    console.log("[WidgetItem] Listener per 'update-widget' registrato.");
    window.addEventListener("update-widget", this.handleUpdateWidget as EventListener);
  }
  
  
  disconnectedCallback() {
    window.removeEventListener("update-widget", this.handleUpdateWidget as EventListener);
    super.disconnectedCallback();
  }

  handleUpdateWidget = (e: CustomEvent) => {
    const { gridId, itemIndex, customCSS, content } = e.detail;
  
    if (gridId === this.gridId && itemIndex === this.itemIndex) {
      // Applica il CSS e il contenuto al widget
      this.item.customCSS = customCSS;
      this.item.content = content;
      this.requestUpdate();
      console.log(`[WidgetItem] Aggiornamento ricevuto per item:`, this.item);
    } else {
      console.log(
        `[WidgetItem] Dettagli non corrispondono:`,
        { gridId, itemIndex },
        { thisGridId: this.gridId, thisItemIndex: this.itemIndex }
      );
    }
  };

  static styles = css`
    .sortable-item {
      padding: 1em;
      border: 1px solid #ddd;
      background-color: #f9f9f9;
      position: relative;
    }
    .settings-btn {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .remove-btn {
      position: absolute;
      top: 10px;
      left: 10px;
    }
  `;
}
