import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ConfigurationService } from '../../configuration/configuration.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ServiceService } from '../../service.service';
import { Subscription } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';

export interface DiffCompareConfig {
  leftContent: string;
  rightContent: string;
}
@Component({
  selector: 'app-device-admin',
  templateUrl: './device-admin.component.html',
  styleUrls: ['./device-admin.component.css'],
})
export class DeviceAdminComponent implements OnInit {
  showConfigForm: FormGroup;
  pushConfigForm: FormGroup;
  changeScheduleForm: FormGroup;

  rightDivShow: boolean = false;
  leftDivShow: boolean = true;
  deviceCommand;
  deviceFrequency;
  deviceGroup;
  pageId;
  pageName;
  searchText;
  allDevices: any = [];
  fileContent;
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
  closeResult: string;
  availableFileNames: any = [];
  fileContentDiv = false;
  fileNameDiv: boolean = false;
  contentObservable: Subject<DiffCompareConfig> =
    new Subject<DiffCompareConfig>();
  contentObservable$: Observable<DiffCompareConfig> =
    this.contentObservable.asObservable();
  element_options = [];
  deviceStatus = [
    { id: 0, value: 'Disabled' },
    { id: 1, value: 'Enabled' },
  ];
  fileToUpload: File;
  uploadedFiles = [];
  selectedDeviceId;
  showAddComponent: boolean = true;
  showViewConfigComponent: boolean = false;
  showCompareConfigComponent: boolean = false;

  constructor(
    private router: Router,
    private configurationService: ConfigurationService,
    private route: ActivatedRoute,
    private appService: ServiceService,
    private modalService: NgbModal
  ) {
    this.subscriptionName = this.appService.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      this.messageReceived = message.text;
      this.pageName = this.messageReceived.pageName;
      this.pageId = this.messageReceived.pageID;
    });
  }

  getAdhocReqFiles(deviceAdminDtls) {
    let curDate = new Date();
    console.log(deviceAdminDtls);

    const timestamp = 1530433800; //this.epoch(curDate);
    let obj = {
      timestamp: timestamp,
      deviceId: deviceAdminDtls[0].deviceId,
    };
    console.log(obj);

    this.configurationService
      .showRunLogFilesInfo(obj)
      .subscribe((data: any) => {
        this.availableFileNames = data;
        console.log(this.availableFileNames);
      });
  }

  viewConfig(data) {
    localStorage.setItem('selectedDev', JSON.stringify(data));
    this.showViewConfigComponent = true;
    this.showAddComponent = false;
    this.showCompareConfigComponent = false;
  }

  compConfig(data) {
    localStorage.setItem('selectedDev', JSON.stringify(data));
    this.showCompareConfigComponent = true;
    this.showViewConfigComponent = false;
    this.showAddComponent = false;
  }

  showAddComp() {
    let pageType = localStorage.getItem('pageType');
    let elementID = localStorage.getItem('elementID');
    let pageName = localStorage.getItem('pageName');
    let pageID = localStorage.getItem('pageID');

    this.showViewConfigComponent = false;
    this.showAddComponent = true;
    this.showCompareConfigComponent = false;
    this.pageName = 'Device Admin';
    let elementDetails = {
      pageType: pageType,
      elementID: elementID,
      pageName: pageName,
      pageID: pageID,
      funcType: 'edit',
    };

    this.sendElementMessage(elementDetails);

    this.elementID = elementDetails.elementID;
  }

  fileChange(element) {
    this.uploadedFiles = element.target.files;
  }

  upload() {
    let formData = new FormData();
    for (var i = 0; i < this.uploadedFiles.length; i++) {
      formData.append(
        'uploads[]',
        this.uploadedFiles[i],
        this.uploadedFiles[i].name
      );
    }

    this.configurationService
      .uploadPushConfig(formData)
      .subscribe((data: any) => {
        console.log(data);
      });

    // this.http.post('/api/upload', formData)
    // .subscribe((response) => {
    //      console.log('response received is ', response);
    // })
  }

  getRunLogFiles() {
    let data = this.showConfigForm.value;
    // console.log(data.date.toDateString());

    let d = new Date(data.date);
    let dd = this.epoch(d.toDateString());
    const timestamp = this.epoch(data.date);
    console.log(timestamp);
    let obj = {
      d: dd.toString().substring(0, 3),
      timestamp: timestamp,
      deviceId: data.deviceName,
    };
    this.configurationService
      .showRunLogFilesInfo(obj)
      .subscribe((data: any) => {
        this.availableFileNames = data;
        console.log(this.availableFileNames);
      });
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  getFiles() {
    let data = this.showConfigForm.value;
    // console.log(data.date.toDateString());

    let d = new Date(data.date);
    let dd = this.epoch(d.toDateString());
    const timestamp = this.epoch(data.date);
    console.log(timestamp);
    let obj = {
      d: dd.toString().substring(0, 3),
      timestamp: timestamp,
      deviceId: data.deviceName,
    };
    this.configurationService
      .showConfigFilesInfo(obj)
      .subscribe((data: any) => {
        this.availableFileNames = data;
        console.log(this.availableFileNames);
      });
  }

  epoch(date) {
    return Date.parse(date);
  }

  selectedDevice(data) {
    this.showConfigForm.controls.someControl.patchValue(data.deviceId);

    // this.selectedDeviceId = data.deviceId;
    console.log(data.deviceId);
  }

  showFileDetails(content) {
    this.fileContentDiv = true;
    this.fileContent = content;
  }

  open(content) {
    // this.getFiles();
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  formatDate(dateVal) {
    var newDate = new Date(dateVal);

    var sMonth = this.padValue(newDate.getMonth() + 1);
    var sDay = this.padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    let sHour = newDate.getHours();
    var sMinute = this.padValue(newDate.getMinutes());
    var sAMPM = 'AM';

    var iHourCheck = parseInt(sHour.toString());

    if (iHourCheck > 12) {
      sAMPM = 'PM';
      sHour = iHourCheck - 12;
    } else if (iHourCheck === 0) {
      sHour = 12;
    }

    sHour = this.padValue(sHour);

    return (
      sMonth +
      '-' +
      sDay +
      '-' +
      sYear +
      ' ' +
      sHour +
      ':' +
      sMinute +
      ' ' +
      sAMPM
    );
  }

  padValue(value) {
    return value < 10 ? '0' + value : value;
  }

  getDeviceFrequency() {
    this.configurationService.getDeviceFrequency().subscribe((res: any) => {
      this.element_options = res;
    });
  }

  ngOnInit() {
    //   this.route.params.subscribe((params: Params) => {
    //    this.pageId = params.id;
    //    this.pageName = params.pageName;
    //   });
    this.changeScheduleForm = new FormGroup({
      changeSchedule: new FormControl(),
      changeFrequency: new FormControl(),
    });
    this.getDeviceFrequency();

    this.showConfigForm = new FormGroup({
      deviceName: new FormControl(),
      date: new FormControl(),
    });

    this.pushConfigForm = new FormGroup({
      pushConfig: new FormControl(),
    });

    this.configurationService.getDevices().subscribe((data: any) => {
      this.allDevices = data;
    });
    //   this.getDeviceCommand();
    //   this.getDeviceFrequency();
    //   this.getDeviceGroup();

    // this.configurationService.getCompareFileInfo().subscribe((data: any) => {
    //   this.compareTextContent = data;
    //   this.leftSideCompareVar = this.compareTextContent[0].replace(
    //     /[\r\"\']/g,
    //     ''
    //   );
    //   this.rightSideCompareVar = this.compareTextContent[1].replace(
    //     /[\r\"\']/g,
    //     ''
    //   );
    // });

    this.showToolbar = false;
  }

  routeToAddDetails() {
    let url = '/configuration/add/' + this.pageName + '/' + this.pageId + '';
    return url;
  }

  uploadFile() {
    // let files = {
    //   pushConfig: this.fileToUpload,
    // };

    const formData = new FormData();
    formData.append('pushConfig', this.fileToUpload);

    console.log(this.fileToUpload);

    this.configurationService
      .uploadPushConfig(formData)
      .subscribe((data: any) => {
        console.log(data);
      });

    // this.configurationService
    //   .uploadPushConfig(this.fileToUpload)
    //   .subscribe((res) => {
    //     console.log(res);
    //   });
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
        'fit-column line-number-col delete-row'
      );
      var tdLeftRearElements = document.getElementsByClassName(
        'fit-column prefix-col delete-row'
      );
      var tdLeftContentElements = document.getElementsByClassName(
        'content-col delete-row'
      );
      var highLightElements = document.getElementsByClassName('highlight');
      var tdRightHeadElements = document.getElementsByClassName(
        'fit-column line-number-col insert-row'
      );
      var tdRightRearElements = document.getElementsByClassName(
        'fit-column prefix-col insert-row'
      );
      var tdRightContentElements = document.getElementsByClassName(
        'content-col insert-row'
      );

      for (var i = 0; i < tdLeftHeadElements.length; i++) {
        tdLeftHeadElements[i].setAttribute(
          'style',
          'background-color: #FFFF00 !important'
        );
      }
      for (var j = 0; j < tdLeftRearElements.length; j++) {
        tdLeftRearElements[j].setAttribute(
          'style',
          'background-color: #FFFF00 !important'
        );
      }
      for (var k = 0; k < tdLeftContentElements.length; k++) {
        tdLeftContentElements[k].setAttribute(
          'style',
          'background-color: #FFFF00 !important'
        );
      }

      for (var l = 0; l < highLightElements.length; l++) {
        highLightElements[l].setAttribute(
          'style',
          'background-color: #FFFF00 !important'
        );
      }

      for (var m = 0; m < tdRightHeadElements.length; m++) {
        tdRightHeadElements[m].setAttribute(
          'style',
          'background-color: #FFFF00 !important'
        );
      }

      for (var n = 0; n < tdRightRearElements.length; n++) {
        tdRightRearElements[n].setAttribute(
          'style',
          'background-color: #FFFF00 !important'
        );
      }
      for (var o = 0; o < tdRightContentElements.length; o++) {
        tdRightContentElements[o].setAttribute(
          'style',
          'background-color: #FFFF00 !important'
        );
      }
    }, 0);
  }

  getRecord(elements) {
    this.showViewConfigComponent = false;
    this.showAddComponent = true;
    this.showCompareConfigComponent = false;

    this.pageName = 'Device Admin';
    let elementDetails = {
      pageType: this.pageName,
      elementID: elements.deviceId,
      pageName: this.pageName,
      pageID: this.pageId,
      funcType: 'show',
    };

    this.sendElementMessage(elementDetails);
    localStorage.setItem('pageType', this.pageName);
    localStorage.setItem('elementID', elementDetails.elementID);
    localStorage.setItem('pageName', this.pageName);
    localStorage.setItem('pageID', this.pageId);

    this.GetallDataByID(elementDetails.elementID, this.pageName);
  }

  sendElementMessage(pageDetails): void {
    console.log(pageDetails);

    this.appService.sendUpdate(pageDetails);
  }

  GetallDataByID(id, type) {
    this.deviceAdminDtls = null;
    this.configurationService
      .EditDetailsByID(type, id)
      .subscribe((data: any) => {
        //console.log(data.Details);
        this.deviceAdminDtls = data.Details;
      });
  }

  EditRecord(elements) {
    this.pageName = 'Device Admin';
    let elementDetails = {
      pageType: this.pageName,
      elementID: elements.deviceId,
      pageName: this.pageName,
      pageID: this.pageId,
      funcType: 'edit',
    };

    this.sendElementMessage(elementDetails);
    localStorage.setItem('pageType', this.pageName);
    localStorage.setItem('elementID', elementDetails.elementID);
    localStorage.setItem('pageName', this.pageName);
    localStorage.setItem('pageID', this.pageId);

    this.GetallDataByID(elementDetails.elementID, this.pageName);
  }
}
