import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { CardDeckService } from 'src/app/services/card-deck.service';
import { CardModel } from 'src/app/common/card-model';
import { CardFaces } from 'src/app/common/card-faces.enum';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import DragInfo from 'src/app/common/drag-info';

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

  public drop(event: CdkDragDrop<string[]>) {
    // first we can't drag from sky
    const dragInfo: DragInfo = this.getDraggedInfo(event);

    console.log('from %s', JSON.stringify(dragInfo));
  }

  // private code

  private getDraggedInfo(e: CdkDragDrop<string[], string[]>): DragInfo {
    const rv = new DragInfo();

    // from
    if (e.previousContainer.id.startsWith('col')) {
      rv.draggedFrom = 'col';
    }
    else if (e.previousContainer.id.startsWith('deck')) {
      rv.draggedFrom = 'deck';
    }
    rv.draggedFromIndex = this.getIndexFromId(e.previousContainer.id);

    // to
    if (e.container.id.startsWith('col')) {
      rv.draggedTo = 'col';
    }
    else if (e.container.id.startsWith('sky')) {
      rv.draggedTo = 'sky';
    }
    rv.draggedToIndex = this.getIndexFromId(e.container.id);

    return rv;
  }

  getIndexFromId(id: string): number {
    let rv = -1;
    try {
      if (id.startsWith('col') || id.startsWith('sky')) {
        rv = parseInt(id.substr(3));
      }
      else {
        rv = parseInt(id.substr(4));
      }
    }
    catch {
      console.log('ID of unknown type (%s)', id);
    }

    return rv;
  }

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
