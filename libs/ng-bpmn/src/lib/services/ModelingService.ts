import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Modeler } from '../core/Modeler';

@Injectable({ providedIn: 'root' })
export class ModelingService {
  async downloadXML(modeler: Modeler, fileName = 'diagram.xml') {
    if (modeler) {
      const content = await modeler.saveXML();
      if (content) {
        const blob = new Blob([content]);
        saveAs(blob, fileName);
      }
    }
  }

  async downloadSVG(modeler?: Modeler, fileName = 'diagram.svg') {
    if (modeler) {
      const content = await modeler.saveSVG();
      if (content) {
        const blob = new Blob([content], { type: 'image/svg+xml' });
        saveAs(blob, fileName);
      }
    }
  }
}
