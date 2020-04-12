import { Injectable } from '@angular/core';

import { CardModel } from '../common/card-model';
import { CardFaces } from '../common/card-faces.enum';

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

  // private code

  initDeck(): void {
    this._deck = [];

    this.faceNames.map(faceName => {
      for (let i = 0; i < this.valueCount; i++) {
        const card = new CardModel();
        
        card.Face = CardFaces[faceName];
        card.Value = i + 1;
        card.Open = false;

        this._deck.push(card);
      };
    });
  }

  // properties

  public get Deck(): CardModel[] {
    return this._deck;
  }
}
