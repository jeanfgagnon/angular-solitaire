import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { CardDeckService } from 'src/app/services/card-deck.service';
import { CardModel } from 'src/app/common/card-model';
import { CardFaces } from 'src/app/common/card-faces.enum';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  public colPiles: Array<Array<CardModel>> = [[]];
  public skyPiles: Array<Array<CardModel>> = [[]];
  // distance between card when spreaded on table
  public xSpread = 20;
  public ySpread = 20;

  public dumbCard: CardModel;
  public zIndexBase = 100;

  deck: CardModel[];

  @ViewChild('col1') col1: ElementRef;

  constructor(private cardDeckService: CardDeckService) { }

  ngOnInit(): void {
    this.deck = this.cardDeckService.shuffled(true);
    this.dumbCard = this.cardDeckService.dumb(0, CardFaces.Club, false, 0, 0, 0);
    this.prepPiles();
  }

  // event handlers

  drop(event: CdkDragDrop<string[]>) {
    console.dir(event);
  }
  
  // private code

  private prepPiles(): void {
    this.prepColPiles();
    this.prepSkyPiles();
  }

  // prepare the 4 sky piles
  private prepSkyPiles(): void {
    for (let i = 0; i < 4; i++) {
      this.skyPiles.push(new Array<CardModel>());
      this.skyPiles[i] = [];
    }
  }

  // put some cards into the 7 column piles
  private prepColPiles(): void {
    let deckIndex = this.deck.length - 1;
    let pileIndex: number, cardIndex: number;
    for (pileIndex = 1; pileIndex <= 7; pileIndex++) {
      this.colPiles.push(new Array<CardModel>());
      this.colPiles[pileIndex - 1] = [];
      for (cardIndex = 0; cardIndex < pileIndex; cardIndex++) {
        if (cardIndex === (pileIndex - 1)) {
          // turn top card
          this.deck[deckIndex].Open = true;
        }
        
        this.deck[deckIndex].Coords.xPos = 0;

        if (cardIndex > 0) {
          this.deck[deckIndex].Coords.yPos = this.ySpread * cardIndex;
          this.deck[deckIndex].Coords.zPos = this.zIndexBase + cardIndex;
        }
        else {
          this.deck[deckIndex].Coords.yPos = 0;
          this.deck[deckIndex].Coords.zPos = this.zIndexBase;
        }
        this.colPiles[pileIndex - 1].push(this.deck[deckIndex--]);
      }
    }
  }

  // properties
}
