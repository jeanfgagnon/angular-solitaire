import { Component, OnInit, Input, Renderer2, AfterViewChecked, ViewChild, ElementRef, ɵisBoundToModule__POST_R3__ } from '@angular/core';

import { CardModel } from 'src/app/common/card-model';
import { CdkDragStart, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, AfterViewChecked {

  // input? in service?
  private ySpread = 20;

  private _cardModel: CardModel;
  private _draggedModel: CardModel[] = [];

  public cardClass: string;

  @ViewChild('card') card: ElementRef;

  constructor(private renderer: Renderer2) { }

  public ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    if (this.Model && this.Model.Value > 0) {
      this.positionMySelf();
    }
  }

  // event handlers

  public dragStarted(event: CdkDragStart) {
    console.log('Drag Start Event ->', event)
    const containerData: Array<CardModel> = event.source.dropContainer.data;

    const indexFirstCard = containerData.findIndex(x => x.Id === event.source.data.Id);
    this.DraggedModel = [];
    let yPos = 0;

    for (let i = indexFirstCard; i < containerData.length; i++) {
      const model = containerData[i];
      model.Coords.yPos = yPos;
      model.Coords.zPos = 2000 + i;
      yPos += this.ySpread;
      this.DraggedModel.push(Object.assign({}, model));
      model.Visible = false;
    }
  }

  dragEnded(event: CdkDragEnd) {
    console.log('Drag End Event ->', event);
    const containerData: Array<CardModel> = event.source.dropContainer.data;
    containerData.map((x, index) => {
      x.Coords.yPos = index * this.ySpread;
      x.Coords.zPos = 100 + index;
      x.Visible = true;
    });
  }

  dragMoved(event: CdkDragMove) {
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

  set DraggedModel(value: CardModel[]) {
    this._draggedModel = value;
  }
  get DraggedModel(): CardModel[] {
    return this._draggedModel;
  }

  @Input() set Model(value: CardModel) {
    this._cardModel = value;
  }
  get Model(): CardModel {
    return this._cardModel;
  }
}
