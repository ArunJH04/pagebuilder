import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

let headers = new HttpHeaders();
headers = headers.set("Content-Type", "application/json; charset=utf-8");

let menuHeaders = new HttpHeaders();
menuHeaders = headers
 .set("Content-Type", "application/json; charset=utf-8")
 .set("user_role", "1,2,3");

let userHeaders = new HttpHeaders();

@Injectable({
 providedIn: "root",
})
export class ConfigurationService {
 constructor(private http: HttpClient) {}

 getDevices(): Observable<any> {
  return this.http.get(
   environment.configBaseUrl + environment.configApiEndPoint.getDevice,
   { headers: headers }
  );
 }

 getDashboardDeviceCounts(): Observable<any> {
  return this.http.get(
   environment.configBaseUrl +
    environment.configApiEndPoint.dashboardDeviceCounts,
   { headers: headers }
  );
 }

 getDeviceCommand(): Observable<any> {
  return this.http.get(
   environment.configBaseUrl +
    environment.configApiEndPoint.getAllDeviceCommand,
   { headers: headers }
  );
 }

 getDeviceFrequency(): Observable<any> {
  return this.http.get(
   environment.configBaseUrl +
    environment.configApiEndPoint.getAllDeviceFrequency,
   { headers: headers }
  );
 }

 getDeviceGroup(): Observable<any> {
  return this.http.get(
   environment.configBaseUrl + environment.configApiEndPoint.getAllDeviceGroup,
   { headers: headers }
  );
 }

 getUsers(): Observable<any> {
  return this.http.get(
   environment.configBaseUrl + environment.configApiEndPoint.getUsers,
   { headers: headers }
  );
 }

 getCompareFileInfo(obj): Observable<any> {
  return this.http.post(
   environment.configBaseUrl +
    environment.configApiEndPoint.getCompareFilesInfo,
   obj,
   { headers: headers }
  );
 }

 showConfigFilesInfo(obj): Observable<any> {
  return this.http.post(
   environment.configBaseUrl +
    environment.configApiEndPoint.showConfigFilesInfo,
   obj,
   { headers: headers }
  );
 }

 uploadPushConfig(fileObj): Observable<any> {
  return this.http.post(
   environment.configBaseUrl + environment.configApiEndPoint.pushConfig,
   fileObj
  );
 }

 getCompareFiles(obj): Observable<any> {
  return this.http.post(
   environment.configBaseUrl + environment.configApiEndPoint.getCompareFiles,
   obj,
   { headers: headers }
  );
 }

 getFileDetails(fileName): Observable<any> {
  return this.http.post(
   environment.configBaseUrl + environment.configApiEndPoint.getFileDetails,
   fileName,
   { headers: headers }
  );
 }

 showRunLogFilesInfo(obj): Observable<any> {
  return this.http.post(
   environment.configBaseUrl +
    environment.configApiEndPoint.showRunLogFilesInfo,
   obj,
   { headers: headers }
  );
 }
 createPageItems(id, uid): Observable<any> {
  userHeaders = headers
   .set("Content-Type", "application/json; charset=utf-8")
   .set("uid", uid);
  console.log(userHeaders);
  return this.http.get(
   environment.baseUrl + environment.apiEndPoint.createConfigPage + "/" + id,
   { headers: userHeaders }
  );
 }

 createPageValues(actionLink, data): Observable<any> {
  return this.http.post(actionLink, data, { headers: headers });
 }
 EditDeviceAdminByID(pageName, id): Observable<any> {
  if (pageName == "Device Admin") {
   return this.http.get(
    environment.baseUrl + environment.apiEndPoint.GetDevAdminData + "/" + id,
    { headers: headers }
   );
  }
 }

 getMenuItems(): Observable<any> {
  return this.http.get(
   environment.baseUrl + environment.apiEndPoint.getConfigMenu,
   { headers: menuHeaders }
  );
 }
 EditDetailsByID(pageName, id): Observable<any> {
  console.log("EditDetailsByID");
  console.log(id);
  console.log(pageName);
  return this.http.get(
   environment.baseUrl +
    environment.apiEndPoint.getDeviceDtl +
    "/" +
    id +
    "/" +
    pageName,
   { headers: headers }
  );
 }

 updatePageValues(data, id): Observable<any> {
  console.log("update device admin:" + id);
  return this.http.post(
   environment.configBaseUrl +
    environment.configApiEndPoint.updateDeviceAdmin +
    "/" +
    id,
   data,
   { headers: headers }
  );
 }

 GetDevicesByGroup(id): Observable<any> {
  return this.http.get(
   environment.configBaseUrl +
    environment.configApiEndPoint.getDeviceByGroup +
    "/" +
    id,
   { headers: headers }
  );
 }

 GetUserByGroup(id): Observable<any> {
  return this.http.get(
   environment.configBaseUrl +
    environment.configApiEndPoint.getUserByGroup +
    "/" +
    id,
   { headers: headers }
  );
 }

 removeData(id, elementName): Observable<any> {
  if (elementName == "Group") {
   return this.http.delete(
    environment.configBaseUrl +
     environment.configApiEndPoint.DeleteGroup +
     "/" +
     id,
    { headers: headers }
   );
  }

  if (elementName == "Device" || elementName == "User") {
   let groupID = 0;
   return this.http.post(
    environment.configBaseUrl +
     environment.configApiEndPoint.UpdateGroupIndevice +
     "/" +
     groupID +
     "/" +
     id,
    { headers: headers }
   );
  }
 }

 EnableData(id, value): Observable<any> {
  console.log(id);
  console.log(value);
  if (value == 1) {
   return this.http.post(
    environment.configBaseUrl +
     environment.configApiEndPoint.EnableGroup +
     "/" +
     id,
    { headers: headers }
   );
  }
  if (value == 0) {
   return this.http.post(
    environment.configBaseUrl +
     environment.configApiEndPoint.DisableGroup +
     "/" +
     id,
    { headers: headers }
   );
  }
 }

 CreatedeviceGroup(data): Observable<any> {
  console.log(data);
  return this.http.post(
   environment.configBaseUrl + environment.configApiEndPoint.createGroup,
   data,
   { headers: headers }
  );
 }
 UpdateDeviceGroup(id, data): Observable<any> {
  console.log(data);
  return this.http.put(
   environment.configBaseUrl +
    environment.configApiEndPoint.updateGroup +
    "/" +
    id,
   data,
   { headers: headers }
  );
 }

 UpdateGroupFordevices(id, groupID): Observable<any> {
  return this.http.post(
   environment.configBaseUrl +
    environment.configApiEndPoint.UpdateGroupIndevice +
    "/" +
    groupID +
    "/" +
    id,
   { headers: headers }
  );
 }

 getAllloginUser(): Observable<any> {
  return this.http.get(
   environment.configBaseUrl + environment.configApiEndPoint.getAllDevloginUser,
   { headers: headers }
  );
 }

 Updatedeviceschedule(dataObj): Observable<any> {
  return this.http.put(
   environment.configBaseUrl +
    environment.configApiEndPoint.Updatedeviceschedule +
    "/" +
    dataObj.deviceId,
   dataObj,
   { headers: headers }
  );
 }

 DeleteDevices(id): Observable<any> {
  return this.http.delete(
   environment.configBaseUrl +
    environment.configApiEndPoint.DeleteDevice +
    "/" +
    id,
   { headers: headers }
  );
 }
}
