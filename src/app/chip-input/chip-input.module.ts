import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipInputComponent } from './chip-input/chip-input.component';
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    ChipInputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    ChipInputComponent
  ]
})
export class ChipInputModule {
}
