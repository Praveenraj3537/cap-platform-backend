import { HttpService, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TenantsDto } from "src/submodules/cap-platform-dtos/tenantsDto";
import { TenantsEntity } from "../../submodules/cap-platform-entities/tenants.entity";
import AppService from "../../submodules/cap-platform-entities/cap-platform-framework/AppServiceBase";
import { Repository } from "typeorm";
let dto = require('./../.././submodules/cap-platform-mappers/tenants.mapper')

@Injectable()
export default class TenantsAppService extends AppService<TenantsEntity,TenantsDto>{
    constructor(@InjectRepository(TenantsEntity) private readonly tenantsRepository: Repository<TenantsEntity>,public http:HttpService) {
        super(http,tenantsRepository,TenantsEntity,TenantsEntity,TenantsDto,dto.tenantsentityJson, dto.tenantsdtoJson,dto.tenantsentityToDtoJson, dto.tenantsdtoToEntityJson);
             
    }

} 