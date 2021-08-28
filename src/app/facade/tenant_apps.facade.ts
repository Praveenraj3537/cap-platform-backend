import { Injectable } from "@nestjs/common";
import Tenant_AppsAppService from "../appservices/tenant_apps.appservice";
import { Tenant_AppsDto } from "src/submodules/cap-platform-dtos/tenant_appsDto";
import { Tenant_AppsEntity } from "../../submodules/cap-platform-entities/tenant_apps.entity";
import FacadeBase from "./facadeBase";

@Injectable()
export class Tenant_AppsFacade extends FacadeBase<Tenant_AppsEntity,Tenant_AppsDto>{
    constructor(private tenant_appsAppService: Tenant_AppsAppService){
       super(tenant_appsAppService);
    }
}