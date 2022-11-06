import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { fromEvent, startWith } from "rxjs";

@Component({
  selector: 'app-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ChipInputComponent
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class ChipInputComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;
  @ViewChild('dropdownEl') dropdownEl?: ElementRef<HTMLDivElement>;
  @ViewChildren('optionEl') optionEls?: QueryList<ElementRef<HTMLDivElement>>;

  @Input() items?: string[];
  @Input() placeholder = '';

  form = new FormGroup({
    searchText: new FormControl('')
  })
  filteredItems?: string[];

  value?: string[] = [];

  touched = false;
  disabled = false;

  isOpen = false;
  isFocus = false;

  hoverIdx = 0;

  constructor(
    private el: ElementRef<HTMLElement>,
    private cdRef: ChangeDetectorRef
  ) {
  }

  @HostBinding() get class(): string {
    const classes = {
      'chip-input': true,
      'chip-input--opened': this.isOpen,
      'chip-input--focused': this.isFocus && !this.isOpen
    };
    return Object.entries(classes).filter(([_, value]) => value).map(([key]) => key).join(' ');
  };

  ngAfterViewInit() {
    fromEvent(document, 'click').subscribe(event => {
      if (!this.el?.nativeElement.contains(event.target as HTMLElement) && !(event.target as HTMLElement).className.startsWith('chip-input__clear')) {
        this.setIsOpen(false);
      }
    });
    this.form.controls.searchText.valueChanges.pipe(startWith('')).subscribe(value => {
      this.filteredItems = value ? this.items?.filter(x => x.toLowerCase().includes(value.toLowerCase())) : this.items;
      if (this.isOpen) {
        this.setHoverIdx(0);
      }
      if (value) {
        this.setIsOpen(true);
      }
      this.cdRef.detectChanges();
    });

    this.setValue(this.value);
  }

  onChange = (value?: string[]) => {
  };

  onTouched = () => {
  };

  writeValue(value?: string[]) {
    this.value = value || [];
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  clear(): void {
    this.setValue([]);
    this.form.controls.searchText.setValue('');
    this.inputEl?.nativeElement.focus();
  }

  toggleItem(item: string): void {
    if (this.value?.includes(item)) {
      this.setValue((this.value.filter(x => x !== item)));
    } else {
      this.setValue([...(this.value || []), item]);
    }
    this.inputEl?.nativeElement.focus();
  }

  setIsOpen(isOpen = !this.isOpen) {
    this.isOpen = isOpen;
    if (!this.isOpen) {
      this.setHoverIdx(-1);
      this.form.controls.searchText.setValue('');
    }
  }

  hoverPrev() {
    if (!this.isOpen) {
      return
    }
    const idx = this.hoverIdx === 0 ? (this.filteredItems?.length || 1) - 1 : this.hoverIdx - 1;
    this.setHoverIdx(idx % (this.filteredItems?.length || 0))
  }

  hoverNext() {
    this.setIsOpen(true);
    this.setHoverIdx((this.hoverIdx + 1) % (this.filteredItems?.length || 0))
  }

  setHoverIdx(idx: number): void {
    this.hoverIdx = idx;
    if (this.isOpen) {
      const el = this.optionEls?.get(this.hoverIdx)?.nativeElement;
      const dropdownEl = this.dropdownEl?.nativeElement;
      if (el && dropdownEl) {
        if (
          el.offsetTop > dropdownEl.scrollTop + dropdownEl.offsetHeight ||
          el.offsetTop < dropdownEl.scrollTop
        ) {
          dropdownEl.scrollTo(0, el.offsetTop);
        } else if (el.offsetTop === dropdownEl.scrollTop + dropdownEl.offsetHeight) {
          dropdownEl.scrollTo(0, dropdownEl.scrollTop + el.offsetHeight);
        }
      }
    }
  }

  toggleCurrent() {
    if (this.isOpen && this.filteredItems && this.hoverIdx > -1) {
      this.toggleItem(this.filteredItems[this.hoverIdx])
    }
  }

  removeLast() {
    if (!this.form.controls.searchText.value) {
      this.value?.pop();
      this.setValue(this.value);
    }
  }

  private setValue(value?: string[]): void {
    this.markAsTouched();
    this.value = value || [];
    this.onChange(this.value)
  }
}
