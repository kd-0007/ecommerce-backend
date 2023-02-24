class ApiFeatures{

    constructor(query, queryStr){
        this.query =query;
        this.queryStr = queryStr;
    }
    search(){
        const keyword = this.queryStr.keyword
        ?
        {
            name:{
                $regex:this.queryStr.keyword,
                $options:'i',
            }
                                            
              }:{}
        this.query = this.query.find({...keyword});
        return this;      
    }

    filter(){
        //for range and category
        const queryCopy = {...this.queryStr};
        const removeFields = ["keyword", "page" ,"limit"];
        removeFields.forEach(key => delete queryCopy[key]);
       //to convert in string
        let queryStr = JSON.stringify(queryCopy);
       //replacing gt to $gt
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key=>`$${key}`)
        //converting back to object
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.currentPage)|| 1;
        const skip = resultPerPage *(currentPage-1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;