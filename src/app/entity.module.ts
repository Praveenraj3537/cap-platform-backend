import { HttpModule, HttpService, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UsersAppService from './appservices/users.appservice'
import { UsersFacade } from './facade/users.facade';
import { UsersRoutes } from './routes/users.route';
import { UsersEntity } from '../submodules/cap-platform-entities/users.entity';
import TenantsAppService from './appservices/tenants.appservice';
import Tenant_UsersAppService from './appservices/tenant_users.appservice';
import Tenant_AppsAppService from './appservices/tenant_apps.appservice';
import Tenant_App_FeaturesAppService from './appservices/tenant_app_features.appservice';
import Tenant_User_AppsAppService from './appservices/tenant_user_apps.appservice';
import Tenant_User_App_RolesAppService from './appservices/tenant_user_app_roles.appservice';
import Tenant_User_App_AlertsAppService from './appservices/tenant_user_app_alerts.appservice';
import RolesAppService from './appservices/roles.appservice';
import Feature_PermissionsAppService from './appservices/feature_permissions.appservice';
import FeaturesAppService from './appservices/features.appservice';
import ClientsAppService from './appservices/clients.appservice';
import AppsAppService from './appservices/apps.appservice';
import App_RolesAppService from './appservices/app_roles.appservice';
import App_MessagesAppService from './appservices/app_messages.appservice';
import { Tenant_UsersFacade } from './facade/tenant_users.facade';
import { Tenant_AppsFacade } from './facade/tenant_apps.facade';
import { Tenant_App_FeaturesFacade } from './facade/tenant_app_features.facade';
import { Tenant_User_AppsFacade } from './facade/tenant_user_apps.facade';
import { Tenant_User_App_RolesFacade } from './facade/tenant_user_app_roles.facade';
import { Tenant_User_App_AlertsFacade } from './facade/tenant_user_app_alerts.facade';
import { RolesFacade } from './facade/roles.facade';
import { Feature_PermissionsFacade } from './facade/feature_permissions.facade';
import { FeaturesFacade } from './facade/features.facade';
import { ClientsFacade } from './facade/clients.facade';
import { AppsFacade } from './facade/apps.facade';
import { App_RolesFacade } from './facade/app_roles.facade';
import { App_MessagesFacade } from './facade/app_messages.facade';
import { TenantsFacade } from './facade/tenants.facade';
import { TenantsEntity } from '../submodules/cap-platform-entities/tenants.entity';
import { TenantsRoutes } from './routes/tenants.route';
import { Tenant_UsersRoutes } from './routes/tenant_users.route';
import { Tenant_AppsRoutes } from './routes/tenant_apps.route';
import { Tenant_App_FeaturesRoutes } from './routes/tenant_app_features.route';
import { Tenant_User_AppsRoutes } from './routes/tenant_user_apps.route';
import { Tenant_User_App_RolesRoutes } from './routes/tenant_user_app_roles.route';
import { Tenant_User_App_AlertsRoutes } from './routes/tenant_user_app_alerts.route';
import { RolesRoutes } from './routes/roles.route';
import { Feature_PermissionsRoutes } from './routes/feature_permissions.route';
import { FeaturesRoutes } from './routes/features.route';
import { ClientsRoutes } from './routes/clients.route';
import { AppsRoutes } from './routes/apps.route';
import { App_RolesRoutes } from './routes/app_roles.route';
import { App_MessagesRoutes } from './routes/app_messages.route';
import { Tenant_UsersEntity } from '../submodules/cap-platform-entities/tenant_users.entity';
import { Tenant_User_AppsEntity } from '../submodules/cap-platform-entities/tenant_user_apps.entity';
import { Tenant_User_App_RolesEntity } from '../submodules/cap-platform-entities/tenant_user_app_roles.entity';
import { Tenant_User_App_AlertsEntity } from '../submodules/cap-platform-entities/tenant_user_app_alerts.entity';
import { Tenant_AppsEntity } from '../submodules/cap-platform-entities/tenant_apps.entity';
import { Tenant_App_FeaturesEntity } from '../submodules/cap-platform-entities/tenant_app_features.entity';
import { RolesEntity } from '../submodules/cap-platform-entities/roles.entity';
import { FeaturesEntity } from '../submodules/cap-platform-entities/features.entity';
import { Feature_PermissionsEntity } from '../submodules/cap-platform-entities/feature_permissions.entity';
import { ClientsEntity } from '../submodules/cap-platform-entities/clients.entity';
import { AppsEntity } from '../submodules/cap-platform-entities/apps.entity';
import { App_RolesEntity } from '../submodules/cap-platform-entities/app_roles.entity';
import { App_MessagesEntity } from '../submodules/cap-platform-entities/app_messages.entity';
import * as ormconfig from '.././ormconfig'

@Module({
  imports: [HttpModule,
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([ UsersEntity, 
                              TenantsEntity,
                              Tenant_UsersEntity,
                              Tenant_User_AppsEntity,
                              Tenant_User_App_RolesEntity,
                              Tenant_User_App_AlertsEntity,
                              Tenant_AppsEntity,
                              Tenant_App_FeaturesEntity,
                              RolesEntity,
                              FeaturesEntity,
                              Feature_PermissionsEntity,
                              ClientsEntity,
                              AppsEntity,
                              App_RolesEntity,
                              App_MessagesEntity
                             ]),
  ],
  providers: [UsersFacade,
              UsersAppService,
              TenantsFacade,
              TenantsAppService,
              Tenant_UsersFacade,
              Tenant_UsersAppService,
              Tenant_User_AppsFacade,
              Tenant_User_AppsAppService,
              Tenant_User_App_RolesFacade,
              Tenant_User_App_RolesAppService,
              Tenant_User_App_AlertsFacade,
              Tenant_User_App_AlertsAppService,
              Tenant_AppsFacade,
              Tenant_AppsAppService,
              Tenant_App_FeaturesFacade,
              Tenant_App_FeaturesAppService,
              RolesFacade,
              RolesAppService,
              FeaturesFacade,
              FeaturesAppService,
              Feature_PermissionsFacade,
              Feature_PermissionsAppService,
              ClientsFacade,
              ClientsAppService,
              AppsFacade,
              AppsAppService,
              App_RolesFacade,
              App_RolesAppService,
              App_MessagesFacade,
              App_MessagesAppService
            ],
  controllers: [UsersRoutes,
                TenantsRoutes,
                Tenant_UsersRoutes,
                Tenant_User_AppsRoutes,
                Tenant_User_App_RolesRoutes,
                Tenant_User_App_AlertsRoutes,
                Tenant_AppsRoutes,
                Tenant_App_FeaturesRoutes,
                RolesRoutes,
                FeaturesRoutes,
                Feature_PermissionsRoutes,
                ClientsRoutes,
                AppsRoutes,
                App_RolesRoutes,
                App_MessagesRoutes
              ]
})

export class EntityModule implements NestModule {
  constructor() {
    console.log("Inside Entity Module....");
  }

  configure(consumer: MiddlewareConsumer) {
    console.log("Inside Consumer body......");
  }
}