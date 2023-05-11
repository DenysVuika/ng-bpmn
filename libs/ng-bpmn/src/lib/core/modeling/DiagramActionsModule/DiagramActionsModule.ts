import { EditorActions } from '../EditorActions';
import { CommandStack } from '../CommandStack';
import { ModelerActions } from '../ModelerActions';
import { DiagramSelection } from '../DiagramSelection';
import { Injector } from '../Injector';

export default class DiagramActionsModule {
  static $inject = ['injector'];

  constructor(injector: Injector) {
    const commandStack = injector.get<CommandStack>('commandStack');
    const editorActions = injector.get<EditorActions>('editorActions');
    const selection = injector.get<DiagramSelection>('selection');

    if (editorActions) {
      editorActions.register({
        [ModelerActions.canUndo]: () => commandStack.canUndo(),
        [ModelerActions.canRedo]: () => commandStack.canRedo(),
        [ModelerActions.zoomToFit]: () => editorActions.trigger('zoom', { value: 'fit-viewport' }),
        [ModelerActions.resetZoom]: () => editorActions.trigger('zoom', { value: 1 }),
        [ModelerActions.zoomIn]: (step = 1) => editorActions.trigger('stepZoom', { value: step }),
        [ModelerActions.zoomOut]: (step = 1) => editorActions.trigger('stepZoom', { value: -step }),
        [ModelerActions.hasSelection]: () => {
          const selected = selection.get();
          return selected && selected.length > 0;
        },
      });
    }
  }
}
