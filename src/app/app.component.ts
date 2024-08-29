import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass],
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
