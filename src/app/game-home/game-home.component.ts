import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-game-home',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './game-home.component.html',
  styleUrl: './game-home.component.scss'
})
export class GameHomeComponent {

}
