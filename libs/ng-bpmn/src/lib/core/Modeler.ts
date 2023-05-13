export interface Modeler {
  saveXML(): Promise<string | undefined>;
  saveSVG(): Promise<string | undefined>;

  supportsAction(action: string): boolean;
  triggerAction(action: string, params?: any): any;
  toggleProperties(): void;
}
