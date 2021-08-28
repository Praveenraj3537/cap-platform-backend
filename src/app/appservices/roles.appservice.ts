import { HttpService, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolesDto } from "src/submodules/cap-platform-dtos/rolesDto";
import { RolesEntity } from "../../submodules/cap-platform-entities/roles.entity";
import AppService from "../../submodules/cap-platform-entities/cap-platform-framework/AppServiceBase";
import { Repository } from "typeorm";
let dto = require('./../.././submodules/cap-platform-mappers/roles.mapper')

@Injectable()
export default class RolesAppService extends AppService<RolesEntity,RolesDto>{
    constructor(@InjectRepository(RolesEntity) private readonly rolesRepository: Repository<RolesEntity>,public http:HttpService) {
        super(http,rolesRepository,RolesEntity,RolesEntity,RolesDto,dto.rolesentityJson, dto.rolesdtoJson,dto.rolesentityToDtoJson, dto.rolesdtoToEntityJson);
             
    }
} 