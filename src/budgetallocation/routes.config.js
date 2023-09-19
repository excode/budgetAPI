const rootPath="../../";
  const BudgetallocationController = require('./budgetallocation.controller');
  const PermissionMiddleware = require(rootPath+'common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require(rootPath+'common/middlewares/auth.validation.middleware');
  const config = require(rootPath+'common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    //{ctrl:'organization',format:'text',required:true},
{ctrl:'fiscalyear',format:'year',required:true},
{ctrl:'allcocatedAmount',format:'number',required:true,max:1000,min:1},
{ctrl:'memo',format:'',required:false},
{ctrl:'category',format:'text',required:true}
  ];
  exports.routesConfig = function (app) {
      app.post('/budgetallocation', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        BudgetallocationController.insert
      ]);
      
      
      app.get('/budgetallocation', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          BudgetallocationController.list
      ]);
      app.get('/budgetallocation/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        BudgetallocationController.listAll
    ]);
    app.get('/budgetallocation/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        BudgetallocationController.listSuggestions
    ]);
      app.get('/budgetallocation/:budgetallocationId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          BudgetallocationController.getById
      ]);
      app.patch('/budgetallocation/:budgetallocationId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          BudgetallocationController.patchById
      ]);
      app.delete('/budgetallocation/:budgetallocationId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          BudgetallocationController.removeById
      ]);
  };
  
    