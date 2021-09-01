import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DtoBase } from "src/submodules/cap-platform-dtos/cap-platform-common/cap-platform-dtobase/dtobase";
import AppService from "../../submodules/cap-platform-entities/cap-platform-framework/AppServiceBase";
import { EntityBase } from "../../submodules/cap-platform-entities/cap-platform-framework/cap-platform-entitybase/entitybase";
import { RequestModel } from "src/submodules/cap-platform-dtos/cap-platform-common/RequestModel";
import { ResponseModel } from "src/submodules/cap-platform-dtos/cap-platform-common/ResponseModel";
import { RequestModelQuery } from "src/submodules/cap-platform-dtos/cap-platform-common/RequestModelQuery";

@Injectable()
export default class FacadeBase<TEntity extends EntityBase, TDto extends DtoBase>{
    private appService: AppService<TEntity,TDto>;
    constructor(private service: AppService<TEntity,TDto>){
        this.appService = service;
        
    }

    async getAll(){
        try {
            console.log("Inside facade");
            return this.appService.getAll();
          } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
          }
    }

    async readOne(id : number) {
      return await this.appService.getOne(id);
    }

    async create(body: RequestModel<TDto>): Promise<ResponseModel<TDto>> {
        try {
            console.log("Inside CreateProblem of facade....body id" + JSON.stringify(body));
            let result = await this.appService.create(body);
            
            return result;
            
          } catch (error) {
            console.log("Error is....." + error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
          }
    }

    async update(body: RequestModel<TDto>): Promise<ResponseModel<TDto>> {
      try {
        console.log("Inside Updateproblem of facade....body id" + JSON.stringify(body));
  
        console.log("Executing update query..............")
        return await this.appService.updateEntity(body);
      } catch (error) {
        console.log("Error is....." + error);
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  
    }
  
    async deleteById(body: RequestModel<TDto>): Promise<ResponseModel<TDto>> {
      let delete_ids: Array<number> = [];
      body.DataCollection.forEach((entity: TDto) => {
        delete_ids.push(entity.Id);
  
      })
      console.log("Ids are......", delete_ids);
      return this.appService.deleteById(delete_ids);
    }

    async deleteByIds(id: number[]) {
     
      console.log("Ids are......", id);
      return this.appService.deleteByIds(id);
    }


    async search(requestModel: RequestModelQuery){
      try {
          console.log("Inside facade ......group by pageSize & pageNumber");
          let result = await this.appService.search(requestModel);
          return result;
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }


    

}