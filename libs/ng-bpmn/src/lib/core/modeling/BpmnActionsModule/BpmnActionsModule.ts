import { Injector } from '../Injector';
import { EditorActions } from '../EditorActions';
import { DiagramSelection } from '../DiagramSelection';
import { DiagramMinimap } from '../DiagramMinimap';
import { ModelerActions } from '../ModelerActions';

export default class BpmnActionsModule {
  static $inject = ['injector'];

  constructor(injector: Injector) {
    const editorActions = injector.get<EditorActions>('editorActions');
    const selection = injector.get<DiagramSelection>('selection');
    const minimap = injector.get<DiagramMinimap>('minimap');

    if (editorActions) {
      editorActions.register('cut', () => {
        const selected = selection.get();

        if (selected && selected.length > 0) {
          editorActions.trigger('copy');
          editorActions.trigger('removeSelection');
        }
      });

      if (minimap) {
        editorActions.register({
          [ModelerActions.showMinimap]: () => minimap.open(),
          [ModelerActions.hideMinimap]: () => minimap.close(),
        });
      }
    }
  }
}
