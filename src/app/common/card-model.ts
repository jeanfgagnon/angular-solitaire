import { CardFaces } from './card-faces.enum';
import { CardCoords } from './card-coords';

export class CardModel {
  public Id: number;
  public Face: CardFaces;
  public Value: number;
  public Open: boolean;
  public Visible: boolean;
  public Coords: CardCoords;
}
