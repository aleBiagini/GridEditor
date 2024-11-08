import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { GridModel } from "../models/GridModel";
import "./WidgetItem";

@customElement("grid-element")
export class Grid extends LitElement {
  @property({ type: Object }) grid!: GridModel;
  render() {
    const gridStyle = `grid-template-rows: repeat(${this.grid.rows}, 1fr); grid-template-columns: repeat(${this.grid.columns}, 1fr);`;
    return html`
      <div class="grid-config">
        <label>
          Righe:
          <input
            type="number"
            min="1"
            .value=${this.grid.rows}
            @input=${(e: InputEvent) =>
              this.updateGridSize(
                "rows",
                Number((e.target as HTMLInputElement).value)
              )}
          />
        </label>
        <label>
          Colonne:
          <input
            type="number"
            min="1"
            .value=${this.grid.columns}
            @input=${(e: InputEvent) =>
              this.updateGridSize(
                "columns",
                Number((e.target as HTMLInputElement).value)
              )}
          />
        </label>
        <button class="btn btn-primary btn-sm" @click=${this.addWidget}>
          Aggiungi Widget
        </button>
      </div>
      <div id="${this.grid.id}" class="grid" style="${gridStyle}">
        ${this.grid.items.map(
          (item, index) =>
            html`<widget-item
              .item=${item}
              .gridId=${this.grid.id}
              .itemIndex=${index}
              @remove-widget=${this.removeWidget}
            ></widget-item>`
        )}
      </div>
    `;
  }

  // Funzione per aggiornare righe e colonne
  updateGridSize(dimension: "rows" | "columns", value: number) {
    if (value >= 1) {
      this.grid[dimension] = value;
      this.requestUpdate();
    }
  }

  // Funzione per aggiungere un nuovo widget
  addWidget() {
    const newItem = {
      type: "header-text", // Tipo predefinito
      content: "Nuovo Widget", // Contenuto predefinito
      customCSS: "",
    };
    this.grid.items.push(newItem);
    this.requestUpdate();
  }

  // Funzione per aprire la sidebar (emette un evento)


  // Funzione per rimuovere un widget
  removeWidget(e: CustomEvent) {
    this.grid.items.splice(e.detail.itemIndex, 1);
    this.requestUpdate();
  }

  static styles = css`
    .grid-config {
      display: flex;
      align-items: center;
      gap: 1em;
      margin-bottom: 1em;
    }

    .grid-config label {
      font-weight: bold;
    }

    .grid-config input {
      width: 60px;
      margin-left: 0.5em;
    }

    .grid {
      display: grid;
      gap: 1em;
      background-color: #fff;
      padding: 1em;
      border: 2px dashed #ccc;
    }

    .btn {
      cursor: pointer;
    }
  `;
}
