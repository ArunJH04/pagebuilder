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
export class PlanningService {
 constructor(private http: HttpClient) {}

 getDeviceList(pageName): Observable<any> {
  if (pageName == "Device") {
   return this.http.get(environment.baseUrl + environment.apiEndPoint.getAllDevice, { headers: headers });
  }

  if (pageName == "Shelf") {
   return this.http.get(environment.webApiBaseUrl + environment.apiEndPoint.GetShelf, { headers: headers });
  }

  if (pageName == "Port") {
   return this.http.get(environment.webApiBaseUrl + environment.apiEndPoint.GetPorts, { headers: headers });
  }

  if (pageName == "Card" || pageName == "ChildCard") {
   return this.http.get(environment.webApiBaseUrl + environment.apiEndPoint.GetCard, { headers: headers });
  }

  if (pageName == "Link") {
   return this.http.get(environment.webApiBaseUrl + environment.apiEndPoint.GetLink, { headers: headers });
  }
 }

 getMenuItems(): Observable<any> {
  return this.http.get(environment.baseUrl + environment.apiEndPoint.getMenu, { headers: menuHeaders });
 }

 createPageItems(id): Observable<any> {
  return this.http.get(environment.baseUrl + environment.apiEndPoint.createPage + "/" + id, { headers: headers });
 }

 createPageValues(actionLink, data): Observable<any> {
  return this.http.post(actionLink, data, { headers: headers });
 }

 removeData(data, pageName): Observable<any> {
  const httpOptions: any = {
   headers: headers,
  };
  let uri;
  if (pageName == "Device") {
   uri = environment.webApiBaseUrl + environment.apiEndPoint.removeNE;
  }
  if (pageName == "Card" || pageName == "ChildCard") {
   uri = environment.webApiBaseUrl + environment.apiEndPoint.removeCard;
  }
  if (pageName == "Shelf") {
   uri = environment.webApiBaseUrl + environment.apiEndPoint.removeShelf;
  }
  if (pageName == "Port") {
   uri = environment.webApiBaseUrl + environment.apiEndPoint.removePort;
  }
  if (pageName == "Link") {
   uri = environment.webApiBaseUrl + environment.apiEndPoint.removeLink;
  }

  httpOptions.body = data;

  return this.http.request<string>("delete", uri, httpOptions);
 }

 getElementListByID(pageName, id): Observable<any> {
  return this.http.get(environment.baseUrl + environment.apiEndPoint.getDeviceDtl + "/" + id + "/" + pageName, { headers: headers });
 }

 getDeviceDataByID(pageName, id): Observable<any> {
  if (pageName == "Device") {
   return this.http.get(environment.baseUrl + environment.apiEndPoint.getDeviceData + "/" + id, { headers: headers });
  }

  if (pageName == "Shelf") {
   return this.http.get(environment.baseUrl + environment.apiEndPoint.GetShelfData + "/" + id, { headers: headers });
  }

  if (pageName == "Port") {
   return this.http.get(environment.baseUrl + environment.apiEndPoint.GetPortsData + "/" + id, { headers: headers });
  }

  if (pageName == "Card" || pageName == "ChildCard") {
   return this.http.get(environment.baseUrl + environment.apiEndPoint.GetCardData + "/" + id, { headers: headers });
  }

  if (pageName == "Link") {
   return this.http.get(environment.baseUrl + environment.apiEndPoint.GetLinkData + "/" + id, { headers: headers });
  }
 }
}
