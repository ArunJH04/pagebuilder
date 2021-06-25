import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DeviceAdminComponent } from "./device-admin/device-admin.component";
import { DeviceGroupComponent } from "./device-group/device-group.component";
import { UserAdminComponent } from "./user-admin/user-admin.component";
import { AddDeviceItemsComponent } from "./add-device-items/add-device-items.component";

const routes: Routes = [
 { path: "", redirectTo: "Device Admin", pathMatch: "full" },
 { path: "Device Admin/:id", component: DeviceAdminComponent },
 { path: "Device Group/:id", component: DeviceGroupComponent },
 { path: "User Admin", component: UserAdminComponent },
 { path: "add-device-items/:pageName/:id", component: AddDeviceItemsComponent },
];

@NgModule({
 imports: [RouterModule.forChild(routes)],
 exports: [RouterModule],
})
export class ConfigurationRoutingModule {}
