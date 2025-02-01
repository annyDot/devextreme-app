import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ModalConfig, ModalEvent } from '../components/modal/interface/modal.interface';
import { ModalComponent } from '../components/modal/modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private overlayRef!: OverlayRef;
  private overlay = inject(Overlay);

  open(component: any, config: ModalConfig): Observable<ModalEvent> {
    const subject = new Subject<ModalEvent>();

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'modal-panel',
    });

    const portal = new ComponentPortal(ModalComponent);
    const modalWrapperRef = this.overlayRef.attach(portal);
    const instance = modalWrapperRef.instance;

    instance.component = component;
    instance.config = config;

    instance.modalEvent.subscribe((event) => {
      subject.next(event);
      if (
        event.type === 'cancel' ||
        event.type === 'save' ||
        event.type === 'ok'
      ) {
        this.close();
      }
    });

    return subject.asObservable();
  }

  close() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}