import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  EventEmitter,
  InjectionToken,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { ModalConfig, ModalEvent } from './interface/modal.interface';
import { DxButtonModule } from 'devextreme-angular';

export const MODAL_DATA = new InjectionToken<any>('MODAL_DATA');

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports: [CommonModule, DxButtonModule],
})
export class ModalComponent {
  @Input() component!: any;
  @Input() config!: Partial<ModalConfig>;
  @Output() modalEvent = new EventEmitter<ModalEvent>();
  @ViewChild('dynamicComponent', { read: ViewContainerRef })
  private viewContainerRef!: ViewContainerRef;
  defaultWidth = 600;
  defaultHeight = 600;

  ngAfterViewInit() {
    this.loadComponent();
  }

  loadComponent() {
    const componentRef: ComponentRef<any> =
      this.viewContainerRef.createComponent(this.component);

    if (this.config?.buttons) {
      componentRef.instance['buttons'] = this.config.buttons;
    }

    if (this.config?.componentInputs) {
      Object.entries(this.config.componentInputs).forEach(([key, value]) => {
        componentRef.instance[key] = value;
      });
    }

    if (componentRef.instance['modalOutput']) {
      componentRef.instance['modalOutput'].subscribe((event: ModalEvent) => {
        this.modalEvent.emit(event);
      });
    }

    componentRef.changeDetectorRef.detectChanges();
  }

  onClose() {
    this.modalEvent.emit({ type: 'cancel' });
  }
}
