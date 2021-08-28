import { HttpService, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientsDto } from "src/submodules/cap-platform-dtos/clientsDto";
import { ClientsEntity } from "../../submodules/cap-platform-entities/clients.entity";
import AppService from "../../submodules/cap-platform-entities/cap-platform-framework/AppServiceBase";
import { Repository } from "typeorm";
let dto = require('./../.././submodules/cap-platform-mappers/clients.mapper')

@Injectable()
export default class ClientsAppService extends AppService<ClientsEntity,ClientsDto>{
    constructor(@InjectRepository(ClientsEntity) private readonly clientsRepository: Repository<ClientsEntity>,public http:HttpService) {
        super(http,clientsRepository,ClientsEntity,ClientsEntity,ClientsDto,dto.clientsentityJson, dto.clientsdtoJson,dto.clientsentityToDtoJson, dto.clientsdtoToEntityJson);
             
    }

} 