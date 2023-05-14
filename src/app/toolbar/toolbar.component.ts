import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Modeler, ModelingService, ModelerActions } from '@denysvuika/ng-bpmn';

@Component({
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule],
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html'
})
export class AppToolbarComponent {
  private modelingService = inject(ModelingService);

  @Input({ required: true }) modeler?: Modeler;

  async saveXML(modeler?: Modeler) {
    if (modeler) {
      this.modelingService.downloadXML(modeler);
    }
  }

  async saveSVG(modeler?: Modeler) {
    if (modeler) {
      this.modelingService.downloadSVG(modeler);
    }
  }

  canUndo(modeler?: Modeler) {
    if (modeler) {
      return modeler.supportsAction(ModelerActions.canUndo);
    }
    return false;
  }

  undo(modeler?: Modeler) {
    if (modeler) {
      modeler.triggerAction(ModelerActions.undo);
    }
  }

  canRedo(modeler?: Modeler) {
    if (modeler) {
      return modeler.supportsAction(ModelerActions.canRedo);
    }
    return false;
  }

  redo(modeler?: Modeler) {
    if (modeler) {
      modeler.triggerAction(ModelerActions.redo);
    }
  }
}
