const rootPath="../../";
  const OrganizationController = require('./organization.controller');
  const PermissionMiddleware = require(rootPath+'common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require(rootPath+'common/middlewares/auth.validation.middleware');
  const config = require(rootPath+'common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'name',format:'text',required:true,max:50,min:2},
{ctrl:'type',format:'text',required:true},
{ctrl:'address',format:'',required:true},
{ctrl:'city',format:'text',required:true,max:30,min:2},
{ctrl:'state',format:'text',required:true,max:30,min:2},
{ctrl:'country',format:'',required:true},
{ctrl:'email',format:'email',required:true}
  ];
  exports.routesConfig = function (app) {
      app.post('/organization', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        OrganizationController.insert
      ]);
      
      
    app.post('/organization/upload/:columnName/:rowId', [
        ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.organizationInsertPermission(),  // 
        //PermissionMiddleware.jorganizationInsertLimit(),     // 
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        OrganizationController.uploadfile
    ]);
        
      app.get('/organization', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          OrganizationController.list
      ]);
      app.get('/organization/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        OrganizationController.listAll
    ]);
    app.get('/organization/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        OrganizationController.listSuggestions
    ]);
      app.get('/organization/:organizationId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          OrganizationController.getById
      ]);
      app.patch('/organization/:organizationId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          OrganizationController.patchById
      ]);
      app.delete('/organization/:organizationId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          OrganizationController.removeById
      ]);
  };
  
    