import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportEvent, NgBpmnComponent } from '@denysvuika/ng-bpmn';
import { saveAs } from 'file-saver';

@Component({
  standalone: true,
  imports: [NgIf, RouterModule, NgBpmnComponent],
  selector: 'ng-bpmn-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-bpmn-app';
  importError?: Error;
  diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';

  showProperties = true;

  handleImported(event: ImportEvent) {
    const { type, error, warnings } = event;

    if (type === 'success') {
      console.log(`Rendered diagram (%s warnings)`, warnings?.length);
    }

    if (type === 'error') {
      console.error('Failed to render diagram', error);
    }

    this.importError = error;
  }

  saveXML(bpmnComponent: NgBpmnComponent) {
    bpmnComponent.saveXML().then((content) => {
      if (content) {
        const blob = new Blob([content]);
        saveAs(blob, 'diagram.xml');
      }
    });
  }

  saveSVG(bpmnComponent: NgBpmnComponent) {
    bpmnComponent.saveSVG().then((content) => {
      if (content) {
        const blob = new Blob([content], { type: 'image/svg+xml' });
        saveAs(blob, 'diagram.svg');
      }
    });
  }
}
