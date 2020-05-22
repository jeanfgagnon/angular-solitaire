import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

import { CardDeckService } from 'src/app/services/card-deck.service';
import { CardModel } from 'src/app/common/card-model';
import { CardFaces } from 'src/app/common/card-faces.enum';
import { CdkDragDrop, CdkDropList, transferArrayItem } from '@angular/cdk/drag-drop';
import DragInfo from 'src/app/common/drag-info';
import { mapToMapExpression } from '@angular/compiler/src/render3/util';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  public colPiles: Array<Array<CardModel>> = [[]];
  public skyPiles: Array<Array<CardModel>> = [[]];
  public closedPile: Array<CardModel> = [];
  public openPile: Array<CardModel> = [];

  // how many card to take from closed deck
  public cardToFlip = 3;

  // distance between card when spreaded on table
  public xSpread = 15;
  public ySpread = 20;

  public zIndexBase = 100; // pass this to cards?

  deck: CardModel[];

  @ViewChild('col1') col1: ElementRef;

  constructor(private cardDeckService: CardDeckService) { }

  ngOnInit(): void {
    this.deck = this.cardDeckService.shuffled(true);
    this.prepPiles();
  }

  // event handlers

  public drop(event: CdkDragDrop<string[]>) {
    console.log('board-drop-event');
    const dragInfo: DragInfo = this.getDraggedInfo(event);
    if (this.moveIsValid(dragInfo)) {
      //      console.log('move is valid model');
      this.moveCardModel(dragInfo);
      if (dragInfo.draggedFrom === 'deck') {
        this.spreadOpenDeck(2);
      }
      if (dragInfo.draggedTo === 'sky') {
        dragInfo.destPile.slice(-1)[0].Draggable = false;
      }
    }
  }

  public closedPileClick(event: Event): void {
    if (this.closedPile.length > 0) {
      this.flipCards();
      this.spreadOpenDeck(2);
    }
  }

  public reloadClick(e: Event): void {
    e.cancelBubble = true;
    let card: CardModel;
    let j = this.openPile.length - 1;
    this.closedPile = new Array<CardModel>(this.openPile.length);

    for (let i = 0; i < this.openPile.length; i++) {
      card = this.openPile[i];
      card.Coords.xPos = 0;
      card.Open = false;
      this.closedPile[j--] = card;
    }
    this.openPile = [];
  }

  public newGameClick(e: Event): void {
    this.colPiles = [[]];
    this.skyPiles = [[]];
    this.closedPile = [];
    this.openPile = [];

    this.deck = this.cardDeckService.shuffled(true);
    this.prepPiles();
    e.preventDefault();
  }

  public pileDoubleClick(pile: CardModel[]) {
    if (pile.length > 0) {
      this.flyToSky(pile);
    }
  }

  // private code

  private flyToSky(fromPile: CardModel[]) {
    const model = fromPile.slice(-1)[0];
    let i: number;
    let move = false;
    for (i = 0; i < 4; i++) {
      if (this.skyPiles[i].length === 0) {
        if (model.Value === 1) {
          move = true;
          //this.skyPiles[i].push(fromPile.splice(-1)[0]);
          break;
        }
      }
      else {
        if (model.Face === this.skyPiles[i][0].Face) {
          if (model.Value - 1 === this.skyPiles[i].slice(-1)[0].Value) {
            move = true;
            //this.skyPiles[i].push(fromPile.splice(-1)[0]);
            break;
          }
        }
      }
    }
    if (move) {
      this.skyPiles[i].push(fromPile.splice(-1)[0]);
      let skyModel = this.skyPiles[i].slice(-1)[0];
      skyModel.Coords.yPos = 0;
      skyModel.Coords.xPos = 0;
      skyModel.Draggable = false;

      this.skyPiles[i].map((model, index) => {
        model.Coords.zPos = this.zIndexBase + index;
      });

      if (fromPile.length > 0) {
        fromPile.slice(-1)[0].Open = true;
        fromPile.slice(-1)[0].Draggable = true;
      }
    }
  }

  // spread open deck top card to show top 'nbCard' + 1
  private spreadOpenDeck(nbCard: number): void {
    if (this.openPile.length > 1) {
      let max = nbCard;

      if (this.openPile.length <= max) {
        max = this.openPile.length - 1;
      }
      this.openPile.slice(-max).map((model, index) => {
        model.Coords.xPos = this.xSpread * (index + 1);
        model.Draggable = index === max - 1;
      });
    }
    else if (this.openPile.length === 1) {
      this.openPile[0].Draggable = true;
    }
  }

  // flip 'cardToFlip' cards from closedPile to openPile
  private flipCards(): void {
    let nb = this.cardToFlip;

    if (this.closedPile.length < nb) {
      nb = this.closedPile.length;
    }

    // align cards in openpile
    this.openPile.map((card, index) => {
      card.Coords.xPos = 0;
      card.Coords.zPos = this.zIndexBase + index;
      card.Draggable = false;
    });

    let flipped = this.closedPile.splice(-nb);

    let spreadIndex = 0;
    for (let i = nb - 1; i >= 0; i--) {
      flipped[i].Open = true;
      flipped[i].Draggable = false;
      flipped[i].Coords.zPos = this.zIndexBase + this.openPile.length + 1;
      this.openPile.push(flipped[i]);
    }
  }

  private moveCardModel(dragInfo: DragInfo) {
    const models = dragInfo.fromPile.splice(dragInfo.cardIndex);

    this.openLastCard(dragInfo.fromPile);

    if (dragInfo.draggedTo === 'col') {
      for (let i = 0; i < models.length; i++) {
        dragInfo.destPile.push(models[i]);
      }

      dragInfo.destPile.map((model, cardIndex) => {
        model.Coords.xPos = 0;
        model.Coords.yPos = this.ySpread * cardIndex;
        model.Coords.zPos = this.zIndexBase + cardIndex;
        model.Visible = true;
      });
    }
    else if (dragInfo.draggedTo === 'sky') {
      models[0].Coords.yPos = 0;
      models[0].Coords.xPos = 0;
      if (dragInfo.destPile.length === 0) {
        models[0].Coords.zPos = this.zIndexBase;
      }
      else {
        models[0].Coords.zPos = this.zIndexBase + dragInfo.destPile.length;
      }

      dragInfo.destPile.push(models[0]);
    }
  }

  private openLastCard(fromPile: CardModel[]): void {
    if (fromPile && fromPile.length > 0) {
      fromPile[fromPile.length - 1].Open = true;
    }
  }

  private getDestPile(draggedTo: string, pileIndex: number): CardModel[] {
    let destPile: CardModel[];

    if (draggedTo === 'col') {
      destPile = this.colPiles[pileIndex];
    }
    else if (draggedTo === 'sky') {
      destPile = this.skyPiles[pileIndex];
    }

    return destPile;
  }

  private getFromPile(draggedFrom: string, pileIndex: number): CardModel[] {
    let fromPile: CardModel[];

    if (draggedFrom === 'col') {
      fromPile = this.colPiles[pileIndex];
    }
    else {
      fromPile = this.openPile;
    }

    return fromPile
  }

  private moveIsValid(dragInfo: DragInfo): boolean {
    let rv = false;
    let move = false;
    // we can move from deck to col or sky
    // we can move from col to col or sky
    if (dragInfo.draggedFrom === 'col' && dragInfo.draggedTo === 'col') {
      move = (dragInfo.draggedFromIndex !== dragInfo.draggedToIndex);
    }
    else if (dragInfo.draggedFrom === 'col' && dragInfo.draggedTo === 'sky') {
      move = true;
    }
    else if (dragInfo.draggedFrom === 'deck' && (dragInfo.draggedTo === 'col' || dragInfo.draggedTo === 'sky')) {
      move = true;
    }

    if (move) {
      if (dragInfo.draggedTo === 'sky') {
        rv = this.validateSkyMove(dragInfo);
      }
      else {
        rv = this.validateColMove(dragInfo);
      }
    }

    return rv;
  }

  validateColMove(dragInfo: DragInfo): boolean {
    let rv = false;

    if (dragInfo.destPile.length === 0) {
      if (dragInfo.model.Value === 13) {
        rv = true;
      }
    }
    else {
      const topCard = dragInfo.destPile.slice(-1)[0];
      if (this.getFaceColor(topCard.Face) != this.getFaceColor(dragInfo.model.Face)) {
        if (topCard.Value - 1 === dragInfo.model.Value) {
          rv = true;
        }
      }
    }

    return rv;
  }

  private validateSkyMove(dragInfo: DragInfo): boolean {
    let rv = false;

    if (dragInfo.destPile.length === 0) {
      if (dragInfo.model.Value === 1) {
        rv = true;
      }
    }
    else {
      const topCard = dragInfo.destPile.slice(-1)[0];
      if (topCard.Face === dragInfo.model.Face && topCard.Value === dragInfo.model.Value - 1) {
        rv = true;
      }
    }

    return rv;
  }

  private getFaceColor(face: CardFaces): 'red' | 'black' {
    if (face === CardFaces.Club || face === CardFaces.Spade) {
      return 'black';
    }
    else {
      return 'red';
    }
  }

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
    rv.fromPile = this.getFromPile(rv.draggedFrom, rv.draggedFromIndex);

    // to
    if (e.container.id.startsWith('col')) {
      rv.draggedTo = 'col';
    }
    else if (e.container.id.startsWith('sky')) {
      rv.draggedTo = 'sky';
    }

    rv.draggedToIndex = this.getIndexFromId(e.container.id);
    rv.destPile = this.getDestPile(rv.draggedTo, rv.draggedToIndex);

    rv.model = e.item.data;
    rv.cardIndex = rv.fromPile.findIndex(x => x.Id === rv.model.Id);
    rv.nbCard = rv.fromPile.length - rv.cardIndex;

    return rv;
  }

  private getIndexFromId(id: string): number {
    let rv = -1;
    try {
      if (id.startsWith('col') || id.startsWith('sky')) {
        rv = parseInt(id.substr(3)) - 1;
      }
      else {
        rv = parseInt(id.substr(4)) - 1;
      }
    }
    catch {
      console.log('ID of unknown type (%s)', id);
    }

    return rv;
  }

  private prepPiles(): void {
    this.prepSkyPiles();
    this.prepColPiles();

    // 24 card left
    for (let cardIndex = 0; cardIndex < 24; cardIndex++) {
      this.closedPile.push(this.deck[cardIndex]);
    }
  }

  // private pileDump(title: string, pile: CardModel[]) {
  //   let dump = '';
  //   pile.map(model => {
  //     dump += `[${model.Value}-${model.Face.toString().substr(0,1)}]`;
  //   });
  //   console.group('Pile Dump --' + title);
  //   console.log(dump);
  //   console.groupEnd();
  // }

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
