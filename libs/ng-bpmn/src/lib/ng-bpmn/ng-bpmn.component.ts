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
export class NgBpmnComponent implements OnInit, OnChanges, OnDestroy {
  private bpmnJS?: BpmnModeler;

  @Input() url?: string;
  @Input() showProperties = false;
  @Input() showMinimap = false;

  @ViewChild('canvas', { static: true })
  private canvas?: ElementRef;

  @ViewChild('properties', { static: true })
  private properties?: ElementRef;

  @Output()
  importDone = new EventEmitter<ImportEvent>();

  constructor(private http: HttpClient) {}

  // ngAfterContentInit(): void {
  //   this.bpmnJS.attachTo(this.canvas?.nativeElement);
  // }

  ngOnInit(): void {
    const additionalModules = [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule];

    if (this.showMinimap) {
      additionalModules.push(MinimapModule);
    }

    this.bpmnJS = new BpmnModeler({
      container: this.canvas?.nativeElement,
      propertiesPanel: {
        parent: this.properties?.nativeElement
      },
      additionalModules
    });

    if (this.showMinimap) {
      this.bpmnJS.get<any>('minimap').open();
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

  private importDiagram(xml: string): Observable<{ warnings: Array<string> }> {
    if (this.bpmnJS) {
      return from(this.bpmnJS.importXML(xml));
    } else {
      return of({ warnings: [] });
    }
  }
}
