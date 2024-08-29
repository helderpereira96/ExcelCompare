import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComparadorExcelComponent } from "./components/comparador-excel/comparador-excel.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ComparadorExcelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'excel';
}
