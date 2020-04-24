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

  @ViewChild('card') card: ElementRef;

  constructor(private renderer: Renderer2) { }

  public ngOnInit(): void {
    this.cardClass = this.Model.Open ? 'play-card selectable-card' : 'play-card';
  }

  ngAfterViewChecked(): void {
    this.positionMySelf();
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

  @Input() set Model(value: CardModel) {
    this._cardModel = value;
  }
  get Model(): CardModel {
    return this._cardModel;
  }
}
