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
  @ViewChild('dragged') dragged: ElementRef;

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
    console.log('Drag Start Event ->', event);
    console.log('x %s y %s', event.source.element.nativeElement.offsetLeft, event.source.element.nativeElement.offsetTop);

    const containerData: Array<CardModel> = event.source.dropContainer.data;

    const indexFirstCard = containerData.findIndex(x => x.Id === event.source.data.Id);
    this.DraggedModel = [];
    let yPos = 0;

    for (let i = indexFirstCard; i < containerData.length; i++) {
      const model = containerData[i];
      model.Coords.yPos = yPos;
      model.Coords.zPos = 100 + i;
      yPos += this.ySpread;
      // this.DraggedModel.push(Object.assign({}, model));
      this.DraggedModel.push(JSON.parse(JSON.stringify(model)));
      this.DraggedModel.slice(-1)[0].Coords.xPos = 0;
      model.Visible = false;
    }
  }

  dragEnded(event: CdkDragEnd) {
    console.log('Drag End Event ->', event);
    const containerData: Array<CardModel> = event.source.dropContainer.data;
    containerData.map((x, index) => {
      if (event.source.dropContainer.id.startsWith('col')) {
        x.Coords.yPos = index * this.ySpread;
      }
      x.Coords.zPos = 100 + index;
      x.Visible = true;
    });
  }

  dragMoved(event: CdkDragMove) {
    // faire un bounding rect de la carte pour avoir sa hauteur et grandeur et
    // mette ces valeurs, divisé par deux, dans les deux lignes suivantes.
    const xPos = event.pointerPosition.x - 36;
    const yPos = event.pointerPosition.y - 50;
    if (this.dragged.nativeElement) {
      this.renderer.setStyle(this.dragged.nativeElement, 'transform', `translate3d(${xPos}px, ${yPos}px, 0)`);
      this.renderer.setStyle(this.dragged.nativeElement, 'cursor', 'move');
    }
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
