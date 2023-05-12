import hotkeys from 'hotkeys-js';
import { EditorActions } from './modeling/EditorActions';
import { ModelerActions } from './modeling/ModelerActions';

export abstract class ModelerComponent {
  private hotkeyBindings: string[] = [];
  // private _editorActions?: EditorActions;

  // get editorActions(): EditorActions | undefined {
  //   return this._editorActions;
  // }

  // protected set editorActions(value: EditorActions | undefined) {
  //   this._editorActions = value;
  // }

  abstract get editorActions(): EditorActions | undefined;

  supportsAction(action: string): boolean {
    if (this.editorActions) {
      return this.editorActions.isRegistered(action);
    }
    return false;
  }

  triggerAction(action: string, params?: any): any {
    return this.editorActions?.trigger(action, params);
  }

  protected bindHotkeys(actions: { [key: string]: ModelerActions }) {
    for (const key of Object.keys(actions)) {
      const action = actions[key];

      if (this.supportsAction(action)) {
        hotkeys(key, (event) => {
          event.preventDefault();
          this.triggerAction(action);
        });
        this.hotkeyBindings.push(key);
      }
    }
  }

  protected unbindHotkeys() {
    for (const key of this.hotkeyBindings) {
      hotkeys.unbind(key);
    }

    this.hotkeyBindings = [];
  }
}
