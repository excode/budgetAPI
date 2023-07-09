const mongoose = require('../../common/services/mongoose.service').mongoose;
const AccountcategoryModel = require('../accountcategory/accountcategory.model');
const AllocationModel = require('../budgetallocation/budgetallocation.model');
const Schema = mongoose.Schema;
    
const accountbookSchema = new Schema({
    	createBy : { type: String,required:true,default:''},
        createAt : { type: Date,required:true},
        updateBy : { type: String},
        updateAt : { type: Date},
        parentCategory : { type: String},
        accountType : { type: String},
        organization : { type: String},
        particular : { type: String,required:true,default:'',maxLength:50},
        receiptNo : { type: String,required:true,default:'',maxLength:40},
        amount : { type: Number,required:true,default:0},
        category : { type: String,required:true,default:''},
        memo : { type: String},
        organizationId : { type: String}
});

accountbookSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
accountbookSchema.set('toJSON', {
    virtuals: true
});

accountbookSchema.findById = function (cb) {
    return this.model('AccountBook').find({id: this.id}, cb);
};

const AccountBook = mongoose.model('AccountBook', accountbookSchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return AccountBook.findOne(queries)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createAccountBook = (accountbookData) => {
    return new Promise(async(resolve, reject) => {
    const category=  await  AccountcategoryModel.findByCategory(accountbookData.category);
    let amount = parseFloat(accountbookData.amount)
    //if(amount<0){
        //reject("Expenditure amount can't be negative");
   // }
    if(category){
        const totalBudget = await  AllocationModel.findAllocationByCategory(category.parentCategory,accountbookData.organizationId,"")

        const totalExpand = await  this.findExpenditureByCategory(category.category,accountbookData.organizationId,"")
        accountbookData.parentCategory= category.parentCategory;
        accountbookData.accountType= category.accountType;
     
      let futureTotalExpenditure =totalExpand+ parseFloat(accountbookData.amount)
     
      if(futureTotalExpenditure> totalBudget){
        reject("Expenditure will exceed Budget allocation");
        return;
      }
    }
    const accountbook = new AccountBook(accountbookData);
    accountbook.save(function (err, saved) {
        if (err) {
            return reject(err);
        }
        resolve(saved)
    });
    });
};
exports.findExpenditureByCategory = (category,organization,fyscalYear) => {
var query1=`
{
    $match: {
      
      category:'${category}',
      organizationId:'${organization}',
      createAt: {
        $gte: ISODate("2023-01-01"), // Start date of the range
        $lte: ISODate("2023-12-31") // End date of the range
      }
    }
  },
  {
    $group: {
      _id: "$category",
      totalExpend: { $sum: "$amount" }
    }
  },
  {
    $project: {
      category: "$_id",
      totalExpend: 1,
      _id: 0
    }
  }
`
var query=
[
{
    $match: {
      
      category:category,
      organizationId:organization,
      createAt: {
        $gte: new Date("2023-01-01"), // Start date of the range
        $lte: new Date("2023-12-31") // End date of the range
      }
    }
  },
  {
    $group: {
      _id: null,
      totalExpend: { $sum: "$amount" }
    }
  },
  {
    $project: {
        totalExpend: 1,
      _id: 0
    }
  }
];
return new Promise((resolve, reject) => {
    AccountBook.aggregate(query)
    .exec( function (err,sum){
       if (err) {
           //console.log(err);
           //console.log("RIPA-------");
           reject(err);
           
       }else{
        if(sum.length>0){
        const [{totalExpend}]=sum;
        if(totalExpend){
          resolve(totalExpend);
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
    if(query.organizationId){
       
        _query['organizationId'] = query.organizationId;
        

    }


    if(query.particular){
        if(query.hasOwnProperty('particular_mode')){
            const mode = query.particular_mode;
            if(mode=="startsWith"){
                _query['particular'] = new RegExp('^'+query.particular,'i');
            }else if(mode=="equals"){
                _query['particular'] = query.particular;
            }else if(mode=="notEquals"){
                _query['particular'] = { $ne: query.particular } ;
            }else if(mode=="endsWith"){
                _query['particular'] = new RegExp(query.particular+'$','i');
            }else if(mode=="notContains"){
                _query['particular'] = {$not: new RegExp(query.particular,'i')} ;
            }else if(mode=="contains"){
                _query['particular'] = new RegExp(query.particular,'i');
            }
        }else{
        _query['particular'] = new RegExp(query.particular,'i');
        }

    }


    if(query.receiptNo){
        if(query.hasOwnProperty('receiptNo_mode')){
            const mode = query.receiptNo_mode;
            if(mode=="startsWith"){
                _query['receiptNo'] = new RegExp('^'+query.receiptNo,'i');
            }else if(mode=="equals"){
                _query['receiptNo'] = query.receiptNo;
            }else if(mode=="notEquals"){
                _query['receiptNo'] = { $ne: query.receiptNo } ;
            }else if(mode=="endsWith"){
                _query['receiptNo'] = new RegExp(query.receiptNo+'$','i');
            }else if(mode=="notContains"){
                _query['receiptNo'] = {$not: new RegExp(query.receiptNo,'i')} ;
            }else if(mode=="contains"){
                _query['receiptNo'] = new RegExp(query.receiptNo,'i');
            }
        }else{
        _query['receiptNo'] = new RegExp(query.receiptNo,'i');
        }

    }


    if(query.amount!=null ){
      if(!isNaN(query.amount)){
        if(query.hasOwnProperty('amount_mode')){
            const mode = query.amount_mode;
            if(mode=="equals"){
                _query['amount'] =  query.amount ;
            }else if(mode=="notEquals"){
                _query['amount'] ={ $ne:query.amount} ;
            }else if(mode=="lt"){
                _query['amount'] ={ $lt:query.amount} ;
            }else if(mode=="lte"){
                _query['amount'] ={ $lte:query.amount} ;
            }else if(mode=="gte"){
                _query['amount'] ={ $gte:query.amount} ;
            }else if(mode=="gt"){
                _query['amount'] ={ $gt:query.amount} ;
            }
        }else{
            _query['amount'] =  query.amount ;
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
        AccountBook.find(_query)
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, accountbook) {
                if (err) {
                    reject(err);
                } else {
                    AccountBook.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: accountbook , count: total ,perpage:perPage,page:page };
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
   // console.log("_query")
   // console.log(_query)
    return new Promise((resolve, reject) => {
    AccountBook.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, accountbook) {
                if (err) {
                    reject(err);
                } else {
                resolve(accountbook);
                }
            })
    });
};
exports.listSuggestions = (query ) => {
    const { search, ...queryWithoutSearch } = query
    var _query=queryWithoutSearch
    if(search){
        _query['$or'] =[ 
            {"particular": {$regex: search, $options: "i"}},
				{"receiptNo": {$regex: search, $options: "i"}},
				{"category": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        AccountBook.find(_query)
            .exec(function (err, accountbook) {
                if (err) {
                    reject(err);
                } else {
                    resolve(accountbook);
                }
            })
    });
};
exports.patchAccountBook = (id, accountbookData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise(async(resolve, reject) => {
        const category=  await  AccountcategoryModel.findByCategory(accountbookData.category);
      
        if(category){
            
            accountbookData.accountType= category.accountType;
         
        }else{
            return reject("Please select the category for list");
        }
        AccountBook.findOne(queries, function (err, accountbook) {
            if (err) reject(err);
            for (let i in accountbookData) {
                accountbook[i] = accountbookData[i];
            }
            accountbook.save(function (err, updatedAccountBook) {
                if (err) return reject(err);
                resolve(updatedAccountBook);
            });
        });
    })

};

exports.removeById = (accountbookId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:accountbookId}
    return new Promise((resolve, reject) => {
        AccountBook.findOneAndDelete(queries, (err) => {
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
exports.chartDataAll=(query={})=>{
    return new Promise(async(resolve, reject) => {
        try{
        let monthYear ={ year: { $year: "$createAt" }, month: { $month: "$createAt" } };

        let bookByCategory = await this.chartDataByCategory(query);
        let bookByType = await this.chartDataByCategory(query,"$accountType")
        let bookByMonthYear = await this.chartDataByCategory(query,monthYear)
        
        let budgetByCategory = await AllocationModel.chartDataByCategory(query);
        let budgetByType = await AllocationModel.chartDataByCategory(query,"$accountType")
        let budgetByMonthYear = await AllocationModel.chartDataByCategory(query,monthYear);
            
       console.log(budgetByCategory)
        let categorydata=[]
        budgetByCategory.forEach(element => {
            let data ={category:element.category,budget:element.totalBudget,expense:0,percentage:0}
                let expanseData =bookByCategory.find(b=>b.category==element.category);
                if(expanseData){
                    data["expense"] = expanseData.totalExpend;
                    //var percentage = (number1 / number2) * 100;
                    data["percentage"] = (parseFloat(expanseData.totalExpend) / parseFloat(element.totalBudget)) * 100;
                }
                categorydata.push(data) ;

        });
        let accountTypedata=[]
        budgetByType.forEach(element => {
            let data ={category:element.category,budget:element.totalBudget,expense:0,percentage:0}
                let expanseData =bookByType.find(b=>b.category==element.category);
                if(expanseData){
                    data["expense"] = expanseData.totalExpend;
                    data["percentage"] = (parseFloat(expanseData.totalExpend) / parseFloat(element.totalBudget)) * 100;
                }
                accountTypedata.push(data) ;

        });
      
        let linedata=[]
        var currentDate = new Date();
        

        for (var i = 0; i < 12; i++) {
            // Get the year and month for the current iteration
            var year = currentDate.getFullYear();
            var month = currentDate.getMonth();
            
            
            let data ={year:year,month:month+1,budget:0,expense:0}
            let budget = budgetByMonthYear.find(b=>b.category.year==year && b.category.month==month+1)
            if(budget){
                data['budget'] = budget.totalBudget;
            }
            let expense = bookByMonthYear.find(b=>b.category.year==year && b.category.month==month+1)
            if(expense){
                data['expense'] = expense.totalExpend;
            }
            linedata.push(data);
            // Subtract one month from the current date
            currentDate.setMonth(month - 1);


          }

          //console.log(linedata)
        
          resolve({linedata:linedata,category:categorydata,accountType:accountTypedata})
        }catch(err){

            return reject(err)
        }



    });
}
exports.chartDataByCategory = (query={},groupBy="$parentCategory") => {
let match={};
if(query.organizationId){
    match['organizationId'] = query.organizationId;

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
      totalExpend: { $sum: "$amount" }
    }
  },
  {
    $project: {
        category: "$_id",
        totalExpend: 1,
      _id: 0
    }
  }
];
return new Promise((resolve, reject) => {
    AccountBook.aggregate(query)
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
