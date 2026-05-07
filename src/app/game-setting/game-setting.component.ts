import { Component, Output, EventEmitter } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NgClass } from '@angular/common';
import { AiDifficulty, Tile } from '../../utils/minimax';

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
  difficultyLevels: DifficultyOption[] = [
    {
      value: 'easy',
      label: 'Débutant',
      description: 'Le bot joue au hasard pour découvrir le jeu.',
    },
    {
      value: 'medium',
      label: 'Intermédiaire',
      description: 'Le bot anticipe quelques coups et bloque les menaces directes.',
    },
    {
      value: 'hard',
      label: 'Difficile',
      description: 'Le bot utilise une recherche plus profonde avec élagage alpha-bêta.',
    },
    {
      value: 'expert',
      label: 'Expert',
      description: 'Le bot calcule plus loin pour créer et éviter les pièges.',
    },
  ];
  btnColor: string = 'yellow';
  selectedDifficulty: AiDifficulty = 'hard';

  @Output() isBotBegin: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() tileColor: EventEmitter<Tile> = new EventEmitter<Tile>();
  @Output() difficultyChange: EventEmitter<AiDifficulty> =
    new EventEmitter<AiDifficulty>();
  @Output() start: EventEmitter<boolean> = new EventEmitter<boolean>();

  beginnerOfTheGame = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.isBotBegin.emit(input.checked);
  };

  changeTileColor = (name: Tile) => {
    this.allColors.forEach((element) => {
      if (element.name === name) {
        element.isActive = true;
        this.btnColor = name;
      } else element.isActive = false;
    });
    this.tileColor.emit(name);
  };

  changeDifficulty = (difficulty: AiDifficulty) => {
    this.selectedDifficulty = difficulty;
    this.difficultyChange.emit(difficulty);
  };

  startGame = () => {
    this.start.emit(true);
  };
}

type TileColor = {
  name: Tile;
  isActive: boolean;
};

type DifficultyOption = {
  value: AiDifficulty;
  label: string;
  description: string;
};
