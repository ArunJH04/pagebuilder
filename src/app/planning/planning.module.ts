import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PlanningRoutingModule } from "./planning-routing.module";
import { ListItemsComponent } from "./list-items/list-items.component";
import { AddItemsComponent } from "./add-items/add-items.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ServiceService } from "../service.service";
import { GraphItemsComponent } from "./graph-items/graph-items.component";
import { NotifierModule, NotifierOptions } from "angular-notifier";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgSelectComponent, NgSelectModule } from "@ng-select/ng-select";

/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
 position: {
  horizontal: {
   position: "right",
   distance: 12,
  },
  vertical: {
   position: "top",
   distance: 12,
   gap: 10,
  },
 },
 theme: "material",
 behaviour: {
  autoHide: 5000,
  onClick: "hide",
  onMouseover: "pauseAutoHide",
  showDismissButton: true,
  stacking: 4,
 },
 animations: {
  enabled: true,
  show: {
   preset: "slide",
   speed: 300,
   easing: "ease",
  },
  hide: {
   preset: "fade",
   speed: 300,
   easing: "ease",
   offset: 50,
  },
  shift: {
   speed: 300,
   easing: "ease",
  },
  overlap: 150,
 },
};
@NgModule({
 declarations: [ListItemsComponent, AddItemsComponent, GraphItemsComponent],
 imports: [CommonModule, PlanningRoutingModule, Ng2SearchPipeModule, FormsModule, NgSelectModule, ReactiveFormsModule, HttpClientModule, NgxSpinnerModule, NotifierModule.withConfig(customNotifierOptions)],

 exports: [ListItemsComponent, AddItemsComponent, GraphItemsComponent],
 providers: [ServiceService, ListItemsComponent, AddItemsComponent],
})
export class PlanningModule {}
