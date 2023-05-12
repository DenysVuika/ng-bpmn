export interface ImportEvent {
  type: 'success' | 'error';
  warnings?: string[];
  error?: Error;
}
