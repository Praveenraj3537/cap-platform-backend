import { Injectable } from "@nestjs/common";
import Tenant_User_App_AlertsAppService from "../appservices/tenant_user_app_alerts.appservice";
import { Tenant_User_App_AlertsDto } from "src/submodules/cap-platform-dtos/tenant_user_app_alertsDto";
import { Tenant_User_App_AlertsEntity } from "../../submodules/cap-platform-entities/tenant_user_app_alerts.entity";
import FacadeBase from "./facadeBase";

@Injectable()
export class Tenant_User_App_AlertsFacade extends FacadeBase<Tenant_User_App_AlertsEntity,Tenant_User_App_AlertsDto>{
    constructor(private tenant_user_app_alertsAppService: Tenant_User_App_AlertsAppService){
       super(tenant_user_app_alertsAppService);
    }
}