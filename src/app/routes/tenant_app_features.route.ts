import { Body,Query, Controller, Delete, Get, HttpException, HttpStatus, Inject, Injectable, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { Tenant_App_FeaturesFacade } from '../facade/tenant_app_features.facade';
import { ResponseModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/ResponseModel';
import { SNS_SQS } from 'src/submodules/cap-platform-rabbitmq-back/SNS_SQS';
import { Tenant_App_FeaturesDto } from 'src/submodules/cap-platform-dtos/tenant_app_featuresDto';
import { RequestModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModel';
import { Message } from 'src/submodules/cap-platform-dtos/cap-platform-common/Message';
import { App_RolesDto } from 'src/submodules/cap-platform-dtos/app_rolesDto';
import { Request } from 'express';
import { RequestModelQuery } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModelQuery';
import { ApiTags, ApiResponseProperty} from '@nestjs/swagger';

@ApiTags('Tenant App Features')
@Controller('tenant_app_features')
export class Tenant_App_FeaturesRoutes{

  constructor(private tenant_app_featuresFacade : Tenant_App_FeaturesFacade) { }

  private sns_sqs = SNS_SQS.getInstance();
  private topicArray = ['TENANT_APP_FEATURES_ADD','TENANT_APP_FEATURES_UPDATE','TENANT_APP_FEATURES_DELETE'];
  private serviceName = ['TENANT_APP_FEATURES_SERVICE','TENANT_APP_FEATURES_SERVICE','TENANT_APP_FEATURES_SERVICE'];
  
  onModuleInit() {
   
    for (var i = 0; i < this.topicArray.length; i++) {
      this.sns_sqs.listenToService(this.topicArray[i], this.serviceName[i], (() => {
        let value = this.topicArray[i];
        return async (result) => {
          console.log("Result is........" + JSON.stringify(result));
          try {
            let responseModelOfTenant_App_FeaturesDto: ResponseModel<Tenant_App_FeaturesDto> = null;
            console.log(`listening to  ${value} topic.....result is....`);
            // ToDo :- add a method for removing queue message from queue....
            switch (value) {
              case 'TENANT_APP_FEATURES_ADD':
                console.log("Inside PRODUCT_ADD Topic");
                responseModelOfTenant_App_FeaturesDto = await this.createTenant_App_Features(result["message"]);
                break;
              case 'TENANT_APP_FEATURES_UPDATE':
                  console.log("Inside PRODUCT_UPDATE Topic");
                  responseModelOfTenant_App_FeaturesDto = await this.updatetenant_app_features(result["message"]);
                  break;
              case 'TENANT_APP_FEATURES_DELETE':
                    console.log("Inside PRODUCT_DELETE Topic");
                    responseModelOfTenant_App_FeaturesDto = await this.deleteTenant_App_Features(result["message"]);
                    break;
  
            }
  
            console.log("Result of aws of GroupRoutes  is...." + JSON.stringify(result));
            let requestModelOfTenant_App_FeaturesDto: RequestModel<Tenant_App_FeaturesDto> = result["message"];
            responseModelOfTenant_App_FeaturesDto.setSocketId(requestModelOfTenant_App_FeaturesDto.SocketId)
            responseModelOfTenant_App_FeaturesDto.setCommunityUrl(requestModelOfTenant_App_FeaturesDto.CommunityUrl);
            responseModelOfTenant_App_FeaturesDto.setRequestId(requestModelOfTenant_App_FeaturesDto.RequestGuid);
            responseModelOfTenant_App_FeaturesDto.setStatus(new Message("200", "Group Inserted Successfully", null));

            for (let index = 0; index < result.OnSuccessTopicsToPush.length; index++) {
              const element = result.OnSuccessTopicsToPush[index];
              console.log("ELEMENT: ", JSON.stringify(responseModelOfTenant_App_FeaturesDto));
              this.sns_sqs.publishMessageToTopic(element, responseModelOfTenant_App_FeaturesDto)
            }
          }
          catch (error) {
            console.log("Inside Catch.........");
            console.log(error, result);
            for (let index = 0; index < result.OnFailureTopicsToPush.length; index++) {
              const element = result.OnFailureTopicsToPush[index];
              let errorResult: ResponseModel<Tenant_App_FeaturesDto> = new ResponseModel<Tenant_App_FeaturesDto>(null,null,null,null,null,null,null,null,null);;
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
  allTenant_App_Featuress() {
    try {
      console.log("Inside controller ......STUDENT");
      return this.tenant_app_featuresFacade.getAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Post("/") 
  async createTenant_App_Features(@Body() body:RequestModel<Tenant_App_FeaturesDto>): Promise<ResponseModel<Tenant_App_FeaturesDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside CreateTenant_App_Features of controller....body id" + JSON.stringify(body));
      let result = await this.tenant_app_featuresFacade.create(body);
   
      return result;
      // return null;
    } catch (error) {
       console.log("Error is....." + error);
       throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Put("/")
  async updatetenant_app_features(@Body() body: RequestModel<Tenant_App_FeaturesDto>): Promise<ResponseModel<Tenant_App_FeaturesDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside updateProduct of controller....body id" + JSON.stringify(body));

      console.log("Executing update query..............")
      return await this.tenant_app_featuresFacade.update(body);
    } catch (error) {
      console.log("Error is....." + error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Delete('/')
  deleteTenant_App_Features(@Body() body:RequestModel<Tenant_App_FeaturesDto>): Promise<ResponseModel<Tenant_App_FeaturesDto>>{
    try {
      console.log("body: ",body)
      return this.tenant_app_featuresFacade.deleteById(body);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @ApiResponseProperty()
  @Delete('/:id')
  deleteTenant_App_Featuresbyid(@Param('id') id) {
    try {
      console.log("delete by id: ",id)
      return this.tenant_app_featuresFacade.deleteByIds(id);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @ApiResponseProperty()
  @Get('/search')
  async search(@Req() request:Request){
    try{
      console.log("Inside search function tenatn_app_features:route");
      let requestmodelquery: RequestModelQuery = JSON.parse(request.headers['requestmodel'].toString());

      console.log(JSON.stringify(requestmodelquery));
      console.log(JSON.stringify(requestmodelquery.Filter));

      return this.tenant_app_featuresFacade.search(requestmodelquery);
    }
    catch(error)
    {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @ApiResponseProperty()
  @Get('/:id')
  readOne(@Param('id') id) {
    return this.tenant_app_featuresFacade.readOne(id);
  }


}