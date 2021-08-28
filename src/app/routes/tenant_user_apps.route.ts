import { Body,Query, Controller, Delete, Get, HttpException, HttpStatus, Inject, Injectable, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { Tenant_User_AppsFacade } from '../facade/tenant_user_apps.facade';
import { ResponseModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/ResponseModel';
import { SNS_SQS } from 'src/submodules/cap-platform-rabbitmq-back/SNS_SQS';
import { Tenant_User_AppsDto } from 'src/submodules/cap-platform-dtos/tenant_user_appsDto';
import { RequestModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModel';
import { Message } from 'src/submodules/cap-platform-dtos/cap-platform-common/Message';


@Controller('tenant_user_apps')
export class Tenant_User_AppsRoutes{

  constructor(private tenant_user_appsFacade : Tenant_User_AppsFacade) { }

  private sns_sqs = SNS_SQS.getInstance();
  private topicArray = ['TENANT_USER_APPS1_ADD','TENANT_USER_APPS1_UPDATE','TENANT_USER_APPS1_DELETE'];
  private serviceName = ['TENANT_USER_APPS1_SERVICE','TENANT_USER_APPS1_SERVICE','TENANT_USER_APPS1_SERVICE'];
  
  onModuleInit() {
   
    for (var i = 0; i < this.topicArray.length; i++) {
      this.sns_sqs.listenToService(this.topicArray[i], this.serviceName[i], (() => {
        let value = this.topicArray[i];
        return async (result) => {
          console.log("Result is........" + JSON.stringify(result));
          try {
            let responseModelOfTenant_User_AppsDto: ResponseModel<Tenant_User_AppsDto> = null;
            console.log(`listening to  ${value} topic.....result is....`);
            // ToDo :- add a method for removing queue message from queue....
            switch (value) {
              case 'TENANT_USER_APPS1_ADD':
                console.log("Inside PRODUCT_ADD Topic");
                responseModelOfTenant_User_AppsDto = await this.createTenant_User_Apps(result["message"]);
                break;
              case 'TENANT_USER_APPS1_UPDATE':
                  console.log("Inside PRODUCT_UPDATE Topic");
                  responseModelOfTenant_User_AppsDto = await this.updatetenant_user_apps(result["message"]);
                  break;
              case 'TENANT_USER_APPS1_DELETE':
                    console.log("Inside PRODUCT_DELETE Topic");
                    responseModelOfTenant_User_AppsDto = await this.deleteTenant_User_Apps(result["message"]);
                    break;
  
            }
  
            console.log("Result of aws of GroupRoutes  is...." + JSON.stringify(result));
            let requestModelOfTenant_User_AppsDto: RequestModel<Tenant_User_AppsDto> = result["message"];
            responseModelOfTenant_User_AppsDto.setSocketId(requestModelOfTenant_User_AppsDto.SocketId)
            responseModelOfTenant_User_AppsDto.setCommunityUrl(requestModelOfTenant_User_AppsDto.CommunityUrl);
            responseModelOfTenant_User_AppsDto.setRequestId(requestModelOfTenant_User_AppsDto.RequestGuid);
            responseModelOfTenant_User_AppsDto.setStatus(new Message("200", "Group Inserted Successfully", null));

            for (let index = 0; index < result.OnSuccessTopicsToPush.length; index++) {
              const element = result.OnSuccessTopicsToPush[index];
              console.log("ELEMENT: ", JSON.stringify(responseModelOfTenant_User_AppsDto));
              this.sns_sqs.publishMessageToTopic(element, responseModelOfTenant_User_AppsDto)
            }
          }
          catch (error) {
            console.log("Inside Catch.........");
            console.log(error, result);
            for (let index = 0; index < result.OnFailureTopicsToPush.length; index++) {
              const element = result.OnFailureTopicsToPush[index];
              let errorResult: ResponseModel<Tenant_User_AppsDto> = new ResponseModel<Tenant_User_AppsDto>(null,null,null,null,null,null,null,null,null);;
              errorResult.setStatus(new Message("500",error,null))
              

              this.sns_sqs.publishMessageToTopic(element, errorResult);
            }
          }
        }
      })())
    }

  }


  @Get()
  allTenant_User_Appss() {
    try {
      console.log("Inside controller ......STUDENT");
      return this.tenant_user_appsFacade.getAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("/") 
  async createTenant_User_Apps(@Body() body:RequestModel<Tenant_User_AppsDto>): Promise<ResponseModel<Tenant_User_AppsDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside CreateTenant_User_Apps of controller....body id" + JSON.stringify(body));
      let result = await this.tenant_user_appsFacade.create(body);
   
      return result;
      // return null;
    } catch (error) {
       console.log("Error is....." + error);
       throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put("/")
  async updatetenant_user_apps(@Body() body: RequestModel<Tenant_User_AppsDto>): Promise<ResponseModel<Tenant_User_AppsDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside updateProduct of controller....body id" + JSON.stringify(body));

      console.log("Executing update query..............")
      return await this.tenant_user_appsFacade.update(body);
    } catch (error) {
      console.log("Error is....." + error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/')
  deleteTenant_User_Apps(@Body() body:RequestModel<Tenant_User_AppsDto>): Promise<ResponseModel<Tenant_User_AppsDto>>{
    try {
      console.log("body: ",body)
      return this.tenant_user_appsFacade.deleteById(body);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @Delete('/:id')
  deleteTenant_User_Appsbyid(@Param('id') id) {
    try {
      console.log("delete by id: ",id)
      return this.tenant_user_appsFacade.deleteByIds(id);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @Get('/:id')
  readOne(@Param('id') id) {
    return this.tenant_user_appsFacade.readOne(id);
  }


}