import { Injectable } from "@nestjs/common";
import Feature_PermissionsAppService from "../appservices/feature_permissions.appservice";
import { Feature_PermissionsDto } from "src/submodules/cap-platform-dtos/feature_permissionsDto";
import { Feature_PermissionsEntity } from "../../submodules/cap-platform-entities/feature_permissions.entity";
import FacadeBase from "./facadeBase";

@Injectable()
export class Feature_PermissionsFacade extends FacadeBase<Feature_PermissionsEntity,Feature_PermissionsDto>{
    constructor(private feature_permissionsAppService: Feature_PermissionsAppService){
       super(feature_permissionsAppService);
    }
}