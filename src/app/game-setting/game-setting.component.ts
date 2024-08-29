import { Component, Output, EventEmitter } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-game-setting',
  standalone: true,
  imports: [HeaderComponent, NgClass],
  templateUrl: './game-setting.component.html',
  styleUrl: './game-setting.component.scss',
})
export class GameSettingComponent {}
