import { Body,Query, Controller, Delete, Get, HttpException, HttpStatus, Inject, Injectable, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { Feature_PermissionsFacade } from '../facade/feature_permissions.facade';
import { ResponseModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/ResponseModel';
import { SNS_SQS } from 'src/submodules/cap-platform-rabbitmq-back/SNS_SQS';
import { Feature_PermissionsDto } from 'src/submodules/cap-platform-dtos/feature_permissionsDto';
import { RequestModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModel';
import { Message } from 'src/submodules/cap-platform-dtos/cap-platform-common/Message';
import { App_RolesDto } from 'src/submodules/cap-platform-dtos/app_rolesDto';
import { Request } from 'express';
import { RequestModelQuery } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModelQuery';
import { ApiTags, ApiResponseProperty} from '@nestjs/swagger';


@ApiTags('Feature Permissions')
@Controller('feature_permissions')
export class Feature_PermissionsRoutes{

  constructor(private feature_permissionsFacade : Feature_PermissionsFacade) { }

  private sns_sqs = SNS_SQS.getInstance();
  private topicArray = ['FEATURE_PERMISSIONS_ADD','FEATURE_PERMISSIONS_UPDATE','FEATURE_PERMISSIONS_DELETE'];
  private serviceName = ['FEATURE_PERMISSIONS_SERVICE','FEATURE_PERMISSIONS_SERVICE','FEATURE_PERMISSIONS_SERVICE'];
  
  onModuleInit() {
   
    for (var i = 0; i < this.topicArray.length; i++) {
      this.sns_sqs.listenToService(this.topicArray[i], this.serviceName[i], (() => {
        let value = this.topicArray[i];
        return async (result) => {
          console.log("Result is........" + JSON.stringify(result));
          try {
            let responseModelOfFeature_PermissionsDto: ResponseModel<Feature_PermissionsDto> = null;
            console.log(`listening to  ${value} topic.....result is....`);
            // ToDo :- add a method for removing queue message from queue....
            switch (value) {
              case 'FEATURE_PERMISSIONS_ADD':
                console.log("Inside PRODUCT_ADD Topic");
                responseModelOfFeature_PermissionsDto = await this.createFeature_Permissions(result["message"]);
                break;
              case 'FEATURE_PERMISSIONS_UPDATE':
                  console.log("Inside PRODUCT_UPDATE Topic");
                  responseModelOfFeature_PermissionsDto = await this.updatefeature_permissions(result["message"]);
                  break;
              case 'FEATURE_PERMISSIONS_DELETE':
                    console.log("Inside PRODUCT_DELETE Topic");
                    responseModelOfFeature_PermissionsDto = await this.deleteFeature_Permissions(result["message"]);
                    break;
  
            }
  
            console.log("Result of aws of GroupRoutes  is...." + JSON.stringify(result));
            let requestModelOfFeature_PermissionsDto: RequestModel<Feature_PermissionsDto> = result["message"];
            responseModelOfFeature_PermissionsDto.setSocketId(requestModelOfFeature_PermissionsDto.SocketId)
            responseModelOfFeature_PermissionsDto.setCommunityUrl(requestModelOfFeature_PermissionsDto.CommunityUrl);
            responseModelOfFeature_PermissionsDto.setRequestId(requestModelOfFeature_PermissionsDto.RequestGuid);
            responseModelOfFeature_PermissionsDto.setStatus(new Message("200", "Group Inserted Successfully", null));

            for (let index = 0; index < result.OnSuccessTopicsToPush.length; index++) {
              const element = result.OnSuccessTopicsToPush[index];
              console.log("ELEMENT: ", JSON.stringify(responseModelOfFeature_PermissionsDto));
              this.sns_sqs.publishMessageToTopic(element, responseModelOfFeature_PermissionsDto)
            }
          }
          catch (error) {
            console.log("Inside Catch.........");
            console.log(error, result);
            for (let index = 0; index < result.OnFailureTopicsToPush.length; index++) {
              const element = result.OnFailureTopicsToPush[index];
              let errorResult: ResponseModel<Feature_PermissionsDto> = new ResponseModel<Feature_PermissionsDto>(null,null,null,null,null,null,null,null,null);;
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
  allFeature_Permissions() {
    try {
      console.log("Inside controller ......STUDENT");
      return this.feature_permissionsFacade.getAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Post("/") 
  async createFeature_Permissions(@Body() body:RequestModel<Feature_PermissionsDto>): Promise<ResponseModel<Feature_PermissionsDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside CreateFeature_Permissions of controller....body id" + JSON.stringify(body));
      let result = await this.feature_permissionsFacade.create(body);
   
      return result;
      // return null;
    } catch (error) {
       console.log("Error is....." + error);
       throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Put("/")
  async updatefeature_permissions(@Body() body: RequestModel<Feature_PermissionsDto>): Promise<ResponseModel<Feature_PermissionsDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside updateProduct of controller....body id" + JSON.stringify(body));

      console.log("Executing update query..............")
      return await this.feature_permissionsFacade.update(body);
    } catch (error) {
      console.log("Error is....." + error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Delete('/')
  deleteFeature_Permissions(@Body() body:RequestModel<Feature_PermissionsDto>): Promise<ResponseModel<Feature_PermissionsDto>>{
    try {
      console.log("body: ",body)
      return this.feature_permissionsFacade.deleteById(body);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @ApiResponseProperty()
  @Delete('/:id')
  deleteFeature_Permissionsbyid(@Param('id') id) {
    try {
      console.log("delete by id: ",id)
      return this.feature_permissionsFacade.deleteByIds(id);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @ApiResponseProperty()
  @Get('/search')
  async search(@Req() request:Request){
    try{
      console.log("Inside search function fetaure_permission:route");
      let requestmodelquery: RequestModelQuery = JSON.parse(request.headers['requestmodel'].toString());

      console.log(JSON.stringify(requestmodelquery));
      console.log(JSON.stringify(requestmodelquery.Filter));

      return this.feature_permissionsFacade.search(requestmodelquery);
    }
    catch(error)
    {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @ApiResponseProperty()
  @Get('/:id')
  readOne(@Param('id') id) {
    return this.feature_permissionsFacade.readOne(id);
  }


}