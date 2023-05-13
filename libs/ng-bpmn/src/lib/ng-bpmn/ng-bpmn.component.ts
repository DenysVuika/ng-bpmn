import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription, from, map, of, switchMap } from 'rxjs';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import Canvas from 'diagram-js/lib/core/Canvas';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import MinimapModule from 'diagram-js-minimap';
import AddExporter from '@bpmn-io/add-exporter';
import { EditorActions } from '../core/modeling/EditorActions';
import { Modeler } from '../core/Modeler';
import { ModelerComponent } from '../core/ModelerComponent';
import { ModelerActions } from '../core/modeling/ModelerActions';
import DiagramActionsModule from '../core/modeling/DiagramActionsModule';
import BpmnActionsModule from '../core/modeling/BpmnActionsModule';
import { DiagramMinimap } from '../core/modeling/DiagramMinimap';
import { debounce } from '../utils/debounce';
import { ImportEvent } from '../core/ImportEvent';
import { exporter } from '../core/exporter';
import { ImportCallback } from '../core/ImportCallback';

export interface DiagramChangedEvent {
  xml?: string;
  error?: Error;
}

@Component({
  selector: 'ng-bpmn',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './ng-bpmn.component.html',
  styleUrls: ['./ng-bpmn.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgBpmnComponent extends ModelerComponent implements Modeler, OnInit, OnChanges, OnDestroy {
  private bpmnJS?: BpmnModeler;

  @Input({ required: true }) url?: string;
  @Input() showProperties = false;
  @Input() showMinimap = false;
  @Input() autoOpenMinimap = false;
  @Input() hotkeys = false;

  @ViewChild('canvas', { static: true })
  private canvas?: ElementRef;

  @ViewChild('properties', { static: true })
  private properties?: ElementRef;

  @Output()
  importDone = new EventEmitter<ImportEvent>();

  @Output()
  changed = new EventEmitter<DiagramChangedEvent>();

  constructor(private http: HttpClient) {
    super();
  }

  get editorActions(): EditorActions | undefined {
    return this.bpmnJS?.get<EditorActions>('editorActions');
  }

  ngOnInit(): void {
    const additionalModules = [AddExporter, BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, DiagramActionsModule, BpmnActionsModule];

    if (this.showMinimap) {
      additionalModules.push(MinimapModule);
    }

    const modeler = new BpmnModeler({
      exporter,
      container: this.canvas?.nativeElement,
      propertiesPanel: {
        parent: this.properties?.nativeElement
      },
      additionalModules
    });

    if (this.showMinimap && this.autoOpenMinimap) {
      modeler.get<DiagramMinimap>('minimap').open();
    }

    modeler.on('import.done', ({ error }: ImportCallback) => {
      if (!error && this.bpmnJS) {
        const canvas = this.bpmnJS.get<Canvas>('canvas');
        canvas.zoom('fit-viewport');
      }
    });

    const onChanged = debounce(async () => {
      try {
        const content = await this.bpmnJS?.saveXML();
        if (content) {
          this.changed.next(content);
        }
      } catch (err) {
        console.error(err);
      }
    });

    modeler.on('commandStack.changed', onChanged);
    modeler.on('import.done', onChanged);

    this.bpmnJS = modeler;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['url']) {
      this.loadUrl(changes['url'].currentValue);
    }
  }

  ngOnDestroy(): void {
    if (this.hotkeys) {
      this.unbindHotkeys();
    }
    this.bpmnJS?.destroy();
  }

  private onLoad() {
    if (this.hotkeys) {
      this.bindHotkeys();
    }
  }

  toggleProperties() {
    this.showProperties = !this.showProperties;
  }

  loadUrl(url: string): Subscription {
    return this.http
      .get(url, { responseType: 'text' })
      .pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map((result) => result.warnings)
      )
      .subscribe({
        next: (warnings) => {
          this.importDone.emit({
            type: 'success',
            warnings
          });

          this.onLoad();
        },
        error: (err: HttpErrorResponse) => {
          this.importDone.emit({
            type: 'error',
            error: err
          });
        }
      });
  }

  async saveXML(): Promise<string | undefined> {
    if (this.bpmnJS) {
      const { xml } = await this.bpmnJS.saveXML({ format: true });
      return xml;
    } else {
      return Promise.reject('Modeler not initialized');
    }
  }

  async saveSVG(): Promise<string | undefined> {
    if (this.bpmnJS) {
      const { svg } = await this.bpmnJS.saveSVG();
      return svg;
    } else {
      return Promise.reject('Modeler not initialized');
    }
  }

  private importDiagram(xml: string): Observable<{ warnings: Array<string> }> {
    if (this.bpmnJS) {
      return from(this.bpmnJS.importXML(xml));
    } else {
      return of({ warnings: [] });
    }
  }

  protected override bindHotkeys() {
    console.log('Binding BPMN hotkeys');

    super.bindHotkeys({
      'ctrl+a, command+a': ModelerActions.selectElements,
      e: ModelerActions.directEditing,
      h: ModelerActions.handTool,
      l: ModelerActions.lassoTool,
      s: ModelerActions.spaceTool,
      'ctrl+=, command+=': ModelerActions.zoomIn,
      'ctrl+-, command+-': ModelerActions.zoomOut,
      'ctrl+0, command+0': ModelerActions.resetZoom,
      'ctrl+9, command+9': ModelerActions.zoomToFit,
      'ctrl+z, command+z': ModelerActions.undo,
      'ctrl+shift+z, command+shift+z': ModelerActions.redo,
      Backspace: ModelerActions.removeSelection,
      'ctrl+c, command+c': ModelerActions.copy,
      c: ModelerActions.globalConnectTool,
      'ctrl+v, command+v': ModelerActions.paste,
      'ctrl+x, command+x': ModelerActions.cut,
      'ctrl+f, command+f': ModelerActions.find
    });
  }

  protected override unbindHotkeys() {
    console.log('Unbinding BPMN hotkeys');
    super.unbindHotkeys();
  }
}
