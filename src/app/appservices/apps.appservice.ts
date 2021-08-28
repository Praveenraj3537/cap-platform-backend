import { HttpService, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AppsDto } from "src/submodules/cap-platform-dtos/appsDto";
import { AppsEntity } from "../../submodules/cap-platform-entities/apps.entity";
import AppService from "../../submodules/cap-platform-entities/cap-platform-framework/AppServiceBase";
import { Repository } from "typeorm";
let dto = require('./../.././submodules/cap-platform-mappers/apps.mapper')

@Injectable()
export default class AppsAppService extends AppService<AppsEntity,AppsDto>{
    constructor(@InjectRepository(AppsEntity) private readonly appsRepository: Repository<AppsEntity>,public http:HttpService) {
        super(http,appsRepository,AppsEntity,AppsEntity,AppsDto,dto.appsentityJson, dto.appsdtoJson,dto.appsentityToDtoJson, dto.appsdtoToEntityJson);
             
    }

} 