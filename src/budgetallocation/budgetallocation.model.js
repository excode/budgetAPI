const mongoose = require('../../common/services/mongoose.service').mongoose;
const AccountcategoryModel = require('../accountcategory/accountcategory.model');
const UsersModel = require('../users/users.model');
const Schema = mongoose.Schema;
    
const budgetallocationSchema = new Schema({
    createBy : { type: String,required:true,default:''},
    createAt : { type: Date,required:true},
    updateBy : { type: String},
    updateAt : { type: Date},
    organization : { type: String,default:''},
    organizationId : { type: String},
    fiscalyear : { type: Date,required:true},
    allcocatedAmount : { type: Number,required:true,default:0,max:Infinity,min:1},
    memo : { type: String},
    category : { type: String,required:true,default:''},
    accountType : { type: String},
    user : { type: String},
    userId : { type: String}
});

budgetallocationSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
budgetallocationSchema.set('toJSON', {
    virtuals: true
});

budgetallocationSchema.findById = function (cb) {
    return this.model('Budgetallocation').find({id: this.id}, cb);
};

const Budgetallocation = mongoose.model('Budgetallocation', budgetallocationSchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Budgetallocation.findOne(queries)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};
exports.findAllocationByCategory = (category,organization,fyscalYear) => {
   
    var fiscalYear1=new Date().getFullYear();
    //var StartDate=fiscalYear1+"-01-01";
    //var EndDate=fiscalYear1+"-12-31"
    var query=
    [
        
        {
        $match: {
          
          category:category,
          organization:organization
          
        }
      },
      {
        $group: {
          _id: null,
          totalBudget: { $sum: "$allcocatedAmount" }
        }
      },
      {
        $project: {
        totalBudget: 1,
          _id: 0
        }
      }
    ];


    //console.log(query)
    return new Promise((resolve, reject) => {
        Budgetallocation.aggregate(query)
        .exec( function (err,sum){
           if (err) {
              // console.log(err);
             //  console.log("RIPA-------");
               reject(err);
               
           }else{
            //console.log(query)
           // console.log("RIPA-------");
              // console.log(sum);
              if(sum.length>0){
              const [{totalBudget}]=sum;
              if(totalBudget){
                resolve(totalBudget);
              }else{
                resolve(0);
              }
            }else{
                resolve(0);
            }
               
           }
               
       });  
     });
};

exports.findAllocationByCategory1 = (category,userId) => {
   
    var fiscalYear1=new Date().getFullYear();
    var StartDate=fiscalYear1+"-01-01";
    var EndDate=fiscalYear1+"-12-31"
    var query=
    [
       
        {
        $match: {
          category:category,
          userId:userId,
         // year:fiscalYear1
        }
      },
      {
        $group: {
          _id: null,
          totalBudget: { $sum: "$allcocatedAmount" }
        }
      },
      {
        $project: {
        totalBudget: 1,
          _id: 0
        }
      }
    ];


   // console.log(query)
    return new Promise((resolve, reject) => {
        Budgetallocation.aggregate(query)
        .exec( function (err,sum){
           if (err) {
               console.log(err);
               console.log("RIPA-------");
               reject(err);
               
           }else{
            //console.log(query)
           // console.log("RIPA-------");
               console.log(sum);
              if(sum.length>0){
              const [{totalBudget}]=sum;
              if(totalBudget){
                resolve(totalBudget);
              }else{
                resolve(0);
              }
            }else{
                resolve(0);
            }
               
           }
               
       });  
     });
};
exports.createBudgetallocation = (budgetallocationData) => {
    return new Promise(async(resolve, reject) => {
        const userData=  await  UsersModel.findByEmail3(budgetallocationData.userId);
        
        const category=  await  AccountcategoryModel.findByCategory(budgetallocationData.category);
      
        if(category){
            
            budgetallocationData.accountType= category.accountType;
         
        }else{
            //if(!userData){
            return reject("Please select the category for list");
           // }
        }
        if(userData){
            budgetallocationData.user= userData.firstName+" "+userData.lastName;
        }else{
            budgetallocationData.user= "";
        }
    const budgetallocation = new Budgetallocation(budgetallocationData);
    budgetallocation.save(function (err, saved) {
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
    if(query.user){
        if(query.hasOwnProperty('user_mode')){
            const mode = query.user_mode;
            if(mode=="startsWith"){
                _query['userId'] = new RegExp('^'+query.user,'i');
            }else if(mode=="equals"){
                _query['userId'] = query.user;
            }else if(mode=="notEquals"){
                _query['userId'] = { $ne: query.user } ;
            }else if(mode=="endsWith"){
                _query['userId'] = new RegExp(query.user+'$','i');
            }else if(mode=="notContains"){
                _query['userId'] = {$not: new RegExp(query.user,'i')} ;
            }else if(mode=="contains" || mode=="in"){
                _query['userId'] = new RegExp(query.user,'i');
            }
        }else{
        _query['userId'] = new RegExp(query.userId,'i');
        }

    }


    if(query.organization){
       // console.log("AAA111A")
        if(query.hasOwnProperty('organization_mode')){
            //console.log("AAA111A")
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
            }else if(mode=="contains" || mode=="in"){
                console.log("AAAA")
                _query['organization'] = new RegExp(query.organization,'i');
            }
        }else{
        _query['organization'] = new RegExp(query.organization,'i');
        }

    }


    if(query.organizationId){
       
        _query['organizationId'] = query.organizationId;
        

    }


        if(query.fiscalyear){
            if(query.hasOwnProperty('fiscalyear_mode')){
                const mode = query.fiscalyear_mode;
               if(mode=="dateIs"){
                    _query['fiscalyear'] = query.fiscalyear;
                }else if(mode=="dateIsNot"){
                    _query['fiscalyear'] = { $ne: query.fiscalyear } ;
                }else if(mode=="dateBefore"){
                    _query['fiscalyear'] = { $lt:query.fiscalyear}
                }else if(mode=="dateAfter"){
                    _query['fiscalyear'] = { $gt:query.fiscalyear}
                }
            }else{
                _query['fiscalyear'] = query.fiscalyear;
            }
    
        }
    

    if(query.allcocatedAmount!=null ){
      if(!isNaN(query.allcocatedAmount)){
        if(query.hasOwnProperty('allcocatedAmount_mode')){
            const mode = query.allcocatedAmount_mode;
            if(mode=="equals"){
                _query['allcocatedAmount'] =  query.allcocatedAmount ;
            }else if(mode=="notEquals"){
                _query['allcocatedAmount'] ={ $ne:query.allcocatedAmount} ;
            }else if(mode=="lt"){
                _query['allcocatedAmount'] ={ $lt:query.allcocatedAmount} ;
            }else if(mode=="lte"){
                _query['allcocatedAmount'] ={ $lte:query.allcocatedAmount} ;
            }else if(mode=="gte"){
                _query['allcocatedAmount'] ={ $gte:query.allcocatedAmount} ;
            }else if(mode=="gt"){
                _query['allcocatedAmount'] ={ $gt:query.allcocatedAmount} ;
            }
        }else{
            _query['allcocatedAmount'] =  query.allcocatedAmount ;
        }
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

        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }
        var sortBoj={[sortBy]:sortDirection};
        return new Promise((resolve, reject) => {
            //console.log(_query)
        Budgetallocation.find(_query)
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, budgetallocation) {
                if (err) {
                    reject(err);
                } else {
                    Budgetallocation.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: budgetallocation , count: total ,perpage:perPage,page:page };
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
    console.log(_query)
    return new Promise((resolve, reject) => {
    Budgetallocation.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, budgetallocation) {
                if (err) {
                    reject(err);
                } else {
                resolve(budgetallocation);
                }
            })
    });
};
exports.listSuggestions = (query ) => {
    const { search, ...queryWithoutSearch } = query
    var _query=queryWithoutSearch
    if(search){
        _query['$or'] =[ 
            {"organization": {$regex: search, $options: "i"}},
				{"category": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Budgetallocation.find(_query)
            .exec(function (err, budgetallocation) {
                if (err) {
                    reject(err);
                } else {
                    resolve(budgetallocation);
                }
            })
    });
};
exports.patchBudgetallocation = (id, budgetallocationData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise(async(resolve, reject) => {
        
        const category=  await  AccountcategoryModel.findByCategory(budgetallocationData.category);
      
        if(category){
            
            budgetallocationData.accountType= category.accountType;
         
        }else{
            return reject("Please select the category for list");
        }
        const userData=  await  UsersModel.findById(budgetallocationData.userId);
        
        if(userData){
            budgetallocationData.user= userData.firstName+" "+userData.lastName;
        }else{
            budgetallocationData.user= "";
        }
        Budgetallocation.findOne(queries, function (err, budgetallocation) {
            if (err) reject(err);
            for (let i in budgetallocationData) {
                budgetallocation[i] = budgetallocationData[i];
            }
            budgetallocation.save(function (err, updatedBudgetallocation) {
                if (err) return reject(err);
                resolve(updatedBudgetallocation);
            });
        });
    })

};

exports.removeById = (budgetallocationId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:budgetallocationId}
    return new Promise((resolve, reject) => {
        Budgetallocation.findOneAndDelete(queries, (err) => {
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
    

exports.chartDataByCategory = (query={},groupBy="$category") => {
    let match={};
    if(query.organization){
        match['organization'] = query.organization;
    
    }
    if(query.startDate && query.endDate){
        match['createAt'] = {
            $gte: new Date(query.startDate) ,
            $lte: new Date(query.endDate) 
        }
    
    }
    
    var query=
    [
        {
        $match: match
      },
      {
        $group: {
            _id: groupBy,
          totalBudget: { $sum: "$allcocatedAmount" }
        }
      },
      {
        $project: {
            category: "$_id",
            totalBudget: 1,
          _id: 0
        }
      }
    ];
    return new Promise((resolve, reject) => {
        Budgetallocation.aggregate(query)
        .exec( function (err,sum){
           if (err) {
            
               reject(err);
               
           }else{
            if(sum.length>0){
           
              resolve(sum);
            
        }else{
            resolve([]);
          }
           }
               
       });  
     });
    };

   