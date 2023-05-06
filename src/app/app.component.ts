import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { NgBpmnComponent } from '@ngstack/ng-bpmn';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, NgBpmnComponent],
  selector: 'ng-bpmn-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-bpmn-app';
}
