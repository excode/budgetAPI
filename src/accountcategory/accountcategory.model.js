const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
    
const accountcategorySchema = new Schema({
    	createBy : { type: String,required:true,default:''},
        createAt : { type: Date,required:true},
        updateBy : { type: String},
        updateAt : { type: Date},
        accountType : { type: String,required:true,default:'',maxLength:50},
        parentCategory : { type: String,maxLength:1000,minLength:1},
        category : { type: String,required:true,default:'',maxLength:50,minLength:2},
        isParentCategory : { type:Boolean,required:true,default:false}
});

accountcategorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
accountcategorySchema.set('toJSON', {
    virtuals: true
});

accountcategorySchema.findById = function (cb) {
    return this.model('Accountcategory').find({id: this.id}, cb);
};

const Accountcategory = mongoose.model('Accountcategory', accountcategorySchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Accountcategory.findOne(queries)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};
exports.findByCategory = (category) => {
    //var extraQuery =queryFormatter(extraField);
    var queries = {category:category}
    return Accountcategory.findOne(queries)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createAccountcategory = (accountcategoryData) => {
    return new Promise((resolve, reject) => {
    
    const accountcategory = new Accountcategory(accountcategoryData);
    accountcategory.save(function (err, saved) {
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


    if(query.accountType){
        if(query.hasOwnProperty('accountType_mode')){
            const mode = query.accountType_mode;
            if(mode=="startsWith"){
                _query['accountType'] = new RegExp('^'+query.accountType,'i');
            }else if(mode=="equals"){
                _query['accountType'] = query.accountType;
            }else if(mode=="notEquals"){
                _query['accountType'] = { $ne: query.accountType } ;
            }else if(mode=="endsWith"){
                _query['accountType'] = new RegExp(query.accountType+'$','i');
            }else if(mode=="notContains"){
                _query['accountType'] = {$not: new RegExp(query.accountType,'i')} ;
            }else if(mode=="contains"){
                _query['accountType'] = new RegExp(query.accountType,'i');
            }
        }else{
        _query['accountType'] = new RegExp(query.accountType,'i');
        }

    }


    if(query.parentCategory){
        if(query.hasOwnProperty('parentCategory_mode')){
            const mode = query.parentCategory_mode;
            if(mode=="startsWith"){
                _query['parentCategory'] = new RegExp('^'+query.parentCategory,'i');
            }else if(mode=="equals"){
                _query['parentCategory'] = query.parentCategory;
            }else if(mode=="notEquals"){
                _query['parentCategory'] = { $ne: query.parentCategory } ;
            }else if(mode=="endsWith"){
                _query['parentCategory'] = new RegExp(query.parentCategory+'$','i');
            }else if(mode=="notContains"){
                _query['parentCategory'] = {$not: new RegExp(query.parentCategory,'i')} ;
            }else if(mode=="contains"){
                _query['parentCategory'] = new RegExp(query.parentCategory,'i');
            }
        }else{
        _query['parentCategory'] = new RegExp(query.parentCategory,'i');
        }

    }


    if(query.category){
        if(query.hasOwnProperty('category_mode')){
            const mode = query.category_mode;
            if(mode=="startsWith"){
                _query['category'] = new RegExp('^'+query.category,'i');
            }else if(mode=="equals"){
                _query['category'] = query.category;
            }else if(mode=="notEquals"){
                _query['category'] = { $ne: query.category } ;
            }else if(mode=="endsWith"){
                _query['category'] = new RegExp(query.category+'$','i');
            }else if(mode=="notContains"){
                _query['category'] = {$not: new RegExp(query.category,'i')} ;
            }else if(mode=="contains"){
                _query['category'] = new RegExp(query.category,'i');
            }
        }else{
        _query['category'] = new RegExp(query.category,'i');
        }

    }


    if(query.isParentCategory!=null){
        _query['isParentCategory'] = query.isParentCategory 
    }
            
        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }
        var sortBoj={[sortBy]:sortDirection};
        return new Promise((resolve, reject) => {
        Accountcategory.find(_query)
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, accountcategory) {
                if (err) {
                    reject(err);
                } else {
                    Accountcategory.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: accountcategory , count: total ,perpage:perPage,page:page };
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
    let sortBy='category'
    let sortDirection=1
    let max_limit = 300;
    if(query.sortBy){
        sortBy = query.sortBy;
    }
    if(query.sortDirection){
        sortDirection = query.sortDirection;
    }
    var sortBoj={[sortBy]:sortDirection};
    return new Promise((resolve, reject) => {
    Accountcategory.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, accountcategory) {
                if (err) {
                    reject(err);
                } else {
                resolve(accountcategory);
                }
            })
    });
};
exports.listSuggestions = (query ) => {
    const { search, ...queryWithoutSearch } = query
    var _query=queryWithoutSearch
    if(search){
        _query['$or'] =[ 
            {"accountType": {$regex: search, $options: "i"}},
				{"parentCategory": {$regex: search, $options: "i"}},
				{"category": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Accountcategory.find(_query)
            .exec(function (err, accountcategory) {
                if (err) {
                    reject(err);
                } else {
                    resolve(accountcategory);
                }
            })
    });
};
exports.patchAccountcategory = (id, accountcategoryData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise((resolve, reject) => {
        
        Accountcategory.findOne(queries, function (err, accountcategory) {
            if (err) reject(err);
            for (let i in accountcategoryData) {
                accountcategory[i] = accountcategoryData[i];
            }
            accountcategory.save(function (err, updatedAccountcategory) {
                if (err) return reject(err);
                resolve(updatedAccountcategory);
            });
        });
    })

};

exports.removeById = (accountcategoryId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:accountcategoryId}
    return new Promise((resolve, reject) => {
        Accountcategory.findOneAndDelete(queries, (err) => {
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
    