import { Body,Query, Controller, Delete, Get, HttpException, HttpStatus, Inject, Injectable, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { AppsFacade } from '../facade/apps.facade';
import { ResponseModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/ResponseModel';
import { SNS_SQS } from 'src/submodules/cap-platform-rabbitmq-back/SNS_SQS';
import { AppsDto } from 'src/submodules/cap-platform-dtos/appsDto';
import { RequestModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModel';
import { Message } from 'src/submodules/cap-platform-dtos/cap-platform-common/Message';
import { App_RolesDto } from 'src/submodules/cap-platform-dtos/app_rolesDto';
import { Request } from 'express';
import { RequestModelQuery } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModelQuery';
import { ApiTags, ApiResponseProperty } from '@nestjs/swagger';

@ApiTags('Apps')
@Controller('apps')
export class AppsRoutes{

  constructor(private appsFacade : AppsFacade) { }

  private sns_sqs = SNS_SQS.getInstance();
  private topicArray = ['APPS_ADD','APPS_UPDATE','APPS_DELETE'];
  private serviceName = ['APPS_SERVICE','APPS_SERVICE','APPS_SERVICE'];
  
  onModuleInit() {
   
    for (var i = 0; i < this.topicArray.length; i++) {
      this.sns_sqs.listenToService(this.topicArray[i], this.serviceName[i], (() => {
        let value = this.topicArray[i];
        return async (result) => {
          console.log("Result is........" + JSON.stringify(result));
          try {
            let responseModelOfAppsDto: ResponseModel<AppsDto> = null;
            console.log(`listening to  ${value} topic.....result is....`);
            // ToDo :- add a method for removing queue message from queue....
            switch (value) {
              case 'APPS_ADD':
                console.log("Inside PRODUCT_ADD Topic");
                responseModelOfAppsDto = await this.createApps(result["message"]);
                break;
              case 'APPS_UPDATE':
                  console.log("Inside PRODUCT_UPDATE Topic");
                  responseModelOfAppsDto = await this.updateapps(result["message"]);
                  break;
              case 'APPS_DELETE':
                    console.log("Inside PRODUCT_DELETE Topic");
                    responseModelOfAppsDto = await this.deleteApps(result["message"]);
                    break;
  
            }
  
            console.log("Result of aws of GroupRoutes  is...." + JSON.stringify(result));
            let requestModelOfAppsDto: RequestModel<AppsDto> = result["message"];
            responseModelOfAppsDto.setSocketId(requestModelOfAppsDto.SocketId)
            responseModelOfAppsDto.setCommunityUrl(requestModelOfAppsDto.CommunityUrl);
            responseModelOfAppsDto.setRequestId(requestModelOfAppsDto.RequestGuid);
            responseModelOfAppsDto.setStatus(new Message("200", "Group Inserted Successfully", null));

            for (let index = 0; index < result.OnSuccessTopicsToPush.length; index++) {
              const element = result.OnSuccessTopicsToPush[index];
              console.log("ELEMENT: ", JSON.stringify(responseModelOfAppsDto));
              this.sns_sqs.publishMessageToTopic(element, responseModelOfAppsDto)
            }
          }
          catch (error) {
            console.log("Inside Catch.........");
            console.log(error, result);
            for (let index = 0; index < result.OnFailureTopicsToPush.length; index++) {
              const element = result.OnFailureTopicsToPush[index];
              let errorResult: ResponseModel<AppsDto> = new ResponseModel<AppsDto>(null,null,null,null,null,null,null,null,null);;
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
  allAppss() {
    try {
      console.log("Inside controller ......STUDENT");
      return this.appsFacade.getAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Post("/") 
  async createApps(@Body() body:RequestModel<AppsDto>): Promise<ResponseModel<AppsDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside CreateApps of controller....body id" + JSON.stringify(body));
      let result = await this.appsFacade.create(body);
   
      return result;
      // return null;
    } catch (error) {
       console.log("Error is....." + error);
       throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Put("/")
  async updateapps(@Body() body: RequestModel<AppsDto>): Promise<ResponseModel<AppsDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside updateProduct of controller....body id" + JSON.stringify(body));

      console.log("Executing update query..............")
      return await this.appsFacade.update(body);
    } catch (error) {
      console.log("Error is....." + error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Delete('/')
  deleteApps(@Body() body:RequestModel<AppsDto>): Promise<ResponseModel<AppsDto>>{
    try {
      console.log("body: ",body)
      return this.appsFacade.deleteById(body);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @ApiResponseProperty()
  @Delete('/:id')
  deleteAppsbyid(@Param('id') id) {
    try {
      console.log("delete by id: ",id)
      return this.appsFacade.deleteByIds(id);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }


  @ApiResponseProperty()
  @Get('/search')
  async search(@Req() request:Request){
    try{
      console.log("Inside search function apps:route");
      let requestmodelquery: RequestModelQuery = JSON.parse(request.headers['requestmodel'].toString());

      console.log(JSON.stringify(requestmodelquery));
      console.log(JSON.stringify(requestmodelquery.Filter));

      return this.appsFacade.search(requestmodelquery);
    }
    catch(error)
    {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  @ApiResponseProperty()
  @Get('/:id')
  readOne(@Param('id') id) {
    return this.appsFacade.readOne(id);
  }


}