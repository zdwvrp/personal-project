import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtgLifeCounterComponent } from './mtg-life-counter.component';

describe('MtgLifeCounterComponent', () => {
  let component: MtgLifeCounterComponent;
  let fixture: ComponentFixture<MtgLifeCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MtgLifeCounterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MtgLifeCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
