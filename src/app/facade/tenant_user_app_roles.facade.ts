import { Injectable } from "@nestjs/common";
import Tenant_User_App_RolesAppService from "../appservices/tenant_user_app_roles.appservice";
import { Tenant_User_App_RolesDto } from "src/submodules/cap-platform-dtos/tenant_user_app_rolesDto";
import { Tenant_User_App_RolesEntity } from "../../submodules/cap-platform-entities/tenant_user_app_roles.entity";
import FacadeBase from "./facadeBase";

@Injectable()
export class Tenant_User_App_RolesFacade extends FacadeBase<Tenant_User_App_RolesEntity,Tenant_User_App_RolesDto>{
    constructor(private tenant_user_app_rolesAppService: Tenant_User_App_RolesAppService){
       super(tenant_user_app_rolesAppService);
    }
}