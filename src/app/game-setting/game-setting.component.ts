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
export class GameSettingComponent {
  allColors: TileColor[] = [
    { name: 'red', isActive: false },
    { name: 'yellow', isActive: false },
    { name: 'white', isActive: false },
    { name: 'blue', isActive: false },
    { name: 'green', isActive: false },
  ];
  btnColor: string = 'yellow';
  @Output() isBotBegin: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() tileColor: EventEmitter<Tile> = new EventEmitter<Tile>();
  @Output() start: EventEmitter<boolean> = new EventEmitter<boolean>();

  beginnerOfTheGame = (event: any) =>
    this.isBotBegin.emit(event.target.checked);

  changeTileColor = (name: Tile) => {
    this.allColors.forEach((element) => {
      if (element.name === name) {
        element.isActive = true;
        this.btnColor = name;
      } else element.isActive = false;
    });
    this.tileColor.emit(name);
  };
  startGame = () => {
    this.start.emit(true);
  };
}
type TileColor = {
  name: Tile;
  isActive: boolean;
};
type Tile = 'red' | 'yellow' | 'green' | 'white' | 'blue';
