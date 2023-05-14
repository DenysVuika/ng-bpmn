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

  canUndo(): boolean {
    return !!this.modeler?.supportsAction(ModelerActions.canUndo);
  }

  undo(): void {
    this.modeler?.triggerAction(ModelerActions.undo);
  }

  canRedo(): boolean {
    return !!this.modeler?.supportsAction(ModelerActions.canRedo);
  }

  redo(): void {
    this.modeler?.triggerAction(ModelerActions.redo);
  }

  canZoomIn(): boolean {
    return !!this.modeler?.supportsAction(ModelerActions.zoomIn);
  }

  zoomIn(): void {
    this.modeler?.triggerAction(ModelerActions.zoomIn);
  }

  canZoomOut(): boolean {
    return !!this.modeler?.supportsAction(ModelerActions.zoomOut);
  }

  zoomOut(): void {
    this.modeler?.triggerAction(ModelerActions.zoomOut);
  }

  canZoomToFit(): boolean {
    return !!this.modeler?.supportsAction(ModelerActions.zoomToFit);
  }

  zoomToFit(): void {
    this.modeler?.triggerAction(ModelerActions.zoomToFit);
  }
}
