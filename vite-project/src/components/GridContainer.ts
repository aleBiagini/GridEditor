import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import Sortable, { SortableEvent } from "sortablejs";
import "./Grid"; // Importa il componente Grid

@customElement("grid-container")
export class GridContainer extends LitElement {
  @state()
  grids: Array<{
    id: string;
    rows: number;
    columns: number;
    items: Array<{ type: string; content: string; customCSS?: string }>;
  }> = [];

  firstUpdated() {
    const container = this.renderRoot.querySelector(
      ".grids-container"
    ) as HTMLElement;
    if (container) {
      Sortable.create(container, {
        animation: 150,
        handle: ".grid-handle",
        onEnd: (event: SortableEvent) => this.handleGridSort(event),
      });
    }
  }

  handleGridSort(event: SortableEvent) {
    const { oldIndex, newIndex } = event;
    if (oldIndex !== undefined && newIndex !== undefined) {
      const movedGrid = this.grids.splice(oldIndex, 1)[0];
      this.grids.splice(newIndex, 0, movedGrid);
    }
  }

  addGrid() {
    const newGridId = `grid-${this.grids.length + 1}`;
    const newGrid = {
      id: newGridId,
      rows: 2,
      columns: 2,
      items: [],
    };
    this.grids = [...this.grids, newGrid];
  }

  removeGrid(gridId: string) {
    this.grids = this.grids.filter((grid) => grid.id !== gridId);
  }

  updateGrid(gridId: string, updatedGrid: any) {
    this.grids = this.grids.map((grid) =>
      grid.id === gridId ? updatedGrid : grid
    );
  }

  render() {
    return html`
      <div class="grid-container">
        <div class="actions">
          <button class="btn btn-primary" @click=${this.addGrid}>
            Aggiungi Griglia
          </button>
        </div>

        <div class="grids-container">
          ${this.grids.map(
            (grid) => html`
              <div class="grid-wrapper">
                <div class="grid-handle">⇅</div>
                <grid-element
                  .grid=${grid}
                  @remove-grid=${() => this.removeGrid(grid.id)}
                  @update-grid=${(e: CustomEvent) =>
                    this.updateGrid(grid.id, e.detail)}
                ></grid-element>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  static styles = css`
    .grid-container {
      display: flex;
      flex-direction: column;
      gap: 1em;
    }

    .actions {
      margin-bottom: 1em;
      text-align: center;
    }

    .actions .btn {
      padding: 0.5em 1em;
      font-size: 1rem;
      cursor: pointer;
    }

    .grids-container {
      display: flex;
      flex-direction: column;
      gap: 1em;
    }

    .grid-wrapper {
      position: relative;
      border: 1px solid #ddd;
      padding: 1em;
      border-radius: 5px;
      background-color: #f9f9f9;
    }

    .grid-handle {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: grab;
      font-size: 1.2rem;
      color: #666;
    }

    .grid-handle:active {
      cursor: grabbing;
    }
  `;
}
