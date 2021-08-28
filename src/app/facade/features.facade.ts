import { Injectable } from "@nestjs/common";
import FeaturesAppService from "../appservices/features.appservice";
import { FeaturesDto } from "src/submodules/cap-platform-dtos/featuresDto";
import { FeaturesEntity } from "../../submodules/cap-platform-entities/features.entity";
import FacadeBase from "./facadeBase";

@Injectable()
export class FeaturesFacade extends FacadeBase<FeaturesEntity,FeaturesDto>{
    constructor(private featuresAppService: FeaturesAppService){
       super(featuresAppService);
    }
}