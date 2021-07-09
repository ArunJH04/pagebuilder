import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfigurationService } from '../configuration.service';
import { NavigationStart, Router } from '@angular/router';
@Component({
  selector: 'app-view-config',
  templateUrl: './view-config.component.html',
  styleUrls: ['./view-config.component.css'],
})
export class ViewConfigComponent implements OnInit {
  @Output() myEvent = new EventEmitter();

  availableFileNames: any = [];
  fileContentDiv = false;
  fileContent;
  allDevices: any = [];
  showConfigForm: FormGroup;
  previousUrl: string;
  deviceData: any;

  radioSel: any;
  radioSelected: string;
  radioSelectedString: string;

  constructor(
    private configurationService: ConfigurationService,
    public router: Router
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.previousUrl = this.router.url;
      }
    });

    this.deviceData = JSON.parse(localStorage.getItem('selectedDev'));

    this.showConfigForm = new FormGroup({
      date: new FormControl(),
    });
    console.log(this.deviceData[0].deviceId);
  }

  onItemChange(item) {
    // this.getSelecteditem();
  }

  // getSelecteditem() {
  //   this.radioSel = this.availableFileNames.find(
  //     (Item) => Item === this.radioSelected
  //   );
  //   this.radioSelectedString = JSON.stringify(this.radioSel);
  // }

  showFileDetails(fName) {
    let obj = {
      fileName: fName,
    };
    this.configurationService.getFileDetails(obj).subscribe((res) => {
      console.log(res);
      this.fileContent = res[0].fileContent;
    });
    this.fileContentDiv = true;
  }

  public routeHome(deviceId): void {
    this.myEvent.emit(deviceId);
  }

  getFiles() {
    let data = this.showConfigForm.value;
    console.log(data);

    let d = new Date(data.date);
    let dd = this.epoch(d.toDateString());
    const timestamp = this.epoch(data.date);
    console.log(timestamp);
    let obj = {
      d: dd.toString().substring(0, 3),
      timestamp: timestamp,
      deviceId: this.deviceData[0].deviceId,
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
}
