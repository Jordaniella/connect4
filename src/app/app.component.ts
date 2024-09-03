import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'connect-4';
  bgColor = 'normal';
  allColors: string[] = [
    'green',
    'dark',
    'blue',
    'yellow-pink',
    'blue-pink',
    'normal',
  ];

  selectNewBgColor = (name: string) => {
    this.bgColor = name;
  };
  setNewBgColor(color: string) {
    this.bgColor = color;
  }
}
