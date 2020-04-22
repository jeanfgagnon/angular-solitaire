import { Component, OnInit, Input } from '@angular/core';

import { CardModel } from 'src/app/common/card-model';

@Component({
  selector: 'app-card-color',
  templateUrl: './card-color.component.html',
  styleUrls: ['./card-color.component.scss']
})
export class CardColorComponent implements OnInit {

  private _cardModel: CardModel;

  public valueColorClass: string;
  public iconSrc: string;

  constructor() { }

  ngOnInit(): void {
    this.iconSrc = "assets/" + this.Model.FaceName + ".png";
    this.valueColorClass = (this.Model.FaceName === 'diamond' || this.Model.FaceName === 'heart') ? 'red' : 'black';
  }

  // helpers

  public figurePath(figureVal: string): string {
    return `assets/${figureVal.toLowerCase()}-${this.Model.FaceName}.png`;
  }

  // properties

  get Value(): string {
    let rv = '';
    switch (this.Model.Value) {
      case 1: rv = 'A'; break;
      case 11: rv = 'J'; break;
      case 12: rv = 'Q'; break;
      case 13: rv = 'K'; break;
      default:
        rv = this.Model.Value.toString();
        break;
    }

    return rv;
  }

  @Input() set Model(value: CardModel) {
    this._cardModel = value;
  }
  get Model(): CardModel {
    return this._cardModel;
  }

}
