import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import "./GridContainer";
import "./Sidebar";

@customElement("my-preview-element")
export class MyPreviewElement extends LitElement {
  @state()
  selectedItem = { gridId: "", itemIndex: null }; // Memorizza il widget selezionato

  @state()
  customCSS = ""; // Memorizza il CSS personalizzato

  @state()
  widgetContent = ""; // Memorizza il contenuto HTML del widget selezionato

  @state()
  isSidebarOpen = false; // Controlla lo stato della sidebar

  /**
   * Apre la sidebar quando viene emesso l'evento `open-sidebar`.
   */
  openSidebar(e: CustomEvent) {
    const { gridId, itemIndex, content } = e.detail;
    this.selectedItem = { gridId, itemIndex };
    this.isSidebarOpen = true;
  
    // Aggiorna la Sidebar con i dettagli attuali
    const sidebar = this.renderRoot.querySelector("sidebar-element") as HTMLElement & {
      gridId: string;
      itemIndex: number;
      content: string;
    };
  
    if (sidebar) {
      sidebar.gridId = gridId;
      sidebar.itemIndex = itemIndex;
      sidebar.content = content;
    }
  
    console.log("Sidebar opened for:", e.detail);
  }
  

  /**
   * Chiude la sidebar.
   */
  closeSidebar() {
    this.isSidebarOpen = false;
    this.selectedItem = { gridId: "", itemIndex: null };
    this.widgetContent = ""; // Resetta il contenuto quando la sidebar si chiude
  }

  /**
   * Gestisce l'applicazione delle modifiche al CSS e al contenuto.
   */
  applyChanges(e: CustomEvent) {
    const { customCSS, content } = e.detail;
    this.customCSS = customCSS;
    this.widgetContent = content;
    console.log("[MyPreviewElement] CSS e contenuto applicati:", e.detail);
    // Qui potresti implementare la logica per aggiornare i dati nel componente GridContainer
  }

  render() {
    return html`
      <div class="preview-container">
        <!-- Grid Container -->
        <grid-container
          @open-sidebar=${this.openSidebar}
        ></grid-container>

        <!-- Sidebar -->
        <sidebar-element
          ?open=${this.isSidebarOpen}
          .customCSS=${this.customCSS}
          .content=${this.widgetContent}
          @close-sidebar=${this.closeSidebar}
          @apply-css=${this.applyChanges}
        ></sidebar-element>
      </div>
    `;
  }

  static styles = css`
    .preview-container {
      display: flex;
      flex-direction: column;
      gap: 1em;
      padding: 1em;
    }
  `;
}
