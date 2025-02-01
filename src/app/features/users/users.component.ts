import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import {
  DxDataGridComponent,
  DxDataGridModule,
  DxSelectBoxModule,
} from 'devextreme-angular';

import { userActions, usersTableColumns } from './constants/users.constants';
import {
  HeaderAction,
  HeaderComponent,
} from '../../core/components/header/header.component';
import { UsersService } from './services/users.service';
import { EMPTY, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { User } from './models/user.model';
import { ModalService } from '../../core/services/modal.service';
import { AddOrEditUserComponent } from './components/add-or-edit-user/add-or-edit-user.component';
import { ModalEvent } from '../../core/components/modal/interface/modal.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  imports: [CommonModule, DxDataGridModule, HeaderComponent, DxSelectBoxModule],
})
export class UsersComponent implements OnDestroy {
  usersService = inject(UsersService);
  modalService = inject(ModalService);
  private destroy$ = new Subject<void>();

  tableColumns = usersTableColumns;
  userActions = userActions;

  selectedRow: User | null = null;

  onActionClick(action: HeaderAction): void {
    switch (action.key) {
      case 'edit':
        if (this.selectedRow) {
          this.onEdit(this.selectedRow);
        }
        break;
      case 'delete':
        if (this.selectedRow) {
          this.onDelete(this.selectedRow);
        }
        break;
      case 'add':
        this.onAdd();
        break;
      default:
        console.log('Unknown action', action.key);
    }
  }

  onAdd() {
    return this.modalService
      .open(AddOrEditUserComponent, {
        title: 'Dodaj korisnika',
        width: 900,
        buttons: [
          { type: 'cancel', label: 'Otkaži' },
          { type: 'save', label: 'Spremi' },
        ],
        componentInputs: {
          mode: 'add',
        },
      })
      .pipe(
        switchMap((event: ModalEvent) => {
          if (event && event.type === 'save') {
            return this.usersService.addUser(event.data);
          }
          return EMPTY;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onEdit(user: User) {
    return this.modalService
      .open(AddOrEditUserComponent, {
        title: 'Ažuriraj korisnika',
        width: 900,
        buttons: [
          { type: 'cancel', label: 'Otkaži' },
          { type: 'save', label: 'Spremi' },
        ],
        componentInputs: {
          mode: 'edit',
          user,
        },
      })
      .pipe(
        switchMap((event: ModalEvent) => {
          if (event && event.type === 'save') {
            return this.usersService.editUser(event.data);
          }
          return EMPTY;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onDelete(user: User) {
    this.usersService.deleteUser(user.id);
  }

  onSelectedRowChange(event: any) {
    this.selectedRow = event.selectedRowsData.length
      ? { ...event.selectedRowsData[0] }
      : null;

    this.handleUserActions(this.selectedRow);
  }

  private handleUserActions(selectedRow: User | null) {
    this.userActions = this.userActions.map((action) => {
      if (selectedRow) {
        return {
          ...action,
          disabled: false,
        };
      } else {
        if (action.key === 'edit' || action.key === 'delete') {
          return {
            ...action,
            disabled: true,
          };
        }
        return action;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
