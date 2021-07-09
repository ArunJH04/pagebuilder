import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfigurationService } from '../configuration.service';
import { Observable, Subject } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
export interface DiffCompareConfig {
  leftContent: string;
  rightContent: string;
}

@Component({
  selector: 'app-compare-config',
  templateUrl: './compare-config.component.html',
  styleUrls: ['./compare-config.component.css'],
})
export class CompareConfigComponent implements OnInit {
  closeResult = '';
  availableFile1Names: any = [];
  availableFile2Names: any = [];

  fileContentDiv = false;
  fileContent;
  allDevices: any = [];
  showConfigForm: FormGroup;
  deviceData;
  leftSideCompareVar: string;
  rightSideCompareVar: string;
  compareTextContent: any = [];
  showToolbar: boolean = true;
  searchText;

  radioSel1: any;
  radioSel2: any;
  radioSelected1: string;
  radioSelected2: string;
  radioSelectedString1: string;
  radioSelectedString2: string;

  contentObservable: Subject<DiffCompareConfig> =
    new Subject<DiffCompareConfig>();
  contentObservable$: Observable<DiffCompareConfig> =
    this.contentObservable.asObservable();

  constructor(
    private modalService: NgbModal,
    private configurationService: ConfigurationService
  ) {}

  ngOnInit() {
    this.deviceData = JSON.parse(localStorage.getItem('selectedDev'));

    this.showConfigForm = new FormGroup({
      fDate: new FormControl(),
      sDate: new FormControl(),
    });

    this.showToolbar = false;

    console.log(this.deviceData[0].deviceId);
  }

  getSelecteditem1() {
    this.radioSel1 = this.availableFile1Names.find(
      (Item) => Item === this.radioSelected1
    );
    this.radioSelectedString1 = JSON.stringify(this.radioSel1);
  }

  onItem1Change(item) {
    this.getSelecteditem1();
  }

  getSelecteditem2() {
    this.radioSel2 = this.availableFile2Names.find(
      (Item) => Item === this.radioSelected2
    );
    this.radioSelectedString2 = JSON.stringify(this.radioSel2);
  }

  onItem2Change(item) {
    this.getSelecteditem2();
  }

  showFileDetails(content) {
    this.fileContentDiv = true;
    this.fileContent = content;
  }

  toggle() {
    var slider = document.getElementById('slider');
    var isOpen = slider.classList.contains('slide-in');
    slider.setAttribute('class', isOpen ? 'slide-out' : 'slide-in');
  }

  filterValues(event) {
    this.searchText = event.target.value;
  }

  getResults() {
    let obj = {
      fileName1: JSON.parse(this.radioSelectedString1),
      fileName2: JSON.parse(this.radioSelectedString2),
    };
    this.configurationService.getCompareFileInfo(obj).subscribe((data: any) => {
      this.compareTextContent = data;
      this.leftSideCompareVar = this.compareTextContent[0].replace(
        /[\r\"\']/g,
        ''
      );
      this.rightSideCompareVar = this.compareTextContent[1].replace(
        /[\r\"\']/g,
        ''
      );
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
    });

    this.fileContentDiv = true;

    this.toggle();
  }

  getFiles() {
    let data = this.showConfigForm.value;
    // console.log(data.date.toDateString());

    let fd = new Date(data.fDate);
    let sd = new Date(data.sDate);

    let fdd = this.epoch(fd.toDateString());
    let sdd = this.epoch(sd.toDateString());

    const timestamp1 = this.epoch(data.fDate);
    const timestamp2 = this.epoch(data.sDate);

    let obj = {
      fd: fdd.toString().substring(0, 3),
      sd: sdd.toString().substring(0, 3),
      timestamp1: Math.floor(timestamp1 / 1000),
      timestamp2: Math.floor(timestamp2 / 1000),
      deviceId: this.deviceData[0].deviceId,
    };

    console.log(obj);

    this.configurationService.getCompareFiles(obj).subscribe((data: any) => {
      this.availableFile1Names = data[0];
      this.availableFile2Names = data[1];
    });
  }

  epoch(date) {
    return Date.parse(date);
  }
}
