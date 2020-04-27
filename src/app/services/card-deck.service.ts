import { Injectable } from '@angular/core';

import { CardModel } from '../common/card-model';
import { CardFaces } from '../common/card-faces.enum';
import { CardCoords } from '../common/card-coords';

@Injectable({
  providedIn: 'root'
})
export class CardDeckService {

  private _deck: CardModel[];

  public deckSize = 52;
  public valueCount = 13;
  public faceNames: string[] = Object.keys(CardFaces).filter(k => typeof CardFaces[k as any]);

  constructor() {
    this.initDeck();
  }

  // public methods

  public shuffled(init: boolean): CardModel[] {

    init && this.initDeck();

    for (let i = this._deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._deck[i], this._deck[j]] = [this._deck[j], this._deck[i]];
    }
    
    return this._deck;
  }

  // create a card from scratch
  public dumb(value: number, face: CardFaces, open: boolean, x: number, y: number, z: number): CardModel {
    const card = new CardModel();

    card.Coords = new CardCoords();
    card.Value = value;
    card.Face = face;
    card.Open = open;
    card.Coords.xPos = x;
    card.Coords.yPos = y;
    card.Coords.zPos = z;

    return card;
  }

  // private code

  private initDeck(): void {
    this._deck = [];
    let id = 1000;
    this.faceNames.map(faceName => {
      for (let i = 0; i < this.valueCount; i++) {
        const card = new CardModel();

        card.Id = ++id;
        card.Face = CardFaces[faceName];
        card.Value = i + 1;
        card.Open = false;

        card.Coords = new CardCoords();
        card.Coords.xPos = card.Coords.yPos = -1;

        this._deck.push(card);
      };
    });
  }

  // properties

  public get Deck(): CardModel[] {
    return this._deck;
  }
}
