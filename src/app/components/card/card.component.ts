import { Component, OnInit, Input, Renderer2, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';

import { CardModel } from 'src/app/common/card-model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, AfterViewChecked {

  private _cardModel: CardModel;

  public cardClass: string;
  public iconSrc: string;
  public valueColorClass: string;

  @ViewChild('card') card: ElementRef;

  constructor(private renderer: Renderer2) { }

  public ngOnInit(): void {
    this.cardClass = this.Model.Open ? 'play-card selectable-card' : 'play-card';
    this.iconSrc = "assets/" + this.Model.FaceName + ".png";
    this.valueColorClass = (this.Model.FaceName === 'diamond' || this.Model.FaceName === 'heart') ? 'red' : 'black';
  }

  ngAfterViewChecked(): void {
    this.positionMySelf();
  }
  // helpers

  public figurePath(figureVal: string): string {
    return `assets/${figureVal.toLowerCase()}-${this.Model.FaceName}.png`;
  }

  // private code

  private positionMySelf(): void {
    if (this.Model.Coords.yPos >= 0 && this.Model.Coords.xPos >= 0) {
      this.renderer.setStyle(this.card.nativeElement, 'top', (this.Model.Coords.yPos) + 'px');
      this.renderer.setStyle(this.card.nativeElement, 'left', (this.Model.Coords.xPos) + 'px');
      this.renderer.setStyle(this.card.nativeElement, 'z-index', (this.Model.Coords.zPos));
    }
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
