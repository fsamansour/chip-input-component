import { Component } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  programmingLanguages: string[] = require('../assets/programming-languages.json');
  form = new FormGroup({
    chips: new FormControl()
  });
}
