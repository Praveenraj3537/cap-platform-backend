import { Injectable } from "@nestjs/common";
import App_MessagesAppService from "../appservices/app_messages.appservice";
import { App_MessagesDto } from "src/submodules/cap-platform-dtos/app_messagesDto";
import { App_MessagesEntity } from "../../submodules/cap-platform-entities/app_messages.entity";
import FacadeBase from "./facadeBase";

@Injectable()
export class App_MessagesFacade extends FacadeBase<App_MessagesEntity,App_MessagesDto>{
    constructor(private app_messagesAppService: App_MessagesAppService){
       super(app_messagesAppService);
    }
}