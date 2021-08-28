import { Injectable } from "@nestjs/common";
import UsersAppService from "../appservices/users.appservice";
import { UsersDto } from "src/submodules/cap-platform-dtos/usersDto";
import { UsersEntity } from "../../submodules/cap-platform-entities/users.entity";
import FacadeBase from "./facadeBase";

@Injectable()
export class UsersFacade extends FacadeBase<UsersEntity,UsersDto>{
    constructor(private usersAppService: UsersAppService){
       super(usersAppService);
    }
}