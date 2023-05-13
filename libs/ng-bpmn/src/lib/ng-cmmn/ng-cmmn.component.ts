import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ImportEvent } from '../core/ImportEvent';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ModelerComponent } from '../core/ModelerComponent';
import { Modeler } from '../core/Modeler';
import CmmnModeler from 'cmmn-js/lib/Modeler';
import PropertiesPanelModule from 'cmmn-js-properties-panel';
import PropertiesProviderModule from 'cmmn-js-properties-panel/lib/provider/cmmn';
import DiagramActionsModule from '../core/modeling/DiagramActionsModule';
import { exporter } from '../core/exporter';
import { Observable, Subscription, from, map, of, switchMap } from 'rxjs';
import AddExporter from '@bpmn-io/add-exporter';
import { EditorActions } from '../core/modeling/EditorActions';
import { ImportCallback } from '../core/ImportCallback';
import { ModelerActions } from '../core/modeling/ModelerActions';
import CmmnActionsModule from '../core/modeling/CmmnActionsModule';

@Component({
  selector: 'ng-cmmn',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './ng-cmmn.component.html',
  styleUrls: ['./ng-cmmn.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgCmmnComponent extends ModelerComponent implements Modeler, OnInit, OnDestroy, OnChanges {
  private cmmnJS?: CmmnModeler;

  @Input({ required: true }) url?: string;
  @Input() showProperties = false;
  @Input() hotkeys = false;

  @ViewChild('canvas', { static: true })
  private canvas?: ElementRef;

  @ViewChild('properties', { static: true })
  private properties?: ElementRef;

  @Output()
  importDone = new EventEmitter<ImportEvent>();

  override get editorActions(): EditorActions | undefined {
    return this.cmmnJS.get('editorActions');
  }

  constructor(private http: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.cmmnJS = new CmmnModeler({
      exporter,
      container: this.canvas?.nativeElement,
      propertiesPanel: {
        parent: this.properties?.nativeElement,
      },
      additionalModules: [AddExporter, PropertiesPanelModule, PropertiesProviderModule, DiagramActionsModule, CmmnActionsModule],
    });

    this.cmmnJS.on('import.done', ({ error }: ImportCallback) => {
      if (!error && this.cmmnJS) {
        const canvas = this.cmmnJS.get('canvas');
        canvas.zoom('fit-viewport');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.hotkeys) {
      this.unbindHotkeys();
    }
    this.cmmnJS?.destroy();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['url']) {
      this.loadUrl(changes['url'].currentValue);
    }
  }

  private onLoad() {
    if (this.hotkeys) {
      this.bindHotkeys();
    }
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

  private importDiagram(xml: string): Observable<{ warnings: Array<string> }> {
    if (this.cmmnJS) {
      const promise = new Promise<{ warnings: Array<string> }>((resolve, reject) => {
        this.cmmnJS.importXML(xml, function (err: Error) {
          if (err) {
            return reject(err);
          }
          return resolve({ warnings: [] });
        })
      });
      return from(promise);
    } else {
      return of({ warnings: [] });
    }
  }

  async saveXML(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.cmmnJS.saveXML({ format: true }, (err: Error, xml: string) => {
        if (err) {
          return reject(err);
        }

        return resolve(xml);
      });
    });
  }

  async saveSVG(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.cmmnJS.saveSVG((err: Error, svg: string) => {
        if (err) {
          return reject(err);
        }

        return resolve(svg);
      });
    });
  }

  toggleProperties(): void {
    this.showProperties = !this.showProperties;
  }

  protected override bindHotkeys(): void {
    console.log('Binding CMMN hotkeys');

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
      // 'ctrl+c, command+c': ModelerActions.copy,
      c: ModelerActions.globalConnectTool,
      // 'ctrl+v, command+v': ModelerActions.paste,
      // 'ctrl+x, command+x': ModelerActions.cut,
      'ctrl+f, command+f': ModelerActions.find
    });
  }

  protected override unbindHotkeys() {
    console.log('Unbinding CMMN hotkeys');
    super.unbindHotkeys();
  }
}
