import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Modeler, ModelerActions } from '@denysvuika/ng-bpmn';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'app-toolbar-action',
  templateUrl: './toolbar-action.component.html'
})
export class AppToolbarActionComponent {
  @Input({ required: true }) modeler?: Modeler;
  @Input({ required: true }) action?: ModelerActions;

  @Input() tooltip = '';
  @Input() icon = 'question_mark';

  supportsAction() : boolean {
    if (this.modeler && this.action) {
      return !!this.modeler?.supportsAction(this.action);
    }
    return false;
  }

  triggerAction(): void {
    if (this.modeler && this.action) {
      this.modeler.triggerAction(this.action);
    }
  }
}
