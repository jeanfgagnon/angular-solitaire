import { Component, OnInit } from '@angular/core';

import { CardDeckService } from './services/card-deck.service';
import { CardModel } from './common/card-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-solitaire';

  deck: CardModel[];
  now = new Date().toString();
  
  constructor(private cardDeckService: CardDeckService) {

  }

  ngOnInit(): void {
    this.deck = this.cardDeckService.shuffled(true);    
  }
}
