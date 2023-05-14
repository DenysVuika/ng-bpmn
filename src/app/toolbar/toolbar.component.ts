import { Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Modeler, ModelingService, ModelerActions } from '@denysvuika/ng-bpmn';
import { AppToolbarActionComponent } from './toolbar-action.component';

@Component({
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule, MatDividerModule, AppToolbarActionComponent],
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppToolbarComponent {
  private modelingService = inject(ModelingService);

  @Input({ required: true }) modeler?: Modeler;

  ModelerActions = ModelerActions;

  async saveXML() {
    if (this.modeler) {
      this.modelingService.downloadXML(this.modeler);
    }
  }

  async saveSVG() {
    if (this.modeler) {
      this.modelingService.downloadSVG(this.modeler);
    }
  }

  toggleProperties(): void {
    this.modeler?.toggleProperties();
  }
}
