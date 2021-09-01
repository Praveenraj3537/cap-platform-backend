import { Body,Query, Controller, Delete, Get, HttpException, HttpStatus, Inject, Injectable, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { Tenant_UsersFacade } from '../facade/tenant_users.facade';
import { ResponseModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/ResponseModel';
import { SNS_SQS } from 'src/submodules/cap-platform-rabbitmq-back/SNS_SQS';
import { Tenant_UsersDto } from 'src/submodules/cap-platform-dtos/tenant_usersDto';
import { RequestModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModel';
import { Message } from 'src/submodules/cap-platform-dtos/cap-platform-common/Message';
import { App_RolesDto } from 'src/submodules/cap-platform-dtos/app_rolesDto';
import { Request } from 'express';
import { RequestModelQuery } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModelQuery';
import { ApiTags, ApiResponseProperty} from '@nestjs/swagger';

@ApiTags('Tenant Users')
@Controller('tenant_users')
export class Tenant_UsersRoutes{

  constructor(private tenant_usersFacade : Tenant_UsersFacade) { }

  private sns_sqs = SNS_SQS.getInstance();
  private topicArray = ['TENANT_USERS_ADD','TENANT_USERS_UPDATE','TENANT_USERS_DELETE'];
  private serviceName = ['TENANT_USERS_SERVICE','TENANT_USERS_SERVICE','TENANT_USERS_SERVICE'];
  
  onModuleInit() {
   
    for (var i = 0; i < this.topicArray.length; i++) {
      this.sns_sqs.listenToService(this.topicArray[i], this.serviceName[i], (() => {
        let value = this.topicArray[i];
        return async (result) => {
          console.log("Result is........" + JSON.stringify(result));
          try {
            let responseModelOfTenant_UsersDto: ResponseModel<Tenant_UsersDto> = null;
            console.log(`listening to  ${value} topic.....result is....`);
            // ToDo :- add a method for removing queue message from queue....
            switch (value) {
              case 'TENANT_USERS_ADD':
                console.log("Inside PRODUCT_ADD Topic");
                responseModelOfTenant_UsersDto = await this.createTenant_Users(result["message"]);
                break;
              case 'TENANT_USERS_UPDATE':
                  console.log("Inside PRODUCT_UPDATE Topic");
                  responseModelOfTenant_UsersDto = await this.updatetenant_users(result["message"]);
                  break;
              case 'TENANT_USERS_DELETE':
                    console.log("Inside PRODUCT_DELETE Topic");
                    responseModelOfTenant_UsersDto = await this.deleteTenant_Users(result["message"]);
                    break;
  
            }
  
            console.log("Result of aws of GroupRoutes  is...." + JSON.stringify(result));
            let requestModelOfTenant_UsersDto: RequestModel<Tenant_UsersDto> = result["message"];
            responseModelOfTenant_UsersDto.setSocketId(requestModelOfTenant_UsersDto.SocketId)
            responseModelOfTenant_UsersDto.setCommunityUrl(requestModelOfTenant_UsersDto.CommunityUrl);
            responseModelOfTenant_UsersDto.setRequestId(requestModelOfTenant_UsersDto.RequestGuid);
            responseModelOfTenant_UsersDto.setStatus(new Message("200", "Group Inserted Successfully", null));

            for (let index = 0; index < result.OnSuccessTopicsToPush.length; index++) {
              const element = result.OnSuccessTopicsToPush[index];
              console.log("ELEMENT: ", JSON.stringify(responseModelOfTenant_UsersDto));
              this.sns_sqs.publishMessageToTopic(element, responseModelOfTenant_UsersDto)
            }
          }
          catch (error) {
            console.log("Inside Catch.........");
            console.log(error, result);
            for (let index = 0; index < result.OnFailureTopicsToPush.length; index++) {
              const element = result.OnFailureTopicsToPush[index];
              let errorResult: ResponseModel<Tenant_UsersDto> = new ResponseModel<Tenant_UsersDto>(null,null,null,null,null,null,null,null,null);;
              errorResult.setStatus(new Message("500",error,null));


              let requestModelOfApp_RolesDto: RequestModel<App_RolesDto> = result["message"];

              errorResult.setSocketId(requestModelOfApp_RolesDto.SocketId);
              errorResult.setCommunityUrl(requestModelOfApp_RolesDto.CommunityUrl);
              errorResult.setRequestId(requestModelOfApp_RolesDto.RequestGuid);
              console.log("Socket is Inside catch:...", requestModelOfApp_RolesDto.SocketId);
              console.log(errorResult);
              

              this.sns_sqs.publishMessageToTopic(element, errorResult);
            }
          }
        }
      })())
    }

  }


  @ApiResponseProperty()
  @Get()
  allTenant_Userss() {
    try {
      console.log("Inside controller ......STUDENT");
      return this.tenant_usersFacade.getAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Post("/") 
  async createTenant_Users(@Body() body:RequestModel<Tenant_UsersDto>): Promise<ResponseModel<Tenant_UsersDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside CreateTenant_Users of controller....body id" + JSON.stringify(body));
      let result = await this.tenant_usersFacade.create(body);
   
      return result;
      // return null;
    } catch (error) {
       console.log("Error is....." + error);
       throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Put("/")
  async updatetenant_users(@Body() body: RequestModel<Tenant_UsersDto>): Promise<ResponseModel<Tenant_UsersDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside updateProduct of controller....body id" + JSON.stringify(body));

      console.log("Executing update query..............")
      return await this.tenant_usersFacade.update(body);
    } catch (error) {
      console.log("Error is....." + error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Delete('/')
  deleteTenant_Users(@Body() body:RequestModel<Tenant_UsersDto>): Promise<ResponseModel<Tenant_UsersDto>>{
    try {
      console.log("body: ",body)
      return this.tenant_usersFacade.deleteById(body);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @ApiResponseProperty()
  @Delete('/:id')
  deleteTenant_Usersbyid(@Param('id') id) {
    try {
      console.log("delete by id: ",id)
      return this.tenant_usersFacade.deleteByIds(id);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @ApiResponseProperty()
  @Get('/search')
  async search(@Req() request:Request){
    try{
      console.log("Inside search function tenatn_users:route");
      let requestmodelquery: RequestModelQuery = JSON.parse(request.headers['requestmodel'].toString());

      console.log(JSON.stringify(requestmodelquery));
      console.log(JSON.stringify(requestmodelquery.Filter));

      return this.tenant_usersFacade.search(requestmodelquery);
    }
    catch(error)
    {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @ApiResponseProperty()
  @Get('/:id')
  readOne(@Param('id') id) {
    return this.tenant_usersFacade.readOne(id);
  }


}