import { Injectable } from "@nestjs/common";
import Tenant_UsersAppService from "../appservices/tenant_users.appservice";
import { Tenant_UsersDto } from "src/submodules/cap-platform-dtos/tenant_usersDto";
import { Tenant_UsersEntity } from "../../submodules/cap-platform-entities/tenant_users.entity";
import FacadeBase from "./facadeBase";

@Injectable()
export class Tenant_UsersFacade extends FacadeBase<Tenant_UsersEntity,Tenant_UsersDto>{
    constructor(private tenant_usersAppService: Tenant_UsersAppService){
       super(tenant_usersAppService);
    }
}