import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgCmmnComponent } from './ng-cmmn.component';

describe('NgCmmnComponent', () => {
  let component: NgCmmnComponent;
  let fixture: ComponentFixture<NgCmmnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgCmmnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgCmmnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
