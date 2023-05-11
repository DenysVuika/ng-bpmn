export interface CommandStack {
  canUndo(): boolean;
  undo(): void;
  canRedo(): boolean;
  redo(): void;
  clear(): void;
}
