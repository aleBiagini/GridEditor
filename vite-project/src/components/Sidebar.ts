import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("sidebar-element")
export class Sidebar extends LitElement {
  @property({ type: Boolean }) open = false; // Stato della sidebar (aperta o chiusa)
  @property({ type: String }) customCSS = ""; // CSS personalizzato del widget
  @property({ type: String }) content = ""; // Contenuto HTML del widget
  @property({ type: String }) gridId = ""; // ID della griglia attiva
  @property({ type: Number }) itemIndex = -1; // Indice del widget attivo

  render() {
    return html`
      <div class="sidebar ${this.open ? "open" : ""}">
        <button class="close-btn btn btn-secondary" @click=${this.closeSidebar}>
          &times;
        </button>
        <h3>Modifica CSS</h3>
        <textarea
          class="form-control"
          rows="6"
          placeholder="Scrivi qui il CSS personalizzato..."
          .value=${this.customCSS}
          @input=${this.updateCustomCSS}
        ></textarea>

        <h3>Modifica Contenuto</h3>
        <textarea
          class="form-control"
          rows="6"
          placeholder="Scrivi qui il contenuto HTML..."
          .value=${this.content}
          @input=${this.updateContent}
        ></textarea>

        <button class="btn btn-primary mt-3" @click=${this.applyChanges}>
          Applica
        </button>
      </div>
    `;
  }

  /**
   * Aggiorna il CSS personalizzato dalla textarea.
   */
  updateCustomCSS(e: Event) {
    this.customCSS = (e.target as HTMLTextAreaElement).value;
  }

  /**
   * Aggiorna il contenuto HTML dalla textarea.
   */
  updateContent(e: Event) {
    this.content = (e.target as HTMLTextAreaElement).value;
  }

  /**
   * Applica le modifiche e invia un unico evento `update-widget`.
   */
  applyChanges() {
    console.log("[Sidebar] Applicazione modifiche:");
    console.log("- CSS personalizzato:", this.customCSS);
    console.log("- Contenuto HTML:", this.content);
  
    // Emetti l'evento unificato
    window.dispatchEvent(
      new CustomEvent("update-widget", {
        detail: {
          gridId: this.gridId,
          itemIndex: this.itemIndex,
          customCSS: this.customCSS,
          content: this.content,
        },
      })
    );
  
    console.log("[Sidebar] Evento 'update-widget' emesso con dettagli:", {
      gridId: this.gridId,
      itemIndex: this.itemIndex,
      customCSS: this.customCSS,
      content: this.content,
    });
  }
  
  

  /**
   * Chiude la sidebar.
   */
  closeSidebar() {
    console.log("[Sidebar] Sidebar chiusa.");
    this.dispatchEvent(new CustomEvent("close-sidebar", { bubbles: true }));
  }

  static styles = css`
    .sidebar {
      position: fixed;
      top: 0;
      right: -300px;
      width: 300px;
      height: 100%;
      background: #f1f1f1;
      padding: 1em;
      transition: right 0.3s ease-in-out;
    }
    .sidebar.open {
      right: 0;
    }
    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 1.5rem;
      background: none;
      border: none;
      cursor: pointer;
    }
    .form-control {
      width: 100%;
      font-family: monospace;
      padding: 0.5em;
      margin-bottom: 1em;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .btn {
      display: inline-block;
      padding: 0.5em 1em;
      font-size: 1rem;
      cursor: pointer;
      text-align: center;
      border: none;
      border-radius: 4px;
    }
  `;
}
