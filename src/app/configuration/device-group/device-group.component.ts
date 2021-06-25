import { Component, OnInit } from "@angular/core";
import { ConfigurationService } from "../../configuration/configuration.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
@Component({
 selector: "app-device-group",
 templateUrl: "./device-group.component.html",
 styleUrls: ["./device-group.component.css"],
})
export class DeviceGroupComponent implements OnInit {
 rightDivShow: boolean = false;
 leftDivShow: boolean = true;

 pageId;
 pageName;
 searchText;
 deviceGroup;
 deviceGroupDlts;
 allDevices;
 allUsers;

 deviceStatus = [
  { id: 1, value: "Yes" },
  { id: 0, value: "No" },
 ];

 constructor(private router: Router, private configurationService: ConfigurationService, private route: ActivatedRoute) {}

 ngOnInit() {
  this.route.params.subscribe((params: Params) => {
   this.pageId = params.id;
   this.pageName = params.pageName;
  });
  this.getDeviceGroupList();
  //   this.configurationService.getDeviceGroup().subscribe((data: any) => {
  //    this.allDevices = data;
  //   });
  //   this.configurationService.getUsers().subscribe((data: any) => {
  //    this.allUsers = data;
  //   });
 }

 routeToAddDetails() {
  let url = "/configuration/add/" + this.pageName + "/" + this.pageId + "";
  return url;
 }

 filterValues(event) {
  this.searchText = event.target.value;
 }

 rightDivClick() {
  this.leftDivShow = true;
  this.rightDivShow = false;
 }

 leftDivClick() {
  this.rightDivShow = true;
  this.leftDivShow = false;
 }

 getDeviceGroupList() {
  this.configurationService.getDeviceGroup().subscribe((data: any) => {
   console.log(data);
   //  for ()
   this.deviceGroup = data;
  });
 }

 getRecord(elements) {
  this.GetallDataByID(elements.id, "Device Group");
  this.GetDeviceDtlsByGroup(elements.id);
  this.GetUserDtlsByGroup(elements.id);
 }

 GetallDataByID(id, type) {
  this.deviceGroupDlts = null;
  this.configurationService.EditDetailsByID(type, id).subscribe((data: any) => {
   this.deviceGroupDlts = data.Details;
  });
 }

 GetDeviceDtlsByGroup(Devgroupid) {
  this.allDevices = null;
  this.configurationService.GetDevicesByGroup(Devgroupid).subscribe((data: any) => {
   this.allDevices = data.Datalist;
  });
 }

 GetUserDtlsByGroup(Devgroupid) {
  this.allUsers = null;
  this.configurationService.GetUserByGroup(Devgroupid).subscribe((data: any) => {
   console.log(data.Datalist);
   this.allUsers = data.Datalist;
  });
 }
}
