import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddDeviceItemsComponent } from "./add-device-items.component";

describe("AddItemsComponent", () => {
 let component: AddDeviceItemsComponent;
 let fixture: ComponentFixture<AddDeviceItemsComponent>;

 beforeEach(async(() => {
  TestBed.configureTestingModule({
   declarations: [AddDeviceItemsComponent],
  }).compileComponents();
 }));

 beforeEach(() => {
  fixture = TestBed.createComponent(AddDeviceItemsComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
 });

 it("should create", () => {
  expect(component).toBeTruthy();
 });
});
