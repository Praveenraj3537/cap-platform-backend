import { HttpService, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tenant_AppsDto } from "src/submodules/cap-platform-dtos/tenant_appsDto";
import { Tenant_AppsEntity } from "../../submodules/cap-platform-entities/tenant_apps.entity";
import AppService from "../../submodules/cap-platform-entities/cap-platform-framework/AppServiceBase";
import { Repository } from "typeorm";
let dto = require('./../.././submodules/cap-platform-mappers/tenant_apps.mapper')

@Injectable()
export default class Tenant_AppsAppService extends AppService<Tenant_AppsEntity,Tenant_AppsDto>{
    constructor(@InjectRepository(Tenant_AppsEntity) private readonly tenant_appsRepository: Repository<Tenant_AppsEntity>,public http:HttpService) {
        super(http,tenant_appsRepository,Tenant_AppsEntity,Tenant_AppsEntity,Tenant_AppsDto,dto.tenant_appsentityJson, dto.tenant_appsdtoJson,dto.tenant_appsentityToDtoJson, dto.tenant_appsdtoToEntityJson);
             
    }

} 