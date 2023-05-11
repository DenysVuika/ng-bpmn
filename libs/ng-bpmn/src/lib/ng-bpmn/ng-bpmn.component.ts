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

export interface ImportEvent {
  type: 'success' | 'error';
  warnings?: string[];
  error?: Error;
}

interface ImportCallback {
  error?: Error;
  warnings?: string[];
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

  @Input() url?: string;
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

  constructor(private http: HttpClient) {
    super();
  }

  ngOnInit(): void {
    const additionalModules = [
      AddExporter,
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
      DiagramActionsModule,
      BpmnActionsModule,
    ];

    if (this.showMinimap) {
      additionalModules.push(MinimapModule);
    }

    this.bpmnJS = new BpmnModeler({
      exporter: {
        name: '@DenysVuika@ng-bpmn',
        version: '1.0.0'
      },
      container: this.canvas?.nativeElement,
      propertiesPanel: {
        parent: this.properties?.nativeElement
      },
      additionalModules
    });

    this.editorActions = this.bpmnJS.get<EditorActions>('editorActions');

    if (this.hotkeys) {
      this.bindHotkeys();
    }

    if (this.showMinimap && this.autoOpenMinimap) {
      this.bpmnJS.get<DiagramMinimap>('minimap').open();
    }

    this.bpmnJS.on('import.done', ({ error }: ImportCallback) => {
      if (!error && this.bpmnJS) {
        const canvas = this.bpmnJS.get<Canvas>('canvas');
        canvas.zoom('fit-viewport');
      }
    });

    if (this.url) {
      this.loadUrl(this.url);
    }
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
      'ctrl+f, command+f': ModelerActions.find,
    });
  }

  protected override unbindHotkeys() {
    console.log('Unbinding BPMN hotkeys');
    super.unbindHotkeys();
  }
}
