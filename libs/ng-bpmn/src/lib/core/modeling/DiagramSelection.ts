// https://github.com/bpmn-io/diagram-js/blob/11f64fa5939325af2b759b6356d5993e1900cca5/lib/features/selection/Selection.js
export interface DiagramSelection {
  deselect(element: any): void;
  get(): any[];
  isSelected(element: any): boolean;
  select(elements: any | any[], add: boolean): void;
}
