import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { DxToolbarModule, DxButtonModule } from 'devextreme-angular';

export interface HeaderAction {
  icon: string;
  key: string;
  disabled: boolean;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, DxToolbarModule, DxButtonModule],
})
export class HeaderComponent {
  title = input('');
  actions = input<HeaderAction[]>([]);
  actionClicked = output<HeaderAction>();

  onActionClick(action: HeaderAction) {
    this.actionClicked.emit(action);
  }
}
