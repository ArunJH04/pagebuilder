import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PlanningService } from "../../planning/planning.service";
import * as $ from "jquery";
import { ServiceService } from "../../service.service";
import { Subscription } from "rxjs";
import { NotifierService } from "angular-notifier";

@Component({
 selector: "app-list-items",
 templateUrl: "./list-items.component.html",
 styleUrls: ["./list-items.component.css"],
})
export class ListItemsComponent implements OnInit {
 rightDivShow: boolean = false;
 leftDivShow: boolean = true;
 messageReceived: any;
 private subscriptionName: Subscription;
 private notifier: NotifierService;
 selectedContextElemID: any;

 constructor(private router: Router, private route: ActivatedRoute, private planningService: PlanningService, private appService: ServiceService, notifier: NotifierService) {
  this.notifier = notifier;
  this.subscriptionName = this.appService.getUpdate().subscribe((message) => {
   //message contains the data sent from service
   this.messageReceived = message.text;
   this.pageName = this.messageReceived.pageName;
   this.pageId = this.messageReceived.pageID;
   this.SelectedIDs = [];
   console.log(this.pageName, this.pageId);
   this.planningService.getDeviceList(this.pageName).subscribe((data: any) => {
    this.allDevices = data.Details;
   });
  });
 }

 allDevices: any = [];
 pageId;
 pageName;
 searchText;
 SelectedIDs: any = [];

 ngOnInit() {}

 routeToAddDetails() {
  let url = "/planning/add-items/" + this.pageName + "/" + this.pageId + "";
  console.log(url);
  return url;
  // this.router.navigate([
  //   "/planning/add-items",
  //   { pageName: this.pageName, id: this.pageId },
  // ]);
 }

 selectID(event: any) {
  let valueExists;
  let id = this.SelectedIDs.indexOf(event.target.id);
  if (this.SelectedIDs.indexOf(event.target.id) !== -1) {
   valueExists = true;
  } else {
   valueExists = false;
  }
  if (event.target.checked && valueExists === false) {
   this.SelectedIDs.push(event.target.id);
  } else {
   this.SelectedIDs.splice(id, 1);
  }

  localStorage.setItem("selectedIds", JSON.stringify(this.SelectedIDs));
  // console.log(this.SelectedIDs);
 }

 deleteSelected() {
  console.log("called delete");

  this.SelectedIDs.forEach(function (obj) {
   this.allDevices = this.allDevices.filter((item) => item.id !== obj.id);
  });
 }

 leftDivClick() {
  this.rightDivShow = true;
  this.leftDivShow = false;
 }

 filterValues(event) {
  this.searchText = event.target.value;
 }
 getRecord(event: any, elements) {
  this.selectedContextElemID = Number(event.target.id);
  console.log(elements.id);
  console.log(elements.type);
  // let elementDetails = {
  //   pageType: elements.type,
  //   elementID: elements.id,
  //   pageName: this.pageName,
  //   pageID: this.pageId,
  // };
  let elementDetails = {
   pageType: elements.type,
   elementID: elements.id,
   selectedContextID: this.selectedContextElemID,
   // selectedContextValue: this.selectedContextElemValue,
   pageName: this.pageName,
   pageID: this.pageId,
  };
  this.sendElementMessage(elementDetails);
  localStorage.setItem("pageType", elementDetails.pageType);
  localStorage.setItem("elementID", elementDetails.elementID);
  localStorage.setItem("pageName", this.pageName);
  localStorage.setItem("pageID", this.pageId);
 }

 sendElementMessage(elementDetails): void {
  // send message to subscribers via observable subject
  this.appService.sendUpdate(elementDetails);
 }
}
