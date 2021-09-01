import { Body,Query, Controller, Delete, Get, HttpException, HttpStatus, Inject, Injectable, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { App_MessagesFacade } from '../facade/app_messages.facade';
import { ResponseModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/ResponseModel';
import { SNS_SQS } from 'src/submodules/cap-platform-rabbitmq-back/SNS_SQS';
import { App_MessagesDto } from 'src/submodules/cap-platform-dtos/app_messagesDto';
import { RequestModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModel';
import { Message } from 'src/submodules/cap-platform-dtos/cap-platform-common/Message';
import { App_RolesDto } from 'src/submodules/cap-platform-dtos/app_rolesDto';
import { Request } from 'express';
import { RequestModelQuery } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModelQuery';
import { ApiTags, ApiResponseProperty} from '@nestjs/swagger';

@ApiTags('App Messages')
@Controller('app_messages')
export class App_MessagesRoutes{

  constructor(private app_messagesFacade : App_MessagesFacade) { }

  private sns_sqs = SNS_SQS.getInstance();
  private topicArray = ['APP_MESSAGES_ADD','APP_MESSAGES_UPDATE','APP_MESSAGES_DELETE'];
  private serviceName = ['APP_MESSAGES_SERVICE','APP_MESSAGES_SERVICE','APP_MESSAGES_SERVICE'];
  
  onModuleInit() {
   
    for (var i = 0; i < this.topicArray.length; i++) {
      this.sns_sqs.listenToService(this.topicArray[i], this.serviceName[i], (() => {
        let value = this.topicArray[i];
        return async (result) => {
          console.log("Result is........" + JSON.stringify(result));
          try {
            let responseModelOfApp_MessagesDto: ResponseModel<App_MessagesDto> = null;
            console.log(`listening to  ${value} topic.....result is....`);
            // ToDo :- add a method for removing queue message from queue....
            switch (value) {
              case 'APP_MESSAGES_ADD':
                console.log("Inside PRODUCT_ADD Topic");
                responseModelOfApp_MessagesDto = await this.createApp_Messages(result["message"]);
                break;
              case 'APP_MESSAGES_UPDATE':
                  console.log("Inside PRODUCT_UPDATE Topic");
                  responseModelOfApp_MessagesDto = await this.updateapp_messages(result["message"]);
                  break;
              case 'APP_MESSAGES_DELETE':
                    console.log("Inside PRODUCT_DELETE Topic");
                    responseModelOfApp_MessagesDto = await this.deleteApp_Messages(result["message"]);
                    break;
  
            }
  
            console.log("Result of aws of GroupRoutes  is...." + JSON.stringify(result));
            let requestModelOfApp_MessagesDto: RequestModel<App_MessagesDto> = result["message"];
            responseModelOfApp_MessagesDto.setSocketId(requestModelOfApp_MessagesDto.SocketId)
            responseModelOfApp_MessagesDto.setCommunityUrl(requestModelOfApp_MessagesDto.CommunityUrl);
            responseModelOfApp_MessagesDto.setRequestId(requestModelOfApp_MessagesDto.RequestGuid);
            responseModelOfApp_MessagesDto.setStatus(new Message("200", "Group Inserted Successfully", null));

            for (let index = 0; index < result.OnSuccessTopicsToPush.length; index++) {
              const element = result.OnSuccessTopicsToPush[index];
              console.log("ELEMENT: ", JSON.stringify(responseModelOfApp_MessagesDto));
              this.sns_sqs.publishMessageToTopic(element, responseModelOfApp_MessagesDto)
            }
          }
          catch (error) {
            console.log("Inside Catch.........");
            console.log(error, result);
            for (let index = 0; index < result.OnFailureTopicsToPush.length; index++) {
              const element = result.OnFailureTopicsToPush[index];
              let errorResult: ResponseModel<App_MessagesDto> = new ResponseModel<App_MessagesDto>(null,null,null,null,null,null,null,null,null);;

              let requestModelOfApp_RolesDto: RequestModel<App_RolesDto> = result["message"];
              errorResult.setStatus(new Message("500",error,null))
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
  allApp_Messagess() {
    try {
      console.log("Inside controller ......STUDENT");
      return this.app_messagesFacade.getAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Post("/") 
  async createApp_Messages(@Body() body:RequestModel<App_MessagesDto>): Promise<ResponseModel<App_MessagesDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside CreateApp_Messages of controller....body id" + JSON.stringify(body));
      let result = await this.app_messagesFacade.create(body);
   
      return result;
      // return null;
    } catch (error) {
       console.log("Error is....." + error);
       throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @ApiResponseProperty()
  @Put("/")
  async updateapp_messages(@Body() body: RequestModel<App_MessagesDto>): Promise<ResponseModel<App_MessagesDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside updateProduct of controller....body id" + JSON.stringify(body));

      console.log("Executing update query..............")
      return await this.app_messagesFacade.update(body);
    } catch (error) {
      console.log("Error is....." + error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @ApiResponseProperty()
  @Delete('/')
  deleteApp_Messages(@Body() body:RequestModel<App_MessagesDto>): Promise<ResponseModel<App_MessagesDto>>{
    try {
      console.log("body: ",body)
      return this.app_messagesFacade.deleteById(body);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }


  @ApiResponseProperty()
  @Delete('/:id')
  deleteApp_Messagesbyid(@Param('id') id) {
    try {
      console.log("delete by id: ",id)
      return this.app_messagesFacade.deleteByIds(id);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }



  @ApiResponseProperty()
  @Get('/search')
  async search(@Req() request:Request){
    try{
      console.log("Inside search function app_messages:route");
      let requestmodelquery: RequestModelQuery = JSON.parse(request.headers['requestmodel'].toString());

      console.log(JSON.stringify(requestmodelquery));
      console.log(JSON.stringify(requestmodelquery.Filter));

      return this.app_messagesFacade.search(requestmodelquery);
    }
    catch(error)
    {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  @ApiResponseProperty()
  @Get('/:id')
  readOne(@Param('id') id) {
    return this.app_messagesFacade.readOne(id);
  }
}