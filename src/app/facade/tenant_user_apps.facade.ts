import { Injectable } from "@nestjs/common";
import Tenant_User_AppsAppService from "../appservices/tenant_user_apps.appservice";
import { Tenant_User_AppsDto } from "src/submodules/cap-platform-dtos/tenant_user_appsDto";
import { Tenant_User_AppsEntity } from "../../submodules/cap-platform-entities/tenant_user_apps.entity";
import FacadeBase from "./facadeBase";

@Injectable()
export class Tenant_User_AppsFacade extends FacadeBase<Tenant_User_AppsEntity,Tenant_User_AppsDto>{
    constructor(private tenant_user_appsAppService: Tenant_User_AppsAppService){
       super(tenant_user_appsAppService);
    }
}