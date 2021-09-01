import {MigrationInterface, QueryRunner} from "typeorm";

export class init1630401140351 implements MigrationInterface {
    name = 'init1630401140351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "features" ("id" SERIAL NOT NULL, "CreationDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "ModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "CreatedBy" integer, "ModifiedBy" integer, "RowVersion" integer, "feature_id" integer, "feature_name" character varying, "app_id" integer, "base_feature_id" integer, "feature_description" character varying, "feature_key" character varying, "operations" character varying, "feature_type" integer, CONSTRAINT "UQ_5c1e336df2f4a7051e5bf08a941" UNIQUE ("id"), CONSTRAINT "PK_5c1e336df2f4a7051e5bf08a941" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" SERIAL NOT NULL, "CreationDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "ModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "CreatedBy" integer, "ModifiedBy" integer, "RowVersion" integer, "address_id" integer, "start_date" TIMESTAMP, "Expiry_date" TIMESTAMP, "client_key" character varying, "client_name" character varying, "decsription" character varying, "contact_id" integer, CONSTRAINT "UQ_f1ab7cf3a5714dbc6bb4e1c28a4" UNIQUE ("id"), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tenant_app_features" ("id" SERIAL NOT NULL, "CreationDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "ModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "CreatedBy" integer, "ModifiedBy" integer, "RowVersion" integer, "tenant_app_id" integer, "feature_id" integer, CONSTRAINT "UQ_5449f186acfb9d1cd589b4a3f28" UNIQUE ("id"), CONSTRAINT "PK_5449f186acfb9d1cd589b4a3f28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tenant_user_app_alerts" ("id" SERIAL NOT NULL, "CreationDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "ModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "CreatedBy" integer, "ModifiedBy" integer, "RowVersion" integer, "alert_type" character varying, "alert_name" character varying, "alert_desc" character varying, "from_date_time" TIMESTAMP, "alert_duration_type" character varying, "subscription_date" TIMESTAMP, "has_unsubscribed" boolean, "tenant_user_app_id" integer, "tenant_user_id" integer, "user_id" integer, CONSTRAINT "UQ_f939fef9cbab27643a23cd73a41" UNIQUE ("id"), CONSTRAINT "PK_f939fef9cbab27643a23cd73a41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tenant_user_app_roles" ("id" SERIAL NOT NULL, "CreationDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "ModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "CreatedBy" integer, "ModifiedBy" integer, "RowVersion" integer, "tenant_user_app_id" integer, "role_id" integer, CONSTRAINT "UQ_a146633142987b82574f70a7be3" UNIQUE ("id"), CONSTRAINT "PK_a146633142987b82574f70a7be3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tenant_user_apps" ("id" SERIAL NOT NULL, "CreationDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "ModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "CreatedBy" integer, "ModifiedBy" integer, "RowVersion" integer, "tenant_user_id" integer, "tanant_app_id" integer, "tenant_user_app_permissions" character varying, "tenant_app_id" integer, CONSTRAINT "UQ_b92ff559fc81399a23b51a9ac9b" UNIQUE ("id"), CONSTRAINT "PK_b92ff559fc81399a23b51a9ac9b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tenant_apps" ("id" SERIAL NOT NULL, "CreationDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "ModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "CreatedBy" integer, "ModifiedBy" integer, "RowVersion" integer, "tenant_id" integer, "app_id" integer, "connection_string" character varying, "all_features" boolean, CONSTRAINT "UQ_f03ae6b031e3de7447a392504c2" UNIQUE ("id"), CONSTRAINT "PK_f03ae6b031e3de7447a392504c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tenants" ("id" SERIAL NOT NULL, "CreationDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "ModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "CreatedBy" integer, "ModifiedBy" integer, "RowVersion" integer, "tanant_name" character varying, "description" character varying, "alias" character varying, "published_from" TIMESTAMP, "published_till" TIMESTAMP, "is_complete" boolean, "site_image_url_path" character varying, "status_id" integer, "client_id" integer, "identity_providers_details" json, "tenant_admin_email" character varying, CONSTRAINT "UQ_53be67a04681c66b87ee27c9321" UNIQUE ("id"), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tenant_users" ("id" SERIAL NOT NULL, "CreationDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "ModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "CreatedBy" integer, "ModifiedBy" integer, "RowVersion" integer, "tenant_id" integer, "user_id" integer, "identity_provider_subscriber_id" character varying, CONSTRAINT "UQ_8ce1bc9e3a5887c234900365447" UNIQUE ("id"), CONSTRAINT "PK_8ce1bc9e3a5887c234900365447" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "CreationDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "ModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "CreatedBy" integer, "ModifiedBy" integer, "RowVersion" integer, "login_name" character varying, "birth_date" TIMESTAMP, "date_of_joining" TIMESTAMP, "first_name" character varying, "last_name" character varying, "email" character varying, "phone" integer, "marital_status" character varying, CONSTRAINT "UQ_a3ffb1c0c8416b9fc6f907b7433" UNIQUE ("id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "feature_permissions" ("id" SERIAL NOT NULL, "CreationDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "ModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "CreatedBy" integer, "ModifiedBy" integer, "RowVersion" integer, "feature_id" integer, "operation_permitted" json, "role_id" integer, "user_id" integer, "role_feature_security" json, CONSTRAINT "PK_10a78eab0154ad71ac1804a60f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "CreationDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "ModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "CreatedBy" integer, "ModifiedBy" integer, "RowVersion" integer, "role_name" character varying, "role_priviledge" json, CONSTRAINT "UQ_c1433d71a4838793a49dcad46ab" UNIQUE ("id"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "app_roles" ("id" SERIAL NOT NULL, "CreationDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "ModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "CreatedBy" integer, "ModifiedBy" integer, "RowVersion" integer, "role_id" integer, "app_id" integer, "app_role_permisssions" character varying, CONSTRAINT "UQ_1dab358fe21b705367e3a7194c0" UNIQUE ("id"), CONSTRAINT "PK_1dab358fe21b705367e3a7194c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "apps" ("id" SERIAL NOT NULL, "CreationDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "ModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "CreatedBy" integer, "ModifiedBy" integer, "RowVersion" integer, "app_name" character varying, "app_description" character varying, CONSTRAINT "UQ_c5121fda0f8268f1f7f84134e19" UNIQUE ("id"), CONSTRAINT "PK_c5121fda0f8268f1f7f84134e19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "app_messages" ("id" SERIAL NOT NULL, "CreationDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "ModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "CreatedBy" integer, "ModifiedBy" integer, "RowVersion" integer, "user_id" integer, "tenant_id" integer, "app_id" integer, "is_notification" boolean, "subject" character varying, "message_body" character varying, "is_read" boolean, CONSTRAINT "UQ_25d411ff90c7083b6e4b6b7984e" UNIQUE ("id"), CONSTRAINT "PK_25d411ff90c7083b6e4b6b7984e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "features" ADD CONSTRAINT "FK_3a93e2fd2b0265d982bf8335555" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant_app_features" ADD CONSTRAINT "FK_2eb489d22a7c04059bca75892cf" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant_app_features" ADD CONSTRAINT "FK_4d070a851bf5c12f6e2a07a7f96" FOREIGN KEY ("tenant_app_id") REFERENCES "features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant_user_app_alerts" ADD CONSTRAINT "FK_d54e5ee65a0cf6623047c5ab7d8" FOREIGN KEY ("tenant_user_app_id") REFERENCES "tenant_user_apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant_user_app_roles" ADD CONSTRAINT "FK_b71f72ea4e58125ca605a20e2d1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant_user_app_roles" ADD CONSTRAINT "FK_8ffb8fba0130e685aab9e5e882f" FOREIGN KEY ("tenant_user_app_id") REFERENCES "tenant_user_apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant_user_apps" ADD CONSTRAINT "FK_52f91b870c64c568e4ef3f0a8e6" FOREIGN KEY ("tenant_app_id") REFERENCES "tenant_apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant_user_apps" ADD CONSTRAINT "FK_83fff761b63ce10473bba2a7c99" FOREIGN KEY ("tenant_user_id") REFERENCES "tenant_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant_apps" ADD CONSTRAINT "FK_0bc717b8deb4026012186d13a71" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant_apps" ADD CONSTRAINT "FK_db3885c94123e5131e6a1c50d41" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD CONSTRAINT "FK_4455a7606cf8ab3e27c6dc25170" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant_users" ADD CONSTRAINT "FK_d53e87bfe2cfc2bf22180bb5f73" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant_users" ADD CONSTRAINT "FK_85a7f13b3f434940151fb44f4c1" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feature_permissions" ADD CONSTRAINT "FK_fae774575ddc00721ac482a5968" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feature_permissions" ADD CONSTRAINT "FK_64ad3babaad0acba1449a8b59f5" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feature_permissions" ADD CONSTRAINT "FK_34dee975466dd987a2c68cf3ff5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_roles" ADD CONSTRAINT "FK_8259be55534380eac4e8eab841a" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_roles" ADD CONSTRAINT "FK_b2cecb8c66fa2e14925594f9e52" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_messages" ADD CONSTRAINT "FK_4737095d3c4ac5f31199f8641cd" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_messages" DROP CONSTRAINT "FK_4737095d3c4ac5f31199f8641cd"`);
        await queryRunner.query(`ALTER TABLE "app_roles" DROP CONSTRAINT "FK_b2cecb8c66fa2e14925594f9e52"`);
        await queryRunner.query(`ALTER TABLE "app_roles" DROP CONSTRAINT "FK_8259be55534380eac4e8eab841a"`);
        await queryRunner.query(`ALTER TABLE "feature_permissions" DROP CONSTRAINT "FK_34dee975466dd987a2c68cf3ff5"`);
        await queryRunner.query(`ALTER TABLE "feature_permissions" DROP CONSTRAINT "FK_64ad3babaad0acba1449a8b59f5"`);
        await queryRunner.query(`ALTER TABLE "feature_permissions" DROP CONSTRAINT "FK_fae774575ddc00721ac482a5968"`);
        await queryRunner.query(`ALTER TABLE "tenant_users" DROP CONSTRAINT "FK_85a7f13b3f434940151fb44f4c1"`);
        await queryRunner.query(`ALTER TABLE "tenant_users" DROP CONSTRAINT "FK_d53e87bfe2cfc2bf22180bb5f73"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP CONSTRAINT "FK_4455a7606cf8ab3e27c6dc25170"`);
        await queryRunner.query(`ALTER TABLE "tenant_apps" DROP CONSTRAINT "FK_db3885c94123e5131e6a1c50d41"`);
        await queryRunner.query(`ALTER TABLE "tenant_apps" DROP CONSTRAINT "FK_0bc717b8deb4026012186d13a71"`);
        await queryRunner.query(`ALTER TABLE "tenant_user_apps" DROP CONSTRAINT "FK_83fff761b63ce10473bba2a7c99"`);
        await queryRunner.query(`ALTER TABLE "tenant_user_apps" DROP CONSTRAINT "FK_52f91b870c64c568e4ef3f0a8e6"`);
        await queryRunner.query(`ALTER TABLE "tenant_user_app_roles" DROP CONSTRAINT "FK_8ffb8fba0130e685aab9e5e882f"`);
        await queryRunner.query(`ALTER TABLE "tenant_user_app_roles" DROP CONSTRAINT "FK_b71f72ea4e58125ca605a20e2d1"`);
        await queryRunner.query(`ALTER TABLE "tenant_user_app_alerts" DROP CONSTRAINT "FK_d54e5ee65a0cf6623047c5ab7d8"`);
        await queryRunner.query(`ALTER TABLE "tenant_app_features" DROP CONSTRAINT "FK_4d070a851bf5c12f6e2a07a7f96"`);
        await queryRunner.query(`ALTER TABLE "tenant_app_features" DROP CONSTRAINT "FK_2eb489d22a7c04059bca75892cf"`);
        await queryRunner.query(`ALTER TABLE "features" DROP CONSTRAINT "FK_3a93e2fd2b0265d982bf8335555"`);
        await queryRunner.query(`DROP TABLE "app_messages"`);
        await queryRunner.query(`DROP TABLE "apps"`);
        await queryRunner.query(`DROP TABLE "app_roles"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "feature_permissions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "tenant_users"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
        await queryRunner.query(`DROP TABLE "tenant_apps"`);
        await queryRunner.query(`DROP TABLE "tenant_user_apps"`);
        await queryRunner.query(`DROP TABLE "tenant_user_app_roles"`);
        await queryRunner.query(`DROP TABLE "tenant_user_app_alerts"`);
        await queryRunner.query(`DROP TABLE "tenant_app_features"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "features"`);
    }

}
