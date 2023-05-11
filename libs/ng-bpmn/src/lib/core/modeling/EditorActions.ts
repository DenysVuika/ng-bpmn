export interface EditorActions {
  isRegistered(name: string): boolean;
  getActions(): string[];
  trigger(action: string, params?: any): any;
  register(actions: { [key: string]: (opts: any) => void }): void;
  register(action: string, listener: (opts: any) => void ): void;
}
