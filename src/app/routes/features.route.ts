import { Body,Query, Controller, Delete, Get, HttpException, HttpStatus, Inject, Injectable, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { FeaturesFacade } from '../facade/features.facade';
import { ResponseModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/ResponseModel';
import { SNS_SQS } from 'src/submodules/cap-platform-rabbitmq-back/SNS_SQS';
import { FeaturesDto } from 'src/submodules/cap-platform-dtos/featuresDto';
import { RequestModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModel';
import { Message } from 'src/submodules/cap-platform-dtos/cap-platform-common/Message';
import { App_RolesDto } from 'src/submodules/cap-platform-dtos/app_rolesDto';
import { Request } from 'express';
import { RequestModelQuery } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModelQuery';
import { ApiTags, ApiResponseProperty} from '@nestjs/swagger';

@ApiTags('Features')
@Controller('features')
export class FeaturesRoutes{

  constructor(private featuresFacade : FeaturesFacade) { }

  private sns_sqs = SNS_SQS.getInstance();
  private topicArray = ['FEATURES_ADD','FEATURES_UPDATE','FEATURES_DELETE'];
  private serviceName = ['FEATURES_SERVICE','FEATURES_SERVICE','FEATURES_SERVICE'];
  
  onModuleInit() {
   
    for (var i = 0; i < this.topicArray.length; i++) {
      this.sns_sqs.listenToService(this.topicArray[i], this.serviceName[i], (() => {
        let value = this.topicArray[i];
        return async (result) => {
          console.log("Result is........" + JSON.stringify(result));
          try {
            let responseModelOfFeaturesDto: ResponseModel<FeaturesDto> = null;
            console.log(`listening to  ${value} topic.....result is....`);
            // ToDo :- add a method for removing queue message from queue....
            switch (value) {
              case 'FEATURES_ADD':
                console.log("Inside PRODUCT_ADD Topic");
                responseModelOfFeaturesDto = await this.createFeatures(result["message"]);
                break;
              case 'FEATURES_UPDATE':
                  console.log("Inside PRODUCT_UPDATE Topic");
                  responseModelOfFeaturesDto = await this.updatefeatures(result["message"]);
                  break;
              case 'FEATURES_DELETE':
                    console.log("Inside PRODUCT_DELETE Topic");
                    responseModelOfFeaturesDto = await this.deleteFeatures(result["message"]);
                    break;
  
            }
  
            console.log("Result of aws of GroupRoutes  is...." + JSON.stringify(result));
            let requestModelOfFeaturesDto: RequestModel<FeaturesDto> = result["message"];
            responseModelOfFeaturesDto.setSocketId(requestModelOfFeaturesDto.SocketId)
            responseModelOfFeaturesDto.setCommunityUrl(requestModelOfFeaturesDto.CommunityUrl);
            responseModelOfFeaturesDto.setRequestId(requestModelOfFeaturesDto.RequestGuid);
            responseModelOfFeaturesDto.setStatus(new Message("200", "Group Inserted Successfully", null));

            for (let index = 0; index < result.OnSuccessTopicsToPush.length; index++) {
              const element = result.OnSuccessTopicsToPush[index];
              console.log("ELEMENT: ", JSON.stringify(responseModelOfFeaturesDto));
              this.sns_sqs.publishMessageToTopic(element, responseModelOfFeaturesDto)
            }
          }
          catch (error) {
            console.log("Inside Catch.........");
            console.log(error, result);
            for (let index = 0; index < result.OnFailureTopicsToPush.length; index++) {
              const element = result.OnFailureTopicsToPush[index];
              let errorResult: ResponseModel<FeaturesDto> = new ResponseModel<FeaturesDto>(null,null,null,null,null,null,null,null,null);;
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
  allFeaturess() {
    try {
      console.log("Inside controller ......STUDENT");
      return this.featuresFacade.getAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Post("/") 
  async createFeatures(@Body() body:RequestModel<FeaturesDto>): Promise<ResponseModel<FeaturesDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside CreateFeatures of controller....body id" + JSON.stringify(body));
      let result = await this.featuresFacade.create(body);
   
      return result;
      // return null;
    } catch (error) {
       console.log("Error is....." + error);
       throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Put("/")
  async updatefeatures(@Body() body: RequestModel<FeaturesDto>): Promise<ResponseModel<FeaturesDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside updateProduct of controller....body id" + JSON.stringify(body));

      console.log("Executing update query..............")
      return await this.featuresFacade.update(body);
    } catch (error) {
      console.log("Error is....." + error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Delete('/')
  deleteFeatures(@Body() body:RequestModel<FeaturesDto>): Promise<ResponseModel<FeaturesDto>>{
    try {
      console.log("body: ",body)
      return this.featuresFacade.deleteById(body);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @ApiResponseProperty()
  @Delete('/:id')
  deleteFeaturesbyid(@Param('id') id) {
    try {
      console.log("delete by id: ",id)
      return this.featuresFacade.deleteByIds(id);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @ApiResponseProperty()
  @Get('/search')
  async search(@Req() request:Request){
    try{
      console.log("Inside search function features:route");
      let requestmodelquery: RequestModelQuery = JSON.parse(request.headers['requestmodel'].toString());

      console.log(JSON.stringify(requestmodelquery));
      console.log(JSON.stringify(requestmodelquery.Filter));

      return this.featuresFacade.search(requestmodelquery);
    }
    catch(error)
    {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @ApiResponseProperty()
  @Get('/:id')
  readOne(@Param('id') id) {
    return this.featuresFacade.readOne(id);
  }


}