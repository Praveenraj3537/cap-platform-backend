import { Body,Query, Controller, Delete, Get, HttpException, HttpStatus, Inject, Injectable, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { App_MessagesFacade } from '../facade/app_messages.facade';
import { ResponseModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/ResponseModel';
import { SNS_SQS } from 'src/submodules/cap-platform-rabbitmq-back/SNS_SQS';
import { App_MessagesDto } from 'src/submodules/cap-platform-dtos/app_messagesDto';
import { RequestModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModel';
import { Message } from 'src/submodules/cap-platform-dtos/cap-platform-common/Message';


@Controller('app_messages')
export class App_MessagesRoutes{

  constructor(private app_messagesFacade : App_MessagesFacade) { }

  private sns_sqs = SNS_SQS.getInstance();
  private topicArray = ['APP_MESSAGES1_ADD','APP_MESSAGES1_UPDATE','APP_MESSAGES1_DELETE'];
  private serviceName = ['APP_MESSAGES1_SERVICE','APP_MESSAGES1_SERVICE','APP_MESSAGES1_SERVICE'];
  
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
              case 'APP_MESSAGES1_ADD':
                console.log("Inside PRODUCT_ADD Topic");
                responseModelOfApp_MessagesDto = await this.createApp_Messages(result["message"]);
                break;
              case 'APP_MESSAGES1_UPDATE':
                  console.log("Inside PRODUCT_UPDATE Topic");
                  responseModelOfApp_MessagesDto = await this.updateapp_messages(result["message"]);
                  break;
              case 'APP_MESSAGES1_DELETE':
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
              errorResult.setStatus(new Message("500",error,null))
              

              this.sns_sqs.publishMessageToTopic(element, errorResult);
            }
          }
        }
      })())
    }

  }


  @Get()
  allApp_Messagess() {
    try {
      console.log("Inside controller ......STUDENT");
      return this.app_messagesFacade.getAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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

  @Delete('/')
  deleteApp_Messages(@Body() body:RequestModel<App_MessagesDto>): Promise<ResponseModel<App_MessagesDto>>{
    try {
      console.log("body: ",body)
      return this.app_messagesFacade.deleteById(body);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @Delete('/:id')
  deleteApp_Messagesbyid(@Param('id') id) {
    try {
      console.log("delete by id: ",id)
      return this.app_messagesFacade.deleteByIds(id);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @Get('/:id')
  readOne(@Param('id') id) {
    return this.app_messagesFacade.readOne(id);
  }
}