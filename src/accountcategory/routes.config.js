const rootPath="../../";
  const AccountcategoryController = require('./accountcategory.controller');
  const PermissionMiddleware = require(rootPath+'common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require(rootPath+'common/middlewares/auth.validation.middleware');
  const config = require(rootPath+'common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'accountType',format:'text',required:true,max:50,min:0},
{ctrl:'parentCategory',format:'text',required:false,max:1000,min:1},
{ctrl:'category',format:'text',required:true,max:50,min:2}
  ];
  exports.routesConfig = function (app) {
      app.post('/accountcategory', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        AccountcategoryController.insert
      ]);
      
      
      app.get('/accountcategory', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          AccountcategoryController.list
      ]);
      app.get('/accountcategory/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        AccountcategoryController.listAll
    ]);
    app.get('/accountcategory/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        AccountcategoryController.listSuggestions
    ]);
      app.get('/accountcategory/:accountcategoryId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          AccountcategoryController.getById
      ]);
      app.patch('/accountcategory/:accountcategoryId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          AccountcategoryController.patchById
      ]);
      app.delete('/accountcategory/:accountcategoryId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          AccountcategoryController.removeById
      ]);
  };
  
    