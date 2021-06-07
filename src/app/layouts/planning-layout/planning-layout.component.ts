import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as $ from "jquery";
import { PlanningService } from "src/app/planning/planning.service";
import { ServiceService } from "../../service.service";
import { Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { NotifierService } from "angular-notifier";

@Component({
 selector: "app-planning-layout",
 templateUrl: "./planning-layout.component.html",
 styleUrls: ["./planning-layout.component.css"],
})
export class PlanningLayoutComponent implements OnInit {
 pageNa;
 pageI;
 rightDivShow: boolean = false;
 leftDivShow: boolean = true;
 private subscriptionName: Subscription;
 listItemMsgReceived: any;
 messageReceived: any;
 private notifier: NotifierService;

 constructor(private router: Router, private planningService: PlanningService, private appService: ServiceService, notifier: NotifierService) {
  this.subscriptionName = this.appService.getUpdate().subscribe((message) => {
   //message contains the data sent from service
   this.messageReceived = message.text;
   this.pageName = this.messageReceived.pageName;
   this.pageId = this.messageReceived.pageID;

   this.listItemMsgReceived = message.text;
   this.pageType = this.listItemMsgReceived.pageType;
   if (this.pageType == undefined) this.pageType = this.pageName;
   this.elementID = this.listItemMsgReceived.elementID;
   console.log("planninglayout");
   console.log("this.pageType::" + this.pageType);
   console.log("this.elementID::" + this.elementID);
   if (this.elementID != undefined) {
    this.GetallDataByID(this.elementID, this.pageType);
   }
  });
  this.notifier = notifier;
 }
 pageId;
 pageName;
 pageType;
 elementID;
 menuList;
 deviceDtls;
 showDiv1: boolean = false;
 showDiv2: boolean = true;

 ngOnInit() {
  this.planningService.getMenuItems().subscribe((data: any) => {
   this.menuList = data.pages_list[0].pages;
   localStorage.setItem("pageName", JSON.stringify(this.menuList[0].pageName));
   localStorage.setItem("pageID", this.menuList[0].pageId);
  });
 }

 sendMessage(pageDetails): void {
  // send message to subscribers via observable subject
  this.appService.sendUpdate(pageDetails);
 }

 getImageUrl(ele) {
  return "../../../assets/menu-icon-" + ele.pageName + ".png";
 }

 navigateToMenu(element) {
  let pageID = element.pageId;
  let pageName = element.pageName;
  this.router.navigate(["/planning/list-items", { pageName: pageName, pageID: pageID }]);
 }

 setValue(element) {
  let pageDetails = { pageName: element.pageName, pageID: element.pageId };
  this.sendMessage(pageDetails);
  localStorage.setItem("pageName", element.pageName);
  localStorage.setItem("pageID", element.pageId);
 }

 routeMenu(element) {
  let url = "/planning/list-items/" + element.pageName + "/" + element.pageId + "";
  return url;
 }

 rightDivClick() {
  this.leftDivShow = true;
  this.rightDivShow = false;
 }

 leftDivClick() {
  this.rightDivShow = true;
  this.leftDivShow = false;
 }

 changeTab(event: any) {
  // angular.element('tab a[data-target="#tab-two"]').trigger('click');
  // console.log(event.target.checked);
  // console.log(this.showDiv);

  // $('#nav-tabContent id="#"').trigger('click');
  // document.getElementById('#nav-Editdata').click();
  // $('#nav-Editdata').trigger('click');
  // $('.clickMe#' + 'nav-Editdata').trigger('click');

  // var ix = $(this).index();

  // $('#nav-graph').toggle(ix === 0);
  // $('#nav-Editdata').toggle(ix === 1);
  // if (this.showDiv === true) {
  //   this.showDiv = false;
  // }
  // if (this.showDiv === false) {
  //   this.showDiv = true;
  // }
  if (this.showDiv1) {
   this.showDiv1 = false;
   this.showDiv2 = true;
   return;
  }
  if (this.showDiv2) {
   this.showDiv2 = false;
   this.showDiv1 = true;
   return;
  }
  // this.showDiv1
 }

 showAddDiv() {
  this.RefreshDta();
  if (this.showDiv1) {
   this.showDiv1 = false;
   this.showDiv2 = true;
   return;
  }
  // if (this.showDiv2) {
  //   this.showDiv2 = false;
  //   this.showDiv1 = true;
  //   return;
  // }

  console.log(this.showDiv1);
 }

 async deleteSelectedIds() {
  let selectedIdsArr = "";
  selectedIdsArr = JSON.parse(localStorage.getItem("selectedIds"));
  if (selectedIdsArr.length > 0) {
   await this.DeleteData(selectedIdsArr);
   this.RefreshDta();
   let url = "/planning/list-items/" + this.pageName + "/" + this.pageId + "";
   this.router.navigateByUrl(url);
  } else {
   this.notifier.notify("success", "select at least one item to delete");
   //   alert('select at least one item to delete');
  }
 }

 async DeleteData(selectedIdsArr) {
  for (let x of selectedIdsArr) {
   let obj;
   if (this.pageName == "Device") {
    obj = {
     uid: environment.uid,
     orderid: environment.orderid,
     NEID: x,
    };
   }
   if (this.pageName == "Card" || this.pageName == "ChildCard") {
    obj = {
     uid: environment.uid,
     orderid: environment.orderid,
     cardID: x,
    };
   }
   if (this.pageName == "Shelf") {
    obj = {
     uid: environment.uid,
     orderid: environment.orderid,
     objectID: x,
     objectType: "shelf",
    };
   }
   if (this.pageName == "Port") {
    obj = {
     uid: environment.uid,
     orderid: environment.orderid,
     PortID: x,
     ObjectType: null,
     ObjectID: null,
    };
   }
   if (this.pageName == "Link") {
    obj = {
     uid: environment.uid,
     orderid: environment.orderid,
     linkId: x,
    };
   }

   var DataResponse = await this.RemoveElementata(obj, this.pageName);
   this.notifier.notify("success", DataResponse.message);
   // alert(DataResponse.message);
  }
 }

 async RemoveElementata(obj, pgname) {
  let response = await this.RemoveElementatafromAPI(obj, pgname);
  return response;
 }
 public RemoveElementatafromAPI(obj, pgname): Promise<any> {
  return this.planningService.removeData(obj, pgname).toPromise();
 }

 sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
 }
 GetallDataByID(id, type) {
  this.deviceDtls = null;
  if (type == "Device" || type == "Shelf" || type == "Card" || type == "Link" || type == "Port") {
   this.planningService.getElementListByID(type, id).subscribe((data: any) => {
    this.deviceDtls = data.Details;
    console.log(this.deviceDtls);
   });
  }
 }

 RefreshDta() {
  let pageDetails = {
   pageType: this.pageType,
   elementID: 0,
   pageName: this.pageName,
   pageID: this.pageId,
  };
  this.sendMessage(pageDetails);
  localStorage.setItem("pageType", this.pageType);
  localStorage.setItem("elementID", "0");
 }
}
