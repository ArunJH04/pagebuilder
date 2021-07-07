import { Component, OnInit } from "@angular/core";
import { ConfigurationService } from "../../configuration/configuration.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { ServiceService } from "../../service.service";
import { Subscription } from "rxjs";
import { NotifierService } from "angular-notifier";

export interface DiffCompareConfig {
 leftContent: string;
 rightContent: string;
}
@Component({
 selector: "app-device-admin",
 templateUrl: "./device-admin.component.html",
 styleUrls: ["./device-admin.component.css"],
})
export class DeviceAdminComponent implements OnInit {
 rightDivShow: boolean = false;
 leftDivShow: boolean = true;
 deviceCommand;
 deviceFrequency;
 deviceGroup;
 pageId;
 pageName;
 searchText;
 allDevices: any = [];
 SelectedDevIDs: any = [];

 leftSideCompareVar: string;
 rightSideCompareVar: string;
 compareTextContent: any = [];
 compareTextFormat: string;
 messageReceived: any;
 private subscriptionName: Subscription;
 pageType;
 elementID;
 deviceAdminDtls;
 showToolbar: boolean = true;

 contentObservable: Subject<DiffCompareConfig> =
  new Subject<DiffCompareConfig>();
 contentObservable$: Observable<DiffCompareConfig> =
  this.contentObservable.asObservable();

 deviceStatus = [
  { id: 0, value: "Disabled" },
  { id: 1, value: "Enabled" },
 ];

 private notifier: NotifierService;
 constructor(
  private router: Router,
  private configurationService: ConfigurationService,
  private route: ActivatedRoute,
  private appService: ServiceService,
  notifier: NotifierService
 ) {
  this.notifier = notifier;
  this.subscriptionName = this.appService.getUpdate().subscribe((message) => {
   //message contains the data sent from service
   this.messageReceived = message.text;
   this.pageName = this.messageReceived.pageName;
   this.pageId = this.messageReceived.pageID;
  });
 }

 ngOnInit() {
  //   this.route.params.subscribe((params: Params) => {
  //    this.pageId = params.id;
  //    this.pageName = params.pageName;
  //   });

  //   this.getDeviceCommand();
  //   this.getDeviceFrequency();
  //   this.getDeviceGroup();
  this.BindDeviceList();
  this.getDeviceFrequency();
  this.configurationService.getCompareFileInfo().subscribe((data: any) => {
   this.compareTextContent = data;
   this.leftSideCompareVar = this.compareTextContent[0].replace(
    /[\r\"\']/g,
    ""
   );
   this.rightSideCompareVar = this.compareTextContent[1].replace(
    /[\r\"\']/g,
    ""
   );
  });

  this.showToolbar = false;
 }

 BindDeviceList() {
  this.configurationService.getDevices().subscribe((data: any) => {
   this.allDevices = data;
  });
 }
 routeToAddDetails() {
  let url = "/configuration/add/" + this.pageName + "/" + this.pageId + "";
  return url;
 }

 filterValues(event) {
  this.searchText = event.target.value;
 }

 //  getDeviceCommand() {
 //   this.configurationService.getDeviceCommand().subscribe((data: any) => {
 //    this.deviceCommand = data;
 //   });
 //  }
 //  getDeviceFrequency() {
 //   this.configurationService.getDeviceFrequency().subscribe((data: any) => {
 //    this.deviceFrequency = data;
 //   });
 //  }
 //  getDeviceGroup() {
 //   this.configurationService.getDeviceGroup().subscribe((data: any) => {
 //    this.deviceGroup = data;
 //   });
 //  }

 rightDivClick() {
  this.leftDivShow = true;
  this.rightDivShow = false;
 }

 leftDivClick() {
  this.rightDivShow = true;
  this.leftDivShow = false;
 }

 onCompareTextResults() {
  const newContent: DiffCompareConfig = {
   leftContent: this.leftSideCompareVar,
   rightContent: this.rightSideCompareVar,
  };
  this.contentObservable.next(newContent);

  setTimeout(() => {
   var tdLeftHeadElements = document.getElementsByClassName(
    "fit-column line-number-col delete-row"
   );
   var tdLeftRearElements = document.getElementsByClassName(
    "fit-column prefix-col delete-row"
   );
   var tdLeftContentElements = document.getElementsByClassName(
    "content-col delete-row"
   );
   var highLightElements = document.getElementsByClassName("highlight");
   var tdRightHeadElements = document.getElementsByClassName(
    "fit-column line-number-col insert-row"
   );
   var tdRightRearElements = document.getElementsByClassName(
    "fit-column prefix-col insert-row"
   );
   var tdRightContentElements = document.getElementsByClassName(
    "content-col insert-row"
   );

   for (var i = 0; i < tdLeftHeadElements.length; i++) {
    tdLeftHeadElements[i].setAttribute(
     "style",
     "background-color: #FFFF00 !important"
    );
   }
   for (var j = 0; j < tdLeftRearElements.length; j++) {
    tdLeftRearElements[j].setAttribute(
     "style",
     "background-color: #FFFF00 !important"
    );
   }
   for (var k = 0; k < tdLeftContentElements.length; k++) {
    tdLeftContentElements[k].setAttribute(
     "style",
     "background-color: #FFFF00 !important"
    );
   }

   for (var l = 0; l < highLightElements.length; l++) {
    highLightElements[l].setAttribute(
     "style",
     "background-color: #FFFF00 !important"
    );
   }

   for (var m = 0; m < tdRightHeadElements.length; m++) {
    tdRightHeadElements[m].setAttribute(
     "style",
     "background-color: #FFFF00 !important"
    );
   }

   for (var n = 0; n < tdRightRearElements.length; n++) {
    tdRightRearElements[n].setAttribute(
     "style",
     "background-color: #FFFF00 !important"
    );
   }
   for (var o = 0; o < tdRightContentElements.length; o++) {
    tdRightContentElements[o].setAttribute(
     "style",
     "background-color: #FFFF00 !important"
    );
   }
  }, 0);
 }

 getRecord(elements) {
  this.pageName = "Device Admin";
  let elementDetails = {
   pageType: this.pageName,
   elementID: elements.deviceId,
   pageName: this.pageName,
   pageID: this.pageId,
   funcType: "show",
  };
  this.elementID = elementDetails.elementID;
  //console.log("bbbb::" + this.elementID);

  this.sendElementMessage(elementDetails);
  localStorage.setItem("pageType", this.pageName);
  localStorage.setItem("elementID", elementDetails.elementID);
  localStorage.setItem("pageName", this.pageName);
  localStorage.setItem("pageID", this.pageId);

  this.GetallDataByID(elementDetails.elementID, this.pageName);
 }

 sendMessage(pageDetails): void {
  // send message to subscribers via observable subject
  this.appService.sendUpdate(pageDetails);
 }
 GetGroup(elements) {
  let groupId = elements.deviceGroupId;
  console.log(groupId);
  this.configurationService.getMenuItems().subscribe((data: any) => {
   let menuList = data.pages_list[0].pages;
   for (let i = 0; i < menuList.length; i++) {
    console.log(menuList[i].pageName);
    if (menuList[i].pageName == "Device Group") {
     let pgname = menuList[i].pageName;
     let pgid = menuList[i].pageId;

     localStorage.setItem("pageName", pgname);
     localStorage.setItem("pageID", pgid);
     localStorage.setItem("Status", "editDeviceGrp");
     localStorage.setItem("Groupid", groupId);

     //  let pageDetails = {
     //   pageName: pgname,
     //   pageID: pgid,
     //   Status: "editDeviceGrp",
     //   Groupid: groupId,
     //  };
     //  this.sendMessage(pageDetails);
     this.router.navigate(["/configuration/" + pgname + "/" + pgid]);
    }
   }
  });
 }
 sendElementMessage(pageDetails): void {
  this.appService.sendUpdate(pageDetails);
 }

 GetallDataByID(id, type) {
  this.deviceAdminDtls = null;
  this.configurationService.EditDetailsByID(type, id).subscribe((data: any) => {
   //console.log(data.Details);
   this.deviceAdminDtls = data.Details;
  });
 }

 EditRecord(elements) {
  this.pageName = "Device Admin";
  let elementDetails = {
   pageType: this.pageName,
   elementID: elements.deviceId,
   pageName: this.pageName,
   pageID: this.pageId,
   funcType: "edit",
  };

  this.sendElementMessage(elementDetails);
  localStorage.setItem("pageType", this.pageName);
  localStorage.setItem("elementID", elementDetails.elementID);
  localStorage.setItem("pageName", this.pageName);
  localStorage.setItem("pageID", this.pageId);
  this.elementID = elementDetails.elementID;
  //console.log("bbbb::" + this.elementID);
  this.GetallDataByID(elementDetails.elementID, this.pageName);
 }

 //scedule

 getDeviceFrequency() {
  this.configurationService.getDeviceFrequency().subscribe((data: any) => {
   this.deviceFrequency = data;
  });
 }

 GetFrequencyByID(freqID) {
  console.log(JSON.stringify(this.deviceFrequency));
  let dvm = JSON.parse(JSON.stringify(this.deviceFrequency));
  var x = dvm.filter((a) => a.id == freqID);
  let frequency: any;
  for (let item in x) {
   frequency = x[item]["value"];
  }
  return frequency;
 }

 async ChangeScheduleSave() {
  let msg = "";
  let errortype = "";
  let timezoneDiff = 19800; // Number of seconds
  //let diffOperator = "-"; // if server timezone is less than user timezone keep minus sign else keep plus sign -->
  // let timeDiff = diffOperator + timezoneDiff; // + " seconds";
  console.log("timeDiff::" + timezoneDiff);
  let frq = (<HTMLSelectElement>document.getElementById("Changefrq")).value;

  let updatefrequency = "";
  if (frq != "") {
   updatefrequency = this.GetFrequencyByID(frq);
  }
  console.log("frq::" + updatefrequency);
  let updateschedule1 = (
   document.getElementById("txtChangeSchedule") as HTMLInputElement
  ).value;
  console.log("updateschedule1::" + updateschedule1);

  let updateschedul2 = new Date(updateschedule1).setSeconds(
   new Date(updateschedule1).getSeconds() - timezoneDiff
  );
  console.log("updateschedule2::" + updateschedul2);
  let updateschedule = updateschedul2.toString().replace("/", "-");
  console.log("updateschedule::" + updateschedule);
  let epochupdateschedule = new Date(updateschedul2).getTime() / 1000; //strtotime(updateschedule);
  console.log("epochupdateschedule::" + epochupdateschedule);
  console.log("aaaa::" + this.elementID);
  let deviceId = this.elementID;
  let STATUS;
  if (updatefrequency == "" && updateschedule != "") {
   STATUS = await this.Updatedeviceschedule(frq, epochupdateschedule, deviceId);
   if (STATUS) {
    msg = "Schedule Updated Successfully.";
    errortype = "success";
   } else {
    msg = "Schedule Update Failed.";
    errortype = "error";
   }
  } else if (updatefrequency != "" && updateschedule == "") {
   STATUS = await this.Updatedeviceschedule(frq, updateschedule, deviceId);
   if (STATUS) {
    msg = "Schedule Updated Successfully.";
    errortype = "success";
   } else {
    msg = "Schedule Update Failed.";
    errortype = "error";
   }
  } else if (updatefrequency != "" && updateschedule != "") {
   STATUS = await this.Updatedeviceschedule(frq, epochupdateschedule, deviceId);
   console.log(STATUS);
   if (STATUS) {
    msg = "Schedule Updated Successfully.";
    errortype = "success";
   } else {
    msg = "Schedule Update Failed.";
    errortype = "error";
   }
  } else {
   msg = "No updates found";
   errortype = "error";
  }
  this.notifier.notify(errortype, msg);
 }
 async Updatedeviceschedule(updatefrequency, epochupdateschedule, deviceId) {
  console.log("epochupdateschedule::" + epochupdateschedule);
  let dataObj = {
   scheduleFrequency: updatefrequency,
   nextSchedule: epochupdateschedule,
   deviceId: deviceId,
  };
  let val = "0";
  var DataResponse = await this.UpdatedevicescheduleData(dataObj);

  if (DataResponse.message == 1) val = "1";

  return val;
 }

 async UpdatedevicescheduleData(obj) {
  let response = await this.UpdatedeviceschedulefromAPI(obj);
  return response;
 }
 public UpdatedeviceschedulefromAPI(dataObj): Promise<any> {
  return this.configurationService.Updatedeviceschedule(dataObj).toPromise();
 }

 selectID(event: any) {
  let valueExists1;
  let id = this.SelectedDevIDs.indexOf(event.target.id);
  if (this.SelectedDevIDs.indexOf(event.target.id) !== -1) {
   valueExists1 = true;
  } else {
   valueExists1 = false;
  }
  if (event.target.checked && valueExists1 === false) {
   this.SelectedDevIDs.push(event.target.id);
  } else {
   this.SelectedDevIDs.splice(id, 1);
  }
 }
 async deleteSelectedDevice() {
  let selectedIdsArr = JSON.parse(JSON.stringify(this.SelectedDevIDs));
  if (selectedIdsArr.length > 0) {
   await this.DeleteData(selectedIdsArr);
   this.SelectedDevIDs = [];
   this.BindDeviceList();
  } else {
   this.notifier.notify("error", "select at least one item to delete");
  }
 }

 async DeleteData(selectedId) {
  for (let x of selectedId) {
   var DataResponse = await this.RemoveElementata(x);
   this.notifier.notify("success", DataResponse.message);
  }
 }

 async RemoveElementata(obj) {
  let response = await this.RemoveElementatafromAPI(obj);
  return response;
 }
 public RemoveElementatafromAPI(obj): Promise<any> {
  return this.configurationService.DeleteDevices(obj).toPromise();
 }
}
