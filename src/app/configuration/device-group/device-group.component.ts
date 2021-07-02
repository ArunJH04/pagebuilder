import { Component, OnInit } from "@angular/core";
import { ConfigurationService } from "../../configuration/configuration.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { getLocaleDateFormat } from "@angular/common";
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
 searchTextdev;
 searchTextusr;
 deviceGroup;
 deviceGroupDlts;
 allDevices;
 allUsers;
 DevicesInGroup;
 UsersInGroup;
 DeviceList;
 UserList;
 EmptyDeviceList;
 EmptyUserList;
 EditGroup;
 CreateGroup;
 EmptyGroupList;
 SelectedgrpIDs: any = [];
 SelectedDevIDs: any = [];
 SelectedUsrIDs: any = [];

 SelectedDevForAdd: any = [];
 SelectedUsrForAdd: any = [];

 EditGroupID = 0;
 deviceStatus = [
  { id: 1, value: "Yes" },
  { id: 0, value: "No" },
 ];

 private notifier: NotifierService;
 constructor(
  private router: Router,
  private configurationService: ConfigurationService,
  private route: ActivatedRoute,
  notifier: NotifierService
 ) {
  this.notifier = notifier;
 }

 ngOnInit() {
  this.EditGroup = null;
  this.EditGroupID = 0;
  this.CreateGroup = "1";
  this.EmptyGroupList = "1";
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
   this.EmptyGroupList = null;
  });
 }

 getRecord(elements) {
  this.EditGroup = "1";
  this.CreateGroup = null;
  this.EmptyDeviceList = "1";
  this.EmptyUserList = "1";
  this.EditGroupID = elements.id;
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
  this.DevicesInGroup = null;
  this.DeviceList = null;
  this.configurationService
   .GetDevicesByGroup(Devgroupid)
   .subscribe((data: any) => {
    if (data.Datalist.length != 0) {
     this.DevicesInGroup = data.Datalist;
     this.DeviceList = data.Datalist;
     this.EmptyDeviceList = null;
    }
   });
 }

 GetUserDtlsByGroup(Devgroupid) {
  this.UsersInGroup = null;
  this.UserList = null;
  this.configurationService
   .GetUserByGroup(Devgroupid)
   .subscribe((data: any) => {
    if (data.Datalist.length != 0) {
     this.UsersInGroup = data.Datalist;
     this.UserList = data.Datalist;
     this.EmptyUserList = null;
    }
   });
 }

 //=========store selected ID in a variable from checkbox==============
 selectID(event: any, element) {
  if (element == "Group") {
   let valueExists;
   let id = this.SelectedgrpIDs.indexOf(event.target.id);
   if (this.SelectedgrpIDs.indexOf(event.target.id) !== -1) {
    valueExists = true;
   } else {
    valueExists = false;
   }
   if (event.target.checked && valueExists === false) {
    this.SelectedgrpIDs.push(event.target.id);
   } else {
    this.SelectedgrpIDs.splice(id, 1);
   }
  }
  if (element == "Device") {
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
  if (element == "User") {
   let valueExists2;
   let id = this.SelectedUsrIDs.indexOf(event.target.id);
   if (this.SelectedUsrIDs.indexOf(event.target.id) !== -1) {
    valueExists2 = true;
   } else {
    valueExists2 = false;
   }
   if (event.target.checked && valueExists2 === false) {
    this.SelectedUsrIDs.push(event.target.id);
   } else {
    this.SelectedUsrIDs.splice(id, 1);
   }
  }
 }

 //=========Delete group by selected id==============
 async deleteSelectedGroup() {
  let selectedIdsArr = JSON.parse(JSON.stringify(this.SelectedgrpIDs));
  if (selectedIdsArr.length > 0) {
   await this.DeleteData(selectedIdsArr, "Group");
   this.getDeviceGroupList();
  } else {
   this.notifier.notify("error", "select at least one item to delete");
  }
 }

 //=========Delete device by selected id==============
 async deleteSelectedDevice() {
  let selectedIdsArr = JSON.parse(JSON.stringify(this.SelectedDevIDs));
  if (selectedIdsArr.length > 0) {
   await this.DeleteData(selectedIdsArr, "Device");
   this.GetDeviceDtlsByGroup(this.EditGroupID);
  } else {
   this.notifier.notify("error", "select at least one item to delete");
  }
 }
 //=========Delete user by selected id==============
 async deleteSelectedUser() {
  let selectedIdsArr = JSON.parse(JSON.stringify(this.SelectedUsrIDs));
  if (selectedIdsArr.length > 0) {
   await this.DeleteData(selectedIdsArr, "User");
   this.GetUserDtlsByGroup(this.EditGroupID);
  } else {
   this.notifier.notify("error", "select at least one item to delete");
  }
 }

 async DeleteData(selectedId, elementname) {
  for (let x of selectedId) {
   var DataResponse = await this.RemoveElementata(x, elementname);
   this.notifier.notify("success", DataResponse.message);
  }
 }

 async RemoveElementata(obj, pgname) {
  let response = await this.RemoveElementatafromAPI(obj, pgname);
  return response;
 }
 public RemoveElementatafromAPI(obj, pgname): Promise<any> {
  return this.configurationService.removeData(obj, pgname).toPromise();
 }

 // Enable group
 async EnableSelectedGroup(val) {
  let selectedIdsArr = JSON.parse(JSON.stringify(this.SelectedgrpIDs));
  if (selectedIdsArr.length > 0) {
   await this.EnableData(selectedIdsArr, val);
   this.getDeviceGroupList();
  } else {
   if (val == 1) {
    this.notifier.notify("error", "select at least one item to Enable");
   } else {
    this.notifier.notify("error", "select at least one item to Disable");
   }
  }
 }

 async EnableData(selectedId, value) {
  for (let x of selectedId) {
   var DataResponse = await this.EnableElementata(x, value);
   this.notifier.notify("success", DataResponse.message);
  }
 }

 async EnableElementata(obj, val) {
  let response = await this.EnableElementatafromAPI(obj, val);
  return response;
 }
 public EnableElementatafromAPI(obj, val): Promise<any> {
  return this.configurationService.EnableData(obj, val).toPromise();
 }

 //Save  group
 GroupSave() {
  let grpName = (<HTMLSelectElement>document.getElementById("txtgrpName"))
   .value;

  let elementDetails = {
   groupName: grpName,
   is_enabled: 1,
   createdBy: 1, //logged in user
   modifiedBy: 1, //logged in user
  };

  this.configurationService
   .CreatedeviceGroup(elementDetails)
   .subscribe((res) => {
    // console.log(res);
    if (res.status == 200) {
     this.getDeviceGroupList();
     this.notifier.notify("success", res.message);
    }
    if (res.status == 0) {
     this.notifier.notify("info", res.message);
    }
    if (res.status == 300) {
     this.notifier.notify("error", res.message);
    }
   });
 }

 //Rename/Update group
 RenameGroup() {
  let selectedIdsArr = JSON.parse(JSON.stringify(this.SelectedgrpIDs));
  if (selectedIdsArr.length == 1) {
   let grpName = (<HTMLSelectElement>document.getElementById("txtRenamegrp"))
    .value;

   let elementDetails = {
    groupName: grpName,
    is_enabled: 1,
    modifiedBy: 1, //logged in user
   };

   this.configurationService
    .UpdateDeviceGroup(selectedIdsArr, elementDetails)
    .subscribe((res) => {
     // console.log(res);
     if (res.status == 200) {
      this.getDeviceGroupList();
      this.notifier.notify("success", res.message);
     }
     if (res.status == 0) {
      this.notifier.notify("info", res.message);
     }
     if (res.status == 300) {
      this.notifier.notify("error", res.message);
     }
    });
  } else if (selectedIdsArr.length > 1) {
   this.notifier.notify("error", "select at only one item to rename");
  } else {
   this.notifier.notify("error", "select at least one item to rename");
  }
 }

 // Add device to group functionality
 async openNav() {
  await this.GetAllDevices();
  document.getElementById("devicenav").style.width = "250px";
 }

 closeNav() {
  document.getElementById("devicenav").style.width = "0";
 }

 async GetAllDevices() {
  this.configurationService.getDevices().subscribe((data: any) => {
   this.allDevices = data;
  });
 }

 devfilterValues(event) {
  this.searchTextdev = event.target.value;
 }
 //=========store selected ID in a variable from checkbox for Add device in group==============
 selectDevID(event: any) {
  let valueExists1;
  let id = this.SelectedDevForAdd.indexOf(event.target.id);
  if (this.SelectedDevForAdd.indexOf(event.target.id) !== -1) {
   valueExists1 = true;
  } else {
   valueExists1 = false;
  }
  if (event.target.checked && valueExists1 === false) {
   this.SelectedDevForAdd.push(event.target.id);
  } else {
   this.SelectedDevForAdd.splice(id, 1);
  }
 }

 addDeviceInGroup() {
  this.configurationService
   .UpdateGroupFordevices(this.SelectedDevForAdd, this.EditGroupID)
   .subscribe((res) => {
    // console.log(res);
    if (res.status == 200) {
     this.getDeviceGroupList();
     this.notifier.notify("success", res.message);
     this.closeNav();
     this.SelectedDevForAdd = [];
     this.GetallDataByID(this.EditGroupID, "Device Group");
     this.GetDeviceDtlsByGroup(this.EditGroupID);
     this.GetUserDtlsByGroup(this.EditGroupID);
    }
    if (res.status == 0) {
     this.notifier.notify("info", res.message);
    }
    if (res.status == 300) {
     this.notifier.notify("error", res.message);
    }
   });
 }

 // Add user to group functionality
 async openusrNav() {
  await this.GetAllUsers();
  document.getElementById("usernav").style.width = "250px";
 }

 closeusrNav() {
  document.getElementById("usernav").style.width = "0";
 }

 async GetAllUsers() {
  this.configurationService.getAllloginUser().subscribe((data: any) => {
   this.allUsers = data;
  });
 }

 UsrfilterValues(event) {
  this.searchTextusr = event.target.value;
 }
 //=========store selected ID in a variable from checkbox for Add device in group==============
 selectUsrID(event: any) {
  let valueExists1;
  let id = this.SelectedUsrForAdd.indexOf(event.target.id);
  if (this.SelectedUsrForAdd.indexOf(event.target.id) !== -1) {
   valueExists1 = true;
  } else {
   valueExists1 = false;
  }
  if (event.target.checked && valueExists1 === false) {
   this.SelectedUsrForAdd.push(event.target.value);
  } else {
   this.SelectedUsrForAdd.splice(id, 1);
  }
 }

 addUserInGroup() {
  console.log(this.SelectedUsrForAdd);
  this.configurationService
   .UpdateGroupFordevices(this.SelectedUsrForAdd, this.EditGroupID)
   .subscribe((res) => {
    // console.log(res);
    if (res.status == 200) {
     this.getDeviceGroupList();
     this.notifier.notify("success", res.message);
     this.closeusrNav();
     this.SelectedUsrForAdd = [];
     this.GetallDataByID(this.EditGroupID, "Device Group");
     this.GetDeviceDtlsByGroup(this.EditGroupID);
     this.GetUserDtlsByGroup(this.EditGroupID);
    }
    if (res.status == 0) {
     this.notifier.notify("info", res.message);
    }
    if (res.status == 300) {
     this.notifier.notify("error", res.message);
    }
   });
 }
}
