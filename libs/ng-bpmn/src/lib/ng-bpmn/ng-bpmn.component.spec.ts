import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgBpmnComponent } from './ng-bpmn.component';

describe('NgBpmnComponent', () => {
  let component: NgBpmnComponent;
  let fixture: ComponentFixture<NgBpmnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgBpmnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgBpmnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
