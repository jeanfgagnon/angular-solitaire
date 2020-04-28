import { CardModel } from './card-model';

export default class DragInfo {
  public draggedFrom: 'deck' | 'col';
  public draggedFromIndex: number;
  public draggedTo: 'sky' | 'col';
  public draggedToIndex: number;
  public model: CardModel;
  public cardIndex: number;           // index of card to move in from pile
  public nbCard: number;              // how many card we are moving
  public fromPile: Array<CardModel>;
  public destPile: Array<CardModel>;
}