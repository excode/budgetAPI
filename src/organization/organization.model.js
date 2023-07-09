const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
    
const organizationSchema = new Schema({
    	createBy : { type: String,required:true,default:''},
        createAt : { type: Date,required:true},
        updateBy : { type: String},
        updateAt : { type: Date},
        name : { type: String,required:true,default:'',maxLength:50,minLength:2},
        type : { type: String,required:true,default:''},
        address : { type: String},
        city : { type: String,required:true,default:'',maxLength:30,minLength:2},
        state : { type: String,required:true,default:'',maxLength:30,minLength:2},
        country : { type: String},
        logo : { type: String},
        email : { type: String,required:true,default:'',unique: true }
});

organizationSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
organizationSchema.set('toJSON', {
    virtuals: true
});

organizationSchema.findById = function (cb) {
    return this.model('Organization').find({id: this.id}, cb);
};

const Organization = mongoose.model('Organization', organizationSchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Organization.findOne(queries)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.findByEmail = (email) => {
 return new Promise((resolve, reject) => {
    return Organization.findOne({email: email}).exec(function (err, data) {
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

                
exports.createOrganization = (organizationData) => {
    return new Promise(async(resolve, reject) => {
    
        let   emailCHeck =await Organization.findOne({"email":organizationData.email})
          if(emailCHeck ) {
            reject("email exists");
            return;
          }
        
    const organization = new Organization(organizationData);
    organization.save(function (err, saved) {
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
        
    if(query.createBy){
        if(query.hasOwnProperty('createBy_mode')){
            const mode = query.createBy_mode;
            if(mode=="startsWith"){
                _query['createBy'] = new RegExp('^'+query.createBy,'i');
            }else if(mode=="equals"){
                _query['createBy'] = query.createBy;
            }else if(mode=="notEquals"){
                _query['createBy'] = { $ne: query.createBy } ;
            }else if(mode=="endsWith"){
                _query['createBy'] = new RegExp(query.createBy+'$','i');
            }else if(mode=="notContains"){
                _query['createBy'] = {$not: new RegExp(query.createBy,'i')} ;
            }else if(mode=="contains"){
                _query['createBy'] = new RegExp(query.createBy,'i');
            }
        }else{
        _query['createBy'] = new RegExp(query.createBy,'i');
        }

    }


    if(query.updateBy){
        if(query.hasOwnProperty('updateBy_mode')){
            const mode = query.updateBy_mode;
            if(mode=="startsWith"){
                _query['updateBy'] = new RegExp('^'+query.updateBy,'i');
            }else if(mode=="equals"){
                _query['updateBy'] = query.updateBy;
            }else if(mode=="notEquals"){
                _query['updateBy'] = { $ne: query.updateBy } ;
            }else if(mode=="endsWith"){
                _query['updateBy'] = new RegExp(query.updateBy+'$','i');
            }else if(mode=="notContains"){
                _query['updateBy'] = {$not: new RegExp(query.updateBy,'i')} ;
            }else if(mode=="contains"){
                _query['updateBy'] = new RegExp(query.updateBy,'i');
            }
        }else{
        _query['updateBy'] = new RegExp(query.updateBy,'i');
        }

    }


    if(query.name){
        if(query.hasOwnProperty('name_mode')){
            const mode = query.name_mode;
            if(mode=="startsWith"){
                _query['name'] = new RegExp('^'+query.name,'i');
            }else if(mode=="equals"){
                _query['name'] = query.name;
            }else if(mode=="notEquals"){
                _query['name'] = { $ne: query.name } ;
            }else if(mode=="endsWith"){
                _query['name'] = new RegExp(query.name+'$','i');
            }else if(mode=="notContains"){
                _query['name'] = {$not: new RegExp(query.name,'i')} ;
            }else if(mode=="contains"){
                _query['name'] = new RegExp(query.name,'i');
            }
        }else{
        _query['name'] = new RegExp(query.name,'i');
        }

    }


    if(query.type){
        if(query.hasOwnProperty('type_mode')){
            const mode = query.type_mode;
            if(mode=="startsWith"){
                _query['type'] = new RegExp('^'+query.type,'i');
            }else if(mode=="equals"){
                _query['type'] = query.type;
            }else if(mode=="notEquals"){
                _query['type'] = { $ne: query.type } ;
            }else if(mode=="endsWith"){
                _query['type'] = new RegExp(query.type+'$','i');
            }else if(mode=="notContains"){
                _query['type'] = {$not: new RegExp(query.type,'i')} ;
            }else if(mode=="contains"){
                _query['type'] = new RegExp(query.type,'i');
            }
        }else{
        _query['type'] = new RegExp(query.type,'i');
        }

    }


    if(query.city){
        if(query.hasOwnProperty('city_mode')){
            const mode = query.city_mode;
            if(mode=="startsWith"){
                _query['city'] = new RegExp('^'+query.city,'i');
            }else if(mode=="equals"){
                _query['city'] = query.city;
            }else if(mode=="notEquals"){
                _query['city'] = { $ne: query.city } ;
            }else if(mode=="endsWith"){
                _query['city'] = new RegExp(query.city+'$','i');
            }else if(mode=="notContains"){
                _query['city'] = {$not: new RegExp(query.city,'i')} ;
            }else if(mode=="contains"){
                _query['city'] = new RegExp(query.city,'i');
            }
        }else{
        _query['city'] = new RegExp(query.city,'i');
        }

    }


    if(query.state){
        if(query.hasOwnProperty('state_mode')){
            const mode = query.state_mode;
            if(mode=="startsWith"){
                _query['state'] = new RegExp('^'+query.state,'i');
            }else if(mode=="equals"){
                _query['state'] = query.state;
            }else if(mode=="notEquals"){
                _query['state'] = { $ne: query.state } ;
            }else if(mode=="endsWith"){
                _query['state'] = new RegExp(query.state+'$','i');
            }else if(mode=="notContains"){
                _query['state'] = {$not: new RegExp(query.state,'i')} ;
            }else if(mode=="contains"){
                _query['state'] = new RegExp(query.state,'i');
            }
        }else{
        _query['state'] = new RegExp(query.state,'i');
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

        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }
        var sortBoj={[sortBy]:sortDirection};
        return new Promise((resolve, reject) => {
        Organization.find(_query)
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, organization) {
                if (err) {
                    reject(err);
                } else {
                    Organization.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: organization , count: total ,perpage:perPage,page:page };
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
    Organization.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, organization) {
                if (err) {
                    reject(err);
                } else {
                resolve(organization);
                }
            })
    });
};
exports.listSuggestions = (query ) => {
    const { search, ...queryWithoutSearch } = query
    var _query=queryWithoutSearch
    if(search){
        _query['$or'] =[ 
            {"name": {$regex: search, $options: "i"}},
				{"type": {$regex: search, $options: "i"}},
				{"city": {$regex: search, $options: "i"}},
				{"state": {$regex: search, $options: "i"}},
				{"email": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Organization.find(_query)
            .exec(function (err, organization) {
                if (err) {
                    reject(err);
                } else {
                    resolve(organization);
                }
            })
    });
};
exports.patchOrganization = (id, organizationData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise(async(resolve, reject) => {
        
        if(organizationData.email){
        let   emailCHeck =await Organization.findOne({_id:{$ne:id},"email":organizationData.email})
          if(emailCHeck ) {
            reject("email exists");
            return;
          }
        }
        
        Organization.findOne(queries, function (err, organization) {
            if (err) reject(err);
            for (let i in organizationData) {
                organization[i] = organizationData[i];
            }
            organization.save(function (err, updatedOrganization) {
                if (err) return reject(err);
                resolve(updatedOrganization);
            });
        });
    })

};

exports.removeById = (organizationId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:organizationId}
    return new Promise((resolve, reject) => {
        Organization.findOneAndDelete(queries, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};


    exports.uploadFile = (req) => {
        return new Promise(async(resolve, reject) => {
            if(req.file.size>1*1024*1024){ // you can chnage the file upload limit
                reject('file_size_too_big');
            }
            let colName = req.params.columnName
            let rowId = req.params.rowId
            let uploadedFileName =req.file.filename;
            Organization.findById(rowId, function (err, organization) {
                if (err) reject(err);
                organization[colName] =uploadedFileName;
                organization.save(function (err, updatedData) {
                    if (err) return reject(err);
                    resolve(uploadedFileName)
                });
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
    