import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

let headers = new HttpHeaders();
headers = headers.set("Content-Type", "application/json; charset=utf-8");

let menuHeaders = new HttpHeaders();
menuHeaders = headers.set("Content-Type", "application/json; charset=utf-8").set("user_role", "1,2,3");

@Injectable({
 providedIn: "root",
})
export class ConfigurationService {
 constructor(private http: HttpClient) {}

 getDevices(): Observable<any> {
  return this.http.get(environment.configBaseUrl + environment.configApiEndPoint.getDevice, { headers: headers });
 }

 getDashboardDeviceCounts(): Observable<any> {
  return this.http.get(environment.configBaseUrl + environment.configApiEndPoint.dashboardDeviceCounts, { headers: headers });
 }

 getDeviceCommand(): Observable<any> {
  return this.http.get(environment.configBaseUrl + environment.configApiEndPoint.getAllDeviceCommand, { headers: headers });
 }

 getDeviceFrequency(): Observable<any> {
  return this.http.get(environment.configBaseUrl + environment.configApiEndPoint.getAllDeviceFrequency, { headers: headers });
 }

 getDeviceGroup(): Observable<any> {
  return this.http.get(environment.configBaseUrl + environment.configApiEndPoint.getAllDeviceGroup, { headers: headers });
 }

 getUsers(): Observable<any> {
  return this.http.get(environment.configBaseUrl + environment.configApiEndPoint.getUsers, { headers: headers });
 }

 getCompareFileInfo(): Observable<any> {
  return this.http.get(environment.configBaseUrl + environment.configApiEndPoint.getCompareFilesInfo, { headers: headers });
 }

 createPageItems(id): Observable<any> {
  return this.http.get(environment.baseUrl + environment.apiEndPoint.createPage + "/" + id, { headers: headers });
 }

 createPageValues(actionLink, data): Observable<any> {
  return this.http.post(actionLink, data, { headers: headers });
 }
 EditDeviceAdminByID(pageName, id): Observable<any> {
  if (pageName == "Device Admin") {
   return this.http.get(environment.baseUrl + environment.apiEndPoint.GetDevAdminData + "/" + id, { headers: headers });
  }
 }

 getMenuItems(): Observable<any> {
  return this.http.get(environment.baseUrl + environment.apiEndPoint.getConfigMenu, { headers: menuHeaders });
 }
 EditDetailsByID(pageName, id): Observable<any> {
  console.log("EditDetailsByID");
  console.log(id);
  console.log(pageName);
  return this.http.get(environment.baseUrl + environment.apiEndPoint.getDeviceDtl + "/" + id + "/" + pageName, { headers: headers });
 }

 updatePageValues(data, id): Observable<any> {
  console.log("update device admin:" + id);
  return this.http.post(environment.configBaseUrl + environment.configApiEndPoint.updateDeviceAdmin + "/" + id, data, { headers: headers });
 }

 GetDevicesByGroup(id): Observable<any> {
  return this.http.get(environment.configBaseUrl + environment.configApiEndPoint.getDeviceByGroup + "/" + id, { headers: headers });
 }

 GetUserByGroup(id): Observable<any> {
  return this.http.get(environment.configBaseUrl + environment.configApiEndPoint.getUserByGroup + "/" + id, { headers: headers });
 }
}
