import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import DmnModeler from 'dmn-js/lib/Modeler';
import { DmnPropertiesPanelModule, DmnPropertiesProviderModule } from 'dmn-js-properties-panel';
import { ModelerComponent } from '../core/ModelerComponent';
import { Modeler } from '../core/Modeler';
import { Observable, Subscription, from, map, of, switchMap } from 'rxjs';
import { ImportEvent } from '../core/ImportEvent';
import { exporter } from '../core/exporter';
import DiagramActionsModule from '../core/modeling/DiagramActionsModule';
import DmnActionsModule from '../core/modeling/DmnActionsModule';
import { EditorActions } from '../core/modeling/EditorActions';

export type DmnViewType = 'drd' | 'decisionTable' | 'literalExpression';

export interface DmnView {
  element: any;
  id: string;
  name: string;
  type: DmnViewType;
}

// export interface ViewsChangedEvent {
//   views: DmnView[];
//   activeView: DmnView;
// }

@Component({
  selector: 'ng-dmn',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './ng-dmn.component.html',
  styleUrls: ['./ng-dmn.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgDmnComponent extends ModelerComponent implements Modeler, OnInit, OnDestroy {
  private dmnJS?: DmnModeler;

  @Input({ required: true }) url?: string;
  @Input() showProperties = false;

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
    this.dmnJS = new DmnModeler({
      container: this.canvas?.nativeElement,
      exporter,
      drd: {
        propertiesPanel: {
          parent: this.properties?.nativeElement,
        },
        additionalModules: [
          DmnPropertiesPanelModule,
          DmnPropertiesProviderModule,
          DiagramActionsModule,
          DmnActionsModule
        ],
      },
    });

    // this.dmnJS.on('views.changed', ({ activeView }: ViewsChangedEvent) => {
    //   console.log(activeView);
    // });
    /*
    this.dmnJS.on('views.changed', (event: any) => {
      console.log(event);

      // const activeViewer = this.dmnJS.getActiveViewer();
      // console.log(activeViewer);
      // if (activeViewer) {
      //   const propertiesPanel = activeViewer.get('propertiesPanel', false);
      //   console.log(propertiesPanel);
      //   if (propertiesPanel) {
      //     propertiesPanel.attachTo(properties);
      //   }
      // }
    });
    */

    if (this.url) {
      this.loadUrl(this.url);
    }
  }

  ngOnDestroy(): void {
    this.dmnJS?.destroy();
  }

  getActiveView(): DmnView {
    return this.dmnJS.getActiveView();
  }

  // get commandStack(): CommandStack | undefined {
  //   return this.dmnJS.getActiveViewer()?.get('commandStack');
  // }

  // get selection(): DiagramSelection | undefined {
  //   return this.dmnJS.getActiveViewer()?.get('selection');
  // }

  get editorActions(): EditorActions | undefined {
    return this.dmnJS?.getActiveViewer()?.get('editorActions');
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
    if (this.dmnJS) {
      const { xml } = await this.dmnJS.saveXML({ format: true });
      return xml;
    } else {
      return Promise.reject('Modeler not initialized');
    }
  }

  async saveSVG(): Promise<string | undefined> {
    if (this.dmnJS) {
      const { svg } = await this.dmnJS.saveSVG();
      return svg;
    } else {
      return Promise.reject('Modeler not initialized');
    }
  }

  private importDiagram(xml: string): Observable<{ warnings: Array<string> }> {
    if (this.dmnJS) {
      return from(this.dmnJS.importXML(xml)) as any;
    } else {
      return of({ warnings: [] });
    }
  }
}
