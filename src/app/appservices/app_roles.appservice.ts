import { HttpService, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { App_RolesDto } from "src/submodules/cap-platform-dtos/app_rolesDto";
import { App_RolesEntity } from "../../submodules/cap-platform-entities/app_roles.entity";
import AppService from "../../submodules/cap-platform-entities/cap-platform-framework/AppServiceBase";
import { Repository } from "typeorm";
let dto = require('./../.././submodules/cap-platform-mappers/app_roles.mapper')

@Injectable()
export default class App_RolesAppService extends AppService<App_RolesEntity,App_RolesDto>{
    constructor(@InjectRepository(App_RolesEntity) private readonly app_rolesRepository: Repository<App_RolesEntity>,public http:HttpService) {
        super(http,app_rolesRepository,App_RolesEntity,App_RolesEntity,App_RolesDto,dto.app_rolesentityJson, dto.app_rolesdtoJson,dto.app_rolesentityToDtoJson, dto.app_rolesdtoToEntityJson);
             
    }

} 