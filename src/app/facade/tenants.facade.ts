import { Injectable } from "@nestjs/common";
import TenantsAppService from "../appservices/tenants.appservice";
import { TenantsDto } from "src/submodules/cap-platform-dtos/tenantsDto";
import { TenantsEntity } from "../../submodules/cap-platform-entities/tenants.entity";
import FacadeBase from "./facadeBase";

@Injectable()
export class TenantsFacade extends FacadeBase<TenantsEntity,TenantsDto>{
    constructor(private tenantsAppService: TenantsAppService){
       super(tenantsAppService);
    }
}