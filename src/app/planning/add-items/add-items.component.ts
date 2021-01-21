import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PlanningService } from '../planning.service';
import { Location } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
// import { map } from "rxjs/operators";

import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.css'],
})
export class AddItemsComponent implements OnInit {
  myFormGroup: FormGroup;
  // formTemplate: any = form_template;
  childOptionsList: any[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private planningService: PlanningService,
    private _location: Location,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}
  pageId;
  pageName;
  formElements;
  submitAction;
  ngOnInit() {
    this.myFormGroup = new FormGroup({});
    this.route.params.subscribe((params: Params) => {
      this.pageId = params.id;
      this.pageName = params.pageName;
    });
    this.planningService.createPageItems(this.pageId).subscribe((data: any) => {
      this.formElements = data.tabs_list[0].elements_list;
      // console.log(this.formElements);
      this.formElements.forEach((input_template) => {
        this.myFormGroup.addControl(
          input_template.api_param_name,
          new FormControl('')
        );
      });
    });
  }

  onSubmit() {
    // console.log(this.myFormGroup.value);
    this.formElements.forEach((element) => {
      if (
        element.element_name === 'Finish' &&
        element.element_type === 'button'
      ) {
        this.submitAction = element.element_action;
      }
    });
    this.myFormGroup.value.uid = environment.uid;
    this.myFormGroup.value.orderid = environment.orderid;

    console.log('myFormGroup' + JSON.stringify(this.myFormGroup.value));

    this.planningService
      .createPageValues(this.submitAction, this.myFormGroup.value)
      .subscribe((res) => {
        // console.log(res);
        if (res.status === 200) {
          alert(res.message);
          this.router.navigate([
            '/planning/list-items',
            { pageName: this.pageName, id: this.pageId },
          ]);
        }
      });
  }

  bindChildDropDownList(
    tab_element_id,
    child_element_id,
    event,
    element_action
  ) {
    if (element_action != null) {
      var child_element_Value = event.target.value;
      const selectEl = event.target;
      const selectedVal = selectEl.options[selectEl.selectedIndex].getAttribute(
        'data-val'
      );
      if (selectedVal == '') {
        return;
      }
      this.http
        .get(element_action + '/' + child_element_id + '/' + selectedVal)
        .pipe(map((res) => JSON.parse(JSON.stringify(res))))
        .subscribe((data) => {
          if (data.status == 'success')
            this.childOptionsList = data.child_options_list;
          for (let i = 0; i < this.childOptionsList.length; i++) {
            var childObj = this.childOptionsList[i];
            // console.log("val1=" + childObj.tabElementId);
            var element_id = childObj.tabElementId;
            var child_element_options = childObj.tabelement_options;

            $('#' + element_id.trim())
              .find('option')
              .remove();

            $('#' + element_id).append(
              $('<option></option>')
                .attr('value', -1)
                .attr('selected', true)
                .text('Please Select')
            );

            $.each(child_element_options, function (key, value) {
              // console.log(
              //   "key-->" +
              //     value.opt_id +
              //     " value---->" +
              //     value.opt_value +
              //     " selectedvalue---->" +
              //     value.opt_selected_value
              // );
              $('#' + element_id).append(
                $('<option></option>')
                  .attr('value', value.opt_id)
                  .attr('data-val', value.opt_selected_value)
                  .text(value.opt_value)
              );
            });
          }
        });
    }
  }

  discardFunc() {
    // this._location.back();

    let url = '/planning/list-items/' + this.pageName + '/' + this.pageId + '';
    // console.log(url);
    return url;

    // this.router.navigate([
    //   "/planning/list-items",
    //   { pageName: this.pageName, id: this.pageId },
    // ]);
  }
}
