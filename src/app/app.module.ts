import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { BoardComponent } from './components/board/board.component';
import { CardColorComponent } from './components/card-color/card-color.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    BoardComponent,
    CardColorComponent
  ],
  imports: [
    BrowserModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
