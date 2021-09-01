import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Injectable, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { TenantsFacade } from '../facade/tenants.facade';
import { ResponseModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/ResponseModel';
import { SNS_SQS } from 'src/submodules/cap-platform-rabbitmq-back/SNS_SQS';
import { TenantsDto } from 'src/submodules/cap-platform-dtos/tenantsDto';
import { RequestModel } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModel';
import { Message } from 'src/submodules/cap-platform-dtos/cap-platform-common/Message';
import { App_RolesDto } from 'src/submodules/cap-platform-dtos/app_rolesDto';
import { Request } from 'express';
import { RequestModelQuery } from 'src/submodules/cap-platform-dtos/cap-platform-common/RequestModelQuery';
import { ApiTags, ApiResponseProperty} from '@nestjs/swagger';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantsRoutes{

  constructor(private tenantsFacade : TenantsFacade) { }

  private sns_sqs = SNS_SQS.getInstance();
  private topicArray = ['TENANTS_ADD','TENANTS_UPDATE','TENANTS_DELETE'];
  private serviceName = ['TENANTS_SERVICE','TENANTS_SERVICE','TENANTS_SERVICE'];
  
  onModuleInit() {
   
    for (var i = 0; i < this.topicArray.length; i++) {
      this.sns_sqs.listenToService(this.topicArray[i], this.serviceName[i], (() => {
        let value = this.topicArray[i];
        return async (result) => {
          console.log("Result is........" + JSON.stringify(result));
          try {
            let responseModelOfTenantsDto: ResponseModel<TenantsDto> = null;
            console.log(`listening to  ${value} topic.....result is....`);
            // ToDo :- add a method for removing queue message from queue....
            switch (value) {
              case 'TENANTS_ADD':
                console.log("Inside TENANTS_ADD Topic");
                responseModelOfTenantsDto = await this.createTenants(result["message"]);
                break;
              case 'TENANTS_UPDATE':
                console.log("Inside TENANTS_UPDATE Topic");
               responseModelOfTenantsDto = await this.updateTenants(result["message"]);
                break;
              case 'TENANTS_DELETE':
                console.log("Inside TENANTS_DELETE Topic");
                responseModelOfTenantsDto = await this.deleteTenants(result["message"]);
                break;
  
            }
  
            console.log("Result of aws of GroupRoutes  is...." + JSON.stringify(result));
            let requestModelOfTenantsDto: RequestModel<TenantsDto> = result["message"];
            responseModelOfTenantsDto.setSocketId(requestModelOfTenantsDto.SocketId)
            responseModelOfTenantsDto.setCommunityUrl(requestModelOfTenantsDto.CommunityUrl);
            responseModelOfTenantsDto.setRequestId(requestModelOfTenantsDto.RequestGuid);
            responseModelOfTenantsDto.setStatus(new Message("200", "Group Inserted Successfully", null));

            for (let index = 0; index < result.OnSuccessTopicsToPush.length; index++) {
              const element = result.OnSuccessTopicsToPush[index];
              console.log("ELEMENT: ", JSON.stringify(responseModelOfTenantsDto));
              this.sns_sqs.publishMessageToTopic(element, responseModelOfTenantsDto)
            }
          }
          catch (error) {
            console.log("Inside Catch.........");
            console.log(error, result);
            for (let index = 0; index < result.OnFailureTopicsToPush.length; index++) {
              const element = result.OnFailureTopicsToPush[index];
              let errorResult: ResponseModel<TenantsDto> = new ResponseModel<TenantsDto>(null,null,null,null,null,null,null,null,null);;
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
  allTenantss() {
    try {
      console.log("Inside controller ......STUDENT");
      return this.tenantsFacade.getAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Post("/") 
  async createTenants(@Body() body:RequestModel<TenantsDto>): Promise<ResponseModel<TenantsDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside CreateTenants of controller....body id" + JSON.stringify(body));
      let result = await this.tenantsFacade.create(body);
   
      return result;
      // return null;
    } catch (error) {
       console.log("Error is....." + error);
       throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Put("/")
  async updateTenants(@Body() body:RequestModel<TenantsDto>): Promise<ResponseModel<TenantsDto>> {  //requiestmodel<STUDENTDto></STUDENTDto>....Promise<ResponseModel<Grou[pDto>>]
    try {
      console.log("Inside CreateTenants of controller....body id" + JSON.stringify(body));
             
      console.log("Executing update query..............")
      return await this.tenantsFacade.update(body);
    } catch (error) {
      console.log("Error is....." + error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponseProperty()
  @Delete('/:id')
  deleteTenantsbyid(@Param('id') id) {
    try {
      console.log("delete by id: ",id)
      return this.tenantsFacade.deleteByIds(id);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @ApiResponseProperty()
  @Delete('/')
  deleteTenants(@Body() body:RequestModel<TenantsDto>): Promise<ResponseModel<TenantsDto>>{
    try {
      
      return this.tenantsFacade.deleteById(body);
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

  @ApiResponseProperty()
  @Get('/search')
  async search(@Req() request:Request){
    try{
      console.log("Inside search function tenants:route");
      let requestmodelquery: RequestModelQuery = JSON.parse(request.headers['requestmodel'].toString());

      console.log(JSON.stringify(requestmodelquery));
      console.log(JSON.stringify(requestmodelquery.Filter));

      return this.tenantsFacade.search(requestmodelquery);
    }
    catch(error)
    {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}