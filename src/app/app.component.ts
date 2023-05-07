import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgBpmnComponent } from '@denysvuika/ng-bpmn';

@Component({
  standalone: true,
  imports: [RouterModule, NgBpmnComponent],
  selector: 'ng-bpmn-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-bpmn-app';
  importError?: Error;
  diagramUrl =
    'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';

  handleImported(event: any) {
    const { type, error, warnings } = event;

    if (type === 'success') {
      console.log(`Rendered diagram (%s warnings)`, warnings.length);
    }

    if (type === 'error') {
      console.error('Failed to render diagram', error);
    }

    this.importError = error;
  }
}
