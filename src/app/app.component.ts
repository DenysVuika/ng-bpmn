import { NgIf } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DiagramChangedEvent, ImportEvent, NgBpmnComponent, NgCmmnComponent, NgDmnComponent } from '@denysvuika/ng-bpmn';
import { MatTabsModule } from '@angular/material/tabs';
import { AppToolbarComponent } from './toolbar/toolbar.component';

@Component({
  standalone: true,
  imports: [NgIf, RouterModule, NgBpmnComponent, AppToolbarComponent, NgDmnComponent, NgCmmnComponent, MatTabsModule],
  selector: 'ng-bpmn-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'ng-bpmn-app';
  importError?: Error;

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

  onChanged($event: DiagramChangedEvent) {
    // console.log($event.xml);
  }
}
