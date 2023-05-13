import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Modeler } from '@denysvuika/ng-bpmn';
import { saveAs } from 'file-saver';

@Component({
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule],
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html'
})
export class AppToolbarComponent {
  @Input({ required: true }) modeler?: Modeler;

  async saveXML(modeler?: Modeler) {
    if (modeler) {
      const content = await modeler.saveXML();
      if (content) {
        const blob = new Blob([content]);
        saveAs(blob, 'diagram.xml');
      }
    }
  }

  async saveSVG(modeler?: Modeler) {
    if (modeler) {
      const content = await modeler.saveSVG();
      if (content) {
        const blob = new Blob([content], { type: 'image/svg+xml' });
        saveAs(blob, 'diagram.svg');
      }
    }
  }
}
