import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardColorComponent } from './card-color.component';

describe('CardColorComponent', () => {
  let component: CardColorComponent;
  let fixture: ComponentFixture<CardColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
