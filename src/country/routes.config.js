const rootPath="../../";
  const CountryController = require('./country.controller');
  const PermissionMiddleware = require(rootPath+'common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require(rootPath+'common/middlewares/auth.validation.middleware');
  const config = require(rootPath+'common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'name',format:'text',required:true,max:50,min:2},
{ctrl:'code',format:'text',required:true,max:10,min:2},
{ctrl:'dialCode',format:'text',required:true,max:10,min:0}
  ];
  exports.routesConfig = function (app) {
      app.post('/country', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        CountryController.insert
      ]);
      
      
      app.get('/country', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          CountryController.list
      ]);
      app.get('/country/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        CountryController.listAll
    ]);
    app.get('/country/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        CountryController.listSuggestions
    ]);
      app.get('/country/:countryId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          CountryController.getById
      ]);
      app.patch('/country/:countryId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          CountryController.patchById
      ]);
      app.delete('/country/:countryId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          CountryController.removeById
      ]);
  };
  
    