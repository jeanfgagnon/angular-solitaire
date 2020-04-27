import { CardModel } from './card-model';

export default class DragInfo {
  public draggedFrom: 'deck' | 'col';
  public draggedFromIndex: number;
  public draggedTo: 'sky' | 'col';
  public draggedToIndex: number;
  public model: CardModel;
}