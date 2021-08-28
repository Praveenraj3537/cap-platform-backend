import { Injectable } from "@nestjs/common";
import ClientsAppService from "../appservices/clients.appservice";
import { ClientsDto } from "src/submodules/cap-platform-dtos/clientsDto";
import { ClientsEntity } from "../../submodules/cap-platform-entities/clients.entity";
import FacadeBase from "./facadeBase";

@Injectable()
export class ClientsFacade extends FacadeBase<ClientsEntity,ClientsDto>{
    constructor(private clientsAppService: ClientsAppService){
       super(clientsAppService);
    }
}