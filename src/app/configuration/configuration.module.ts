import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { ConfigurationRoutingModule } from "./configuration-routing.module";
import { DeviceGroupComponent } from "./device-group/device-group.component";
import { UserAdminComponent } from "./user-admin/user-admin.component";
import { DeviceAdminComponent } from "./device-admin/device-admin.component";
import { NgxTextDiffModule } from "ngx-text-diff";
import { AddDeviceItemsComponent } from "./add-device-items/add-device-items.component";

@NgModule({
 declarations: [DeviceGroupComponent, UserAdminComponent, DeviceAdminComponent, AddDeviceItemsComponent],
 imports: [CommonModule, Ng2SearchPipeModule, FormsModule, ReactiveFormsModule, HttpClientModule, ConfigurationRoutingModule, NgxTextDiffModule],
 exports: [AddDeviceItemsComponent],
})
export class ConfigurationModule {}
