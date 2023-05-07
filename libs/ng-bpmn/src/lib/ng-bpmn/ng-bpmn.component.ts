import {
  AfterContentInit,
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
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription, from, map, switchMap } from 'rxjs';
import BpmnJS from 'bpmn-js/lib/Modeler';
import Canvas from 'diagram-js/lib/core/Canvas';

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
  encapsulation: ViewEncapsulation.None,
})
export class NgBpmnComponent
  implements OnInit, AfterContentInit, OnChanges, OnDestroy
{
  private bpmnJS: BpmnJS = new BpmnJS();

  @Input() url?: string;

  @ViewChild('ref', { static: true })
  private container?: ElementRef;

  @Output()
  importDone = new EventEmitter<ImportEvent>();

  constructor(private http: HttpClient) {
    this.bpmnJS.on('import.done', ({ error }: ImportCallback) => {
      if (!error) {
        const canvas = this.bpmnJS.get<Canvas>('canvas');
        canvas.zoom('fit-viewport');
      }
    });
  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.container?.nativeElement);
  }

  ngOnInit(): void {
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
    this.bpmnJS.destroy();
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
            warnings,
          });
        },
        error: (err: HttpErrorResponse) => {
          this.importDone.emit({
            type: 'error',
            error: err,
          });
        }
      });
  }

  private importDiagram(xml: string): Observable<{ warnings: Array<string> }> {
    return from(this.bpmnJS.importXML(xml));
  }
}
