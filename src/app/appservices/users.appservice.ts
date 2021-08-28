import { HttpService, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersDto } from "src/submodules/cap-platform-dtos/usersDto";
import { UsersEntity } from "../../submodules/cap-platform-entities/users.entity";
import AppService from "../../submodules/cap-platform-entities/cap-platform-framework/AppServiceBase";
import { Repository } from "typeorm";
let dto = require('./../.././submodules/cap-platform-mappers/users.mapper')

@Injectable()
export default class UsersAppService extends AppService<UsersEntity,UsersDto>{
    constructor(@InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>,public http:HttpService) {
        super(http,usersRepository,UsersEntity,UsersEntity,UsersDto,dto.usersentityJson, dto.usersdtoJson,dto.usersentityToDtoJson, dto.usersdtoToEntityJson);
             
    }

} 