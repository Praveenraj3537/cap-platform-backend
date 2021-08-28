import { HttpService, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { App_MessagesDto } from "src/submodules/cap-platform-dtos/app_messagesDto";
import { App_MessagesEntity } from "../../submodules/cap-platform-entities/app_messages.entity"
import AppService from "../../submodules/cap-platform-entities/cap-platform-framework/AppServiceBase";
import { Repository } from "typeorm";
let dto = require('./../.././submodules/cap-platform-mappers/app_messages.mapper')

@Injectable()
export default class App_MessagesAppService extends AppService<App_MessagesEntity,App_MessagesDto>{
    constructor(@InjectRepository(App_MessagesEntity) private readonly app_messagesRepository: Repository<App_MessagesEntity>,public http:HttpService) {
        super(http,app_messagesRepository,App_MessagesEntity,App_MessagesEntity,App_MessagesDto,dto.app_messagesentityJson, dto.app_messagesdtoJson,dto.app_messagesentityToDtoJson, dto.app_messagesdtoToEntityJson);
             
    }

} 