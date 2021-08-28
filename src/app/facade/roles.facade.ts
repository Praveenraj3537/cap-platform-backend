import { Injectable } from "@nestjs/common";
import RolesAppService from "../appservices/roles.appservice";
import { RolesDto } from "src/submodules/cap-platform-dtos/rolesDto";
import { RolesEntity } from "../../submodules/cap-platform-entities/roles.entity";
import FacadeBase from "./facadeBase";

@Injectable()
export class RolesFacade extends FacadeBase<RolesEntity,RolesDto>{
    constructor(private rolesAppService: RolesAppService){
       super(rolesAppService);
    }
}