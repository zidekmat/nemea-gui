import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorGuiComponent } from './supervisor-gui.component';

describe('SupervisorGuiComponent', () => {
  let component: SupervisorGuiComponent;
  let fixture: ComponentFixture<SupervisorGuiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorGuiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorGuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
