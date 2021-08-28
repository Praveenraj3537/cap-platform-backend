import { HttpService, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FeaturesDto } from "src/submodules/cap-platform-dtos/featuresDto";
import { FeaturesEntity } from "../../submodules/cap-platform-entities/features.entity";
import AppService from "../../submodules/cap-platform-entities/cap-platform-framework/AppServiceBase";
import { Repository } from "typeorm";
let dto = require('./../.././submodules/cap-platform-mappers/features.mapper')

@Injectable()
export default class FeaturesAppService extends AppService<FeaturesEntity,FeaturesDto>{
    constructor(@InjectRepository(FeaturesEntity) private readonly featuresRepository: Repository<FeaturesEntity>,public http:HttpService) {
        super(http,featuresRepository,FeaturesEntity,FeaturesEntity,FeaturesDto,dto.featuresentityJson, dto.featuresdtoJson,dto.featuresentityToDtoJson, dto.featuresdtoToEntityJson);
             
    }

} 