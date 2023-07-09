const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
    
const countrySchema = new Schema({
    	createBy : { type: String,required:true,default:''},
			createAt : { type: Date,required:true},
			updateBy : { type: String},
			updateAt : { type: Date},
			name : { type: String,required:true,default:'',maxLength:50,minLength:2},
			code : { type: String,required:true,default:'',maxLength:10,minLength:2},
			dialCode : { type: String,required:true,default:'',maxLength:10}
});

countrySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
countrySchema.set('toJSON', {
    virtuals: true
});

countrySchema.findById = function (cb) {
    return this.model('Country').find({id: this.id}, cb);
};

const Country = mongoose.model('Country', countrySchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Country.findOne(queries)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createCountry = (countryData) => {
    return new Promise((resolve, reject) => {
    
    const country = new Country(countryData);
    country.save(function (err, saved) {
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


    if(query.code){
        if(query.hasOwnProperty('code_mode')){
            const mode = query.code_mode;
            if(mode=="startsWith"){
                _query['code'] = new RegExp('^'+query.code,'i');
            }else if(mode=="equals"){
                _query['code'] = query.code;
            }else if(mode=="notEquals"){
                _query['code'] = { $ne: query.code } ;
            }else if(mode=="endsWith"){
                _query['code'] = new RegExp(query.code+'$','i');
            }else if(mode=="notContains"){
                _query['code'] = {$not: new RegExp(query.code,'i')} ;
            }else if(mode=="contains"){
                _query['code'] = new RegExp(query.code,'i');
            }
        }else{
        _query['code'] = new RegExp(query.code,'i');
        }

    }


    if(query.dialCode){
        if(query.hasOwnProperty('dialCode_mode')){
            const mode = query.dialCode_mode;
            if(mode=="startsWith"){
                _query['dialCode'] = new RegExp('^'+query.dialCode,'i');
            }else if(mode=="equals"){
                _query['dialCode'] = query.dialCode;
            }else if(mode=="notEquals"){
                _query['dialCode'] = { $ne: query.dialCode } ;
            }else if(mode=="endsWith"){
                _query['dialCode'] = new RegExp(query.dialCode+'$','i');
            }else if(mode=="notContains"){
                _query['dialCode'] = {$not: new RegExp(query.dialCode,'i')} ;
            }else if(mode=="contains"){
                _query['dialCode'] = new RegExp(query.dialCode,'i');
            }
        }else{
        _query['dialCode'] = new RegExp(query.dialCode,'i');
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
        Country.find(_query)
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, country) {
                if (err) {
                    reject(err);
                } else {
                    Country.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: country , count: total ,perpage:perPage,page:page };
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
    Country.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, country) {
                if (err) {
                    reject(err);
                } else {
                resolve(country);
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
				{"code": {$regex: search, $options: "i"}},
				{"dialCode": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Country.find(_query)
            .exec(function (err, country) {
                if (err) {
                    reject(err);
                } else {
                    resolve(country);
                }
            })
    });
};
exports.patchCountry = (id, countryData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise((resolve, reject) => {
        
        Country.findOne(queries, function (err, country) {
            if (err) reject(err);
            for (let i in countryData) {
                country[i] = countryData[i];
            }
            country.save(function (err, updatedCountry) {
                if (err) return reject(err);
                resolve(updatedCountry);
            });
        });
    })

};

exports.removeById = (countryId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:countryId}
    return new Promise((resolve, reject) => {
        Country.findOneAndDelete(queries, (err) => {
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
    