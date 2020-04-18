import { Component, OnInit } from '@angular/core';

import { CardDeckService } from 'src/app/services/card-deck.service';
import { CardModel } from 'src/app/common/card-model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  deck: CardModel[];

  constructor(private cardDeckService: CardDeckService) { }

  ngOnInit(): void {
    this.deck = this.cardDeckService.shuffled(true);    
  }

}
