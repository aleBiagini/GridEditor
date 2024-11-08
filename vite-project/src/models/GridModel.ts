
  
// GridModel.ts
import { WidgetItemModel } from "./WidgetItemModel";

export interface GridModel {
  id: string;
  rows: number;
  columns: number;
  items: WidgetItemModel[];
}

  