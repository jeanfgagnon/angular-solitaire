import { CardFaces } from './card-faces.enum';
import { CardCoords } from './card-coords';

export class CardModel {
  public Face: CardFaces;
  public Value: number;
  public Open: boolean;
  public Coords: CardCoords;
  
  public get FaceName(): string {
    return this.Face.toString();
  }
}
