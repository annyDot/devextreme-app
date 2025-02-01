import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import {
  DxTextBoxModule,
  DxValidatorModule,
  DxButtonModule,
  DxTextAreaModule,
  DxSelectBoxModule,
  DxCheckBoxModule,
} from 'devextreme-angular';
import {
  ModalButton,
  ModalEvent,
} from '../../../../core/components/modal/interface/modal.interface';
import { User } from '../../models/user.model';
import {
  cityData,
  genderData,
  countryData,
  userRoles,
  workplaceData,
} from '../../constants/users.constants';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';
import { ValueChangedEvent } from 'devextreme/ui/check_box';

export type FormMode = 'add' | 'edit';

@Component({
  selector: 'app-add-or-edit-user',
  templateUrl: './add-or-edit-user.component.html',
  styleUrls: ['./add-or-edit-user.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxButtonModule,
    DxTextAreaModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
  ],
})
export class AddOrEditUserComponent implements OnInit {
  @Input() buttons: ModalButton[] = [];
  @Input() mode: FormMode = 'add';
  @Input() user!: User;

  modalOutput = output<ModalEvent['data']>();
  private fb = inject(FormBuilder);

  roles = userRoles;
  genderData = genderData;
  workplaceData = workplaceData;
  countryData = countryData;
  cityData = cityData;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    gender: ['', Validators.required],
    workplace: ['', Validators.required],
    notes: [''],

    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    country: ['', Validators.required],
    city: ['', Validators.required],
    address: [''],

    username: ['', Validators.required],
    password: [''],
    role: this.fb.array([], Validators.required),
  });

  passwordMode: DxTextBoxTypes.TextBoxType = 'password';
  passwordButton: DxButtonTypes.Properties = {
    icon: 'eyeopen',
    stylingMode: 'text',
    onClick: () => {
      this.passwordMode = this.passwordMode === 'text' ? 'password' : 'text';
    },
  };

  ngOnInit(): void {
    if (this.mode === 'edit' && this.user) {
      this.form.patchValue(this.user);

      this.patchRoleValue();
    }
  }

  onBtnClick(type: ModalEvent['type']) {
    if (this.form.valid && type === 'save') {
      this.modalOutput.emit({
        type,
        data:
          this.mode === 'edit'
            ? { ...this.form.value, id: this.user?.id }
            : this.form.value,
      });
    } else {
      this.modalOutput.emit({ type });
    }
  }

  get roleArray(): FormArray {
    return this.form.get('role') as FormArray;
  }

  private patchRoleValue() {
    if (this.user) {
      const roles = this.user.role || [];
      this.roleArray.clear();
      roles.forEach((role) => {
        this.roleArray.push(this.fb.control(role));
      });
    }
  }

  isRoleChecked(role: string): boolean {
    return this.roleArray.value.includes(role);
  }

  onRoleCheckboxChange(ev: ValueChangedEvent, role: string) {
    if (ev.value) {
      this.roleArray.push(this.fb.control(role));
    } else {
      const index = this.roleArray.controls.findIndex(
        (ctrl) => ctrl.value === role
      );
      if (index !== -1) {
        this.roleArray.removeAt(index);
      }
    }
  }
}
