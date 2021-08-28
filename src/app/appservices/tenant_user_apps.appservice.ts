import { HttpService, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tenant_User_AppsDto } from "src/submodules/cap-platform-dtos/tenant_user_appsDto";
import { Tenant_User_AppsEntity } from "../../submodules/cap-platform-entities/tenant_user_apps.entity";
import AppService from "../../submodules/cap-platform-entities/cap-platform-framework/AppServiceBase";
import { Repository } from "typeorm";
let dto = require('./../.././submodules/cap-platform-mappers/tenant_user_apps.mapper')

@Injectable()
export default class Tenant_User_AppsAppService extends AppService<Tenant_User_AppsEntity,Tenant_User_AppsDto>{
    constructor(@InjectRepository(Tenant_User_AppsEntity) private readonly tenant_user_appsRepository: Repository<Tenant_User_AppsEntity>,public http:HttpService) {
        super(http,tenant_user_appsRepository,Tenant_User_AppsEntity,Tenant_User_AppsEntity,Tenant_User_AppsDto,dto.tenant_user_appsentityJson, dto.tenant_user_appsdtoJson,dto.tenant_user_appsentityToDtoJson, dto.tenant_user_appsdtoToEntityJson);
             
    }

} 