import { CardFaces } from './card-faces.enum';

export class CardModel {
  public Face: CardFaces;
  public Value: number;
  public Open: boolean;

  public get FaceName(): string {
    return this.Face.toString();
  }
}
