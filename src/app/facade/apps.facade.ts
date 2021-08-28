import { Injectable } from "@nestjs/common";
import AppsAppService from "../appservices/apps.appservice";
import { AppsDto } from "src/submodules/cap-platform-dtos/appsDto";
import { AppsEntity } from "../../submodules/cap-platform-entities/apps.entity";
import FacadeBase from "./facadeBase";

@Injectable()
export class AppsFacade extends FacadeBase<AppsEntity,AppsDto>{
    constructor(private appsAppService: AppsAppService){
       super(appsAppService);
    }
}