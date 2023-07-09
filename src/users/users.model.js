const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
    
const usersSchema = new Schema({
    	firstName : { type: String},
			password : { type: String},
			email : { type: String,required:true,default:''},
			mobile : { type: String,required:true,default:'',maxLength:20,minLength:8},
			country : { type: String},
			userType : { type: String},
			lastName : { type: String,required:true,default:''},
			organization : { type: String},
			emailOTP : { type: String},
			emailOTPExpires : { type: Date}
});

usersSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
usersSchema.set('toJSON', {
    virtuals: true
});

usersSchema.findById = function (cb) {
    return this.model('Users').find({id: this.id}, cb);
};

const Users = mongoose.model('Users', usersSchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Users.findOne(queries)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};
exports.findByEmail3 = (id) => {
    var queries = {email:id}
    return Users.findOne(queries)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};
exports.findByEmail = (email) => {
    return new Promise((resolve, reject) => {
       return Users.findOne({email: email}).exec(function (err, data) {
       if (err) {
           reject(err);
       } else {
           if(data){
               resolve(data);
           }else{
               resolve(null);
           }
       }
       })
     });
   };
exports.createUsers = (usersData) => {
    return new Promise(async(resolve, reject) => {
        let   emailCHeck =await Users.findOne({"email":usersData.email})
        if(emailCHeck ) {
          reject("email exists");
          return;
        }
    const users = new Users(usersData);
    users.save(function (err, saved) {
        if (err) {
            return reject(err);
        }
        resolve(saved)
    });
    });
};

exports.list = (perPage, page , query ) => {
        const _query={};
        let sortBy='_id'
        let sortDirection=-1
        
    if(query.firstName){
        if(query.hasOwnProperty('firstName_mode')){
            const mode = query.firstName_mode;
            if(mode=="startsWith"){
                _query['firstName'] = new RegExp('^'+query.firstName,'i');
            }else if(mode=="equals"){
                _query['firstName'] = query.firstName;
            }else if(mode=="notEquals"){
                _query['firstName'] = { $ne: query.firstName } ;
            }else if(mode=="endsWith"){
                _query['firstName'] = new RegExp(query.firstName+'$','i');
            }else if(mode=="notContains"){
                _query['firstName'] = {$not: new RegExp(query.firstName,'i')} ;
            }else if(mode=="contains"){
                _query['firstName'] = new RegExp(query.firstName,'i');
            }
        }else{
        _query['firstName'] = new RegExp(query.firstName,'i');
        }

    }


    if(query.email){
        if(query.hasOwnProperty('email_mode')){
            const mode = query.email_mode;
            if(mode=="startsWith"){
                _query['email'] = new RegExp('^'+query.email,'i');
            }else if(mode=="equals"){
                _query['email'] = query.email;
            }else if(mode=="notEquals"){
                _query['email'] = { $ne: query.email } ;
            }else if(mode=="endsWith"){
                _query['email'] = new RegExp(query.email+'$','i');
            }else if(mode=="notContains"){
                _query['email'] = {$not: new RegExp(query.email,'i')} ;
            }else if(mode=="contains"){
                _query['email'] = new RegExp(query.email,'i');
            }
        }else{
        _query['email'] = new RegExp(query.email,'i');
        }

    }


    if(query.mobile){
        if(query.hasOwnProperty('mobile_mode')){
            const mode = query.mobile_mode;
            if(mode=="startsWith"){
                _query['mobile'] = new RegExp('^'+query.mobile,'i');
            }else if(mode=="equals"){
                _query['mobile'] = query.mobile;
            }else if(mode=="notEquals"){
                _query['mobile'] = { $ne: query.mobile } ;
            }else if(mode=="endsWith"){
                _query['mobile'] = new RegExp(query.mobile+'$','i');
            }else if(mode=="notContains"){
                _query['mobile'] = {$not: new RegExp(query.mobile,'i')} ;
            }else if(mode=="contains"){
                _query['mobile'] = new RegExp(query.mobile,'i');
            }
        }else{
        _query['mobile'] = new RegExp(query.mobile,'i');
        }

    }


    if(query.lastName){
        if(query.hasOwnProperty('lastName_mode')){
            const mode = query.lastName_mode;
            if(mode=="startsWith"){
                _query['lastName'] = new RegExp('^'+query.lastName,'i');
            }else if(mode=="equals"){
                _query['lastName'] = query.lastName;
            }else if(mode=="notEquals"){
                _query['lastName'] = { $ne: query.lastName } ;
            }else if(mode=="endsWith"){
                _query['lastName'] = new RegExp(query.lastName+'$','i');
            }else if(mode=="notContains"){
                _query['lastName'] = {$not: new RegExp(query.lastName,'i')} ;
            }else if(mode=="contains"){
                _query['lastName'] = new RegExp(query.lastName,'i');
            }
        }else{
        _query['lastName'] = new RegExp(query.lastName,'i');
        }

    }


    if(query.organization){
        if(query.hasOwnProperty('organization_mode')){
            const mode = query.organization_mode;
            if(mode=="startsWith"){
                _query['organization'] = new RegExp('^'+query.organization,'i');
            }else if(mode=="equals"){
                _query['organization'] = query.organization;
            }else if(mode=="notEquals"){
                _query['organization'] = { $ne: query.organization } ;
            }else if(mode=="endsWith"){
                _query['organization'] = new RegExp(query.organization+'$','i');
            }else if(mode=="notContains"){
                _query['organization'] = {$not: new RegExp(query.organization,'i')} ;
            }else if(mode=="contains"){
                _query['organization'] = new RegExp(query.organization,'i');
            }
        }else{
        _query['organization'] = new RegExp(query.organization,'i');
        }

    }


    if(query.emailOTP){
        if(query.hasOwnProperty('emailOTP_mode')){
            const mode = query.emailOTP_mode;
            if(mode=="startsWith"){
                _query['emailOTP'] = new RegExp('^'+query.emailOTP,'i');
            }else if(mode=="equals"){
                _query['emailOTP'] = query.emailOTP;
            }else if(mode=="notEquals"){
                _query['emailOTP'] = { $ne: query.emailOTP } ;
            }else if(mode=="endsWith"){
                _query['emailOTP'] = new RegExp(query.emailOTP+'$','i');
            }else if(mode=="notContains"){
                _query['emailOTP'] = {$not: new RegExp(query.emailOTP,'i')} ;
            }else if(mode=="contains"){
                _query['emailOTP'] = new RegExp(query.emailOTP,'i');
            }
        }else{
        _query['emailOTP'] = new RegExp(query.emailOTP,'i');
        }

    }

        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }
        var sortBoj={[sortBy]:sortDirection};
        return new Promise((resolve, reject) => {
        Users.find(_query)
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    Users.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: users , count: total ,perpage:perPage,page:page };
                        resolve(promises);
                    }).catch((err2)=>{
                        reject(err2);
                    })
                }
            })
    });
};
exports.listAll = ( query={} ) => {
    const _query={...query};
    let sortBy='_id'
    let sortDirection=-1
    let max_limit = 300;
    if(query.sortBy){
        sortBy = query.sortBy;
    }
    if(query.sortDirection){
        sortDirection = query.sortDirection;
    }
    var sortBoj={[sortBy]:sortDirection};
    return new Promise((resolve, reject) => {
    Users.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                resolve(users);
                }
            })
    });
};
exports.listSuggestions = (query ) => {
    const { search, ...queryWithoutSearch } = query
    var _query=queryWithoutSearch
    if(search){
        _query['$or'] =[ 
            {"firstName": {$regex: search, $options: "i"}},
				{"email": {$regex: search, $options: "i"}},
				{"mobile": {$regex: search, $options: "i"}},
				{"lastName": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Users.find(_query)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};
exports.patchUsers = (id, usersData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise((resolve, reject) => {
        
        Users.findOne(queries, function (err, users) {
            if (err) reject(err);
            for (let i in usersData) {
                users[i] = usersData[i];
            }
            users.save(function (err, updatedUsers) {
                if (err) return reject(err);
                resolve(updatedUsers);
            });
        });
    })

};

exports.removeById = (usersId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:usersId}
    return new Promise((resolve, reject) => {
        Users.findOneAndDelete(queries, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};



const queryFormatter=(querys)=>{
    
    var cols=[];
    var vals =querys;
    var _query={};
    for (const key in querys) {

        if(typeof(querys[key]) === 'object'){
            let valueKey = Object.keys(querys[key])[0];
            let value = querys[key][valueKey]
            if(querys[key].hasOwnProperty('ne')){
                _query[key] = { $ne: value } ;
            }else if(querys[key].hasOwnProperty('lt')){
                _query[key] = { $lt: value } ;
            }else if(querys[key].hasOwnProperty('gt')){
                _query[key] = { $gt: value } ;
            }else if(querys[key].hasOwnProperty('lte')){
                _query[key] = { $lte: value } ;
            }else if(querys[key].hasOwnProperty('gte')){
                _query[key] = { $gte: value } ;
            }else if(querys[key].hasOwnProperty('startsWith')){
                _query[key] = new RegExp('^'+value,'i');
            }else if(querys[key].hasOwnProperty('endsWith')){
                _query[key] = new RegExp(value+'$','i');
            }else if(querys[key].hasOwnProperty('contains')){
                _query[key] = new RegExp(value,'i');
            }else if(querys[key].hasOwnProperty('notContains')){
                _query[key] = {$not: new RegExp(value,'i')} ;
            }
        }else if(typeof(querys[key]) === 'string' || typeof(querys[key]) === 'number'){
            _query[key] =  querys[key] ;
        }
        
    }
    return _query
}
    