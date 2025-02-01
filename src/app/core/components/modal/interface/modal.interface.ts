import { EventEmitter, OutputEmitterRef } from '@angular/core';

export interface Modal {
  buttons: ModalButton[];
  modalOutput: EventEmitter<ModalEvent> | OutputEmitterRef<any>;
}

export interface ModalConfig {
  title: string;
  width?: number;
  height?: number;
  buttons?: ModalButton[];
  data?: any;
  componentInputs?: { [key: string]: any };
}

export interface ModalButton {
  type: 'save' | 'cancel' | 'ok';
  label: string;
}

export interface ModalEvent {
  type: 'save' | 'cancel' | 'ok';
  data?: any;
}
