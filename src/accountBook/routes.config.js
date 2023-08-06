const rootPath="../../";
  const AccountBookController = require('./accountBook.controller');
  const PermissionMiddleware = require(rootPath+'common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require(rootPath+'common/middlewares/auth.validation.middleware');
  const config = require(rootPath+'common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'particular',format:'text',required:true,max:50,min:0},
{ctrl:'receiptNo',format:'text',required:true,max:40,min:0},
{ctrl:'amount',format:'number',required:true},
{ctrl:'category',format:'text',required:true},
{ctrl:'memo',format:'',required:false}
  ];
  exports.routesConfig = function (app) {
      app.post('/accountbook', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        AccountBookController.insert
      ]);
      
      
      app.get('/accountbook', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          AccountBookController.list
      ]);
      app.get('/chart/all', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        AccountBookController.chartData
    ]);
      app.get('/accountbook/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        AccountBookController.listAll
    ]);
    app.get('/accountbook/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        AccountBookController.listSuggestions
    ]);
      app.get('/accountbook/:accountbookId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          AccountBookController.getById
      ]);
      app.patch('/accountbook/:accountbookId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          AccountBookController.patchById
      ]);
      app.delete('/accountbook/:accountbookId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          AccountBookController.removeById
      ]);
      app.get('/accountbookfix', [
       // ValidationMiddleware.validJWTNeeded,
       // PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        AccountBookController.patchAccountBookFix
    ]);
  };
  
    