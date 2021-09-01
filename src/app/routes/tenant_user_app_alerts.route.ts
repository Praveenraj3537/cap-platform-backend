import { Body,Query, Controller, Delete, Get, HttpException, HttpStatus, Inject, Injectable, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { Tenant_User_App_AlertsFacade } from '../facade/tenant_user_app_alerts.facade';
import { ResponseModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/ResponseModel';
import { SNS_SQS } from 'src/submodules/cap-platform-rabbitmq-back/SNS_SQS';
import { Tenant_User_App_AlertsDto } from 'src/submodules/cap-platform-dtos/tenant_user_app_alertsDto';
import { RequestModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModel';
import { Message } from 'src/submodules/cap-platform-dtos/cap-platform-common/Message';
import { App_RolesDto } from 'src/submodules/cap-platform-dtos/app_rolesDto';
import { Request } from 'express';
import { RequestModelQuery } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModelQuery';
import { ApiTags, ApiResponseProperty} from '@nestjs/swagger';

@ApiTags('Tenant User App Alerts')
@Controller('tenant_user_app_alerts')
export class Tenant_User_App_AlertsRoutes{

  constructor(private tenant_user_app_alertsFacade : Tenant_User_App_AlertsFacade) { }

  private sns_sqs = SNS_SQS.getInstance();
  private topicArray = ['TENANT_USER_APP_ALERTS_ADD','TENANT_USER_APP_ALERTS_UPDATE','TENANT_USER_APP_ALERTS_DELETE'];
  private serviceName = ['TENANT_USER_APP_ALERTS_SERVICE','TENANT_USER_APP_ALERTS_SERVICE','TENANT_USER_APP_ALERTS_SERVICE'];
  
  onModuleInit() {
   
    for (var i = 0; i < this.topicArray.length; i++) {
      this.sns_sqs.listenToService(this.topicArray[i], this.serviceName[i], (() => {
        let value = this.topicArray[i];
        return async (result) => {
          console.log("Result is........" + JSON.stringify(result));
          try {
            let responseModelOfTenant_User_App_AlertsDto: ResponseModel<Tenant_User_App_AlertsDto> = null;
            console.log(`listening to  ${value} topic.....result is....`);
            // ToDo :- add a method for removing queue message from queue....
            switch (value) {
              case 'TENANT_USER_APP_ALERTS_ADD':
                console.log("Inside PRODUCT_ADD Topic");
                responseModelOfTenant_User_App_AlertsDto = await this.createTenant_User_App_Alerts(result["message"]);
                break;
              case 'TENANT_USER_APP_ALERTS_UPDATE':
                  console.log("Inside PRODUCT_UPDATE Topic");
                  responseModelOfTenant_User_App_AlertsDto = await this.updatetenant_user_app_alerts(result["message"]);
                  break;
              case 'TENANT_USER_APP_ALERTS_DELETE':
                    console.log("Inside PRODUCT_DELETE Topic");
                    responseModelOfTenant_User_App_AlertsDto = await this.deleteTenant_User_App_Alerts(result["message"]);
                    break;
  
            }
  
            console.log("Result of aws of GroupRoutes  is...." + JSON.stringify(result));
            let requestModelOfTenant_User_App_AlertsDto: RequestModel<Tenant_User_App_AlertsDto> = result["message"];
            responseModelOfTenant_User_App_AlertsDto.setSocketId(requestModelOfTenant_User_App_AlertsDto.SocketId)
            responseModelOfTenant_User_App_AlertsDto.setCommunityUrl(requestModelOfTenant_User_App_AlertsDto.CommunityUrl);
            responseModelOfTenant_User_App_AlertsDto.setRequestId(requestModelOfTenant_User_App_AlertsDto.RequestGuid);
            responseModelOfTenant_User_App_AlertsDto.setStatus(new Message("200", "Group Inserted Successfully", null));

            for (let index = 0; index < result.OnSuccessTopicsToPush.length; index++) {
              const element = result.OnSuccessTopicsToPush[index];
              console.log("ELEMENT: ", JSON.stringify(responseModelOfTenant_User_App_AlertsDto));
              this.sns_sqs.publishMessageToTopic(element, responseModelOfTenant_User_App_AlertsDto)
            }
          }
          catch (error) {
            console.log("Inside Catch.........");
            console.log(error, result);
            for (let index = 0; index < result.OnFailureTopicsToPush.length; index++) {
              const element = result.OnFailureTopicsToPush[index];
              let errorResult: ResponseModel<Tenant_User_App_AlertsDto> = new ResponseModel<Tenant_User_App_AlertsDto>(null,null,null,null,null,null,null,null,null);;
              errorResult.setStatus(new Message("500",error,null))

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
  allTenant_User_App_Alertss() {
    try {
      console.log("Inside controller ......STUDENT");
      return this.tenant_user_app_alertsFacade.getAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Post("/") 
  async createTenant_User_App_Alerts(@Body() body:RequestModel<Tenant_User_App_AlertsDto>): Promise<ResponseModel<Tenant_User_App_AlertsDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside CreateTenant_User_App_Alerts of controller....body id" + JSON.stringify(body));
      let result = await this.tenant_user_app_alertsFacade.create(body);
   
      return result;
      // return null;
    } catch (error) {
       console.log("Error is....." + error);
       throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Put("/")
  async updatetenant_user_app_alerts(@Body() body: RequestModel<Tenant_User_App_AlertsDto>): Promise<ResponseModel<Tenant_User_App_AlertsDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside updateProduct of controller....body id" + JSON.stringify(body));

      console.log("Executing update query..............")
      return await this.tenant_user_app_alertsFacade.update(body);
    } catch (error) {
      console.log("Error is....." + error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Delete('/')
  deleteTenant_User_App_Alerts(@Body() body:RequestModel<Tenant_User_App_AlertsDto>): Promise<ResponseModel<Tenant_User_App_AlertsDto>>{
    try {
      console.log("body: ",body)
      return this.tenant_user_app_alertsFacade.deleteById(body);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @ApiResponseProperty()
  @Delete('/:id')
  deleteTenant_User_App_Alertsbyid(@Param('id') id) {
    try {
      console.log("delete by id: ",id)
      return this.tenant_user_app_alertsFacade.deleteByIds(id);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @ApiResponseProperty()
  @Get('/search')
  async search(@Req() request:Request){
    try{
      console.log("Inside search function tenant_user_app:route");
      let requestmodelquery: RequestModelQuery = JSON.parse(request.headers['requestmodel'].toString());

      console.log(JSON.stringify(requestmodelquery));
      console.log(JSON.stringify(requestmodelquery.Filter));

      return this.tenant_user_app_alertsFacade.search(requestmodelquery);
    }
    catch(error)
    {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @ApiResponseProperty()
  @Get('/:id')
  readOne(@Param('id') id) {
    return this.tenant_user_app_alertsFacade.readOne(id);
  }


}