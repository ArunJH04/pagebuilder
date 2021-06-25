import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as $ from "jquery";
import { ConfigurationService } from "../../configuration/configuration.service";
import { ServiceService } from "../../service.service";

@Component({
 selector: "app-configuration-layout",
 templateUrl: "./configuration-layout.component.html",
 styleUrls: ["./configuration-layout.component.css"],
})
export class ConfigurationLayoutComponent implements OnInit {
 pageNa;
 pageI;
 dashboardCount;

 constructor(private router: Router, private configurationService: ConfigurationService, private appService: ServiceService) {}

 menuList;

 ngOnInit() {
  this.configurationService.getMenuItems().subscribe((data: any) => {
   this.menuList = data.pages_list[0].pages;
   localStorage.setItem("pageName", JSON.stringify(this.menuList[0].pageName));
   localStorage.setItem("pageID", this.menuList[0].pageId);
  });
  this.getDashboardCounts();
 }

 getDashboardCounts() {
  this.configurationService.getDashboardDeviceCounts().subscribe((data: any) => {
   this.dashboardCount = data.records;
  });
 }

 getImageUrl(ele) {
  return "../../../assets/menu-icon-" + ele.pageName + ".png";
 }

 navigateToMenu(element) {
  let pageID = element.pageId;
  let pageName = element.pageName;
  this.router.navigate(["/configuration/list", { pageName: pageName, id: pageID }]);
 }

 routeMenu(element) {
  //let url = "/configuration/" + element.pageName;
  let url = "/configuration/" + element.pageName + "/" + element.pageId + "";

  return url;
 }

 setValue(element) {
  let pageDetails = { pageName: element.pageName, pageID: element.pageId };
  this.sendMessage(pageDetails);
  localStorage.setItem("pageName", element.pageName);
  localStorage.setItem("pageID", element.pageId);
 }

 sendMessage(pageDetails): void {
  // send message to subscribers via observable subject
  this.appService.sendUpdate(pageDetails);
 }
}
