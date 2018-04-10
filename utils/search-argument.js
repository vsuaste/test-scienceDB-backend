/*
  Class to parse search argument for any model
*/

module.exports = class searchArg{

  constructor({field, value, operator, searchArg}){
    this.field = field;
    this.value = this.constructor.parseValue(value);
    this.operator = operator;
    this.searchArg = searchArg
  }

  static parseValue(val){
    if(val!==undefined)
    {
      if(val.type === "Array")
      {
        return val.value.split(",");
      }else{
        return val.value;
      }
    }
  }

  toSequelize(){
    let searchArgsInSequelize = {};

    if(this.searchArg === undefined && this.field === undefined)
    {
      searchArgsInSequelize['$'+this.operator] = this.value;

    }else if(this.searchArg === undefined)
    {
      searchArgsInSequelize[this.field] = {
         ['$'+this.operator] : this.value
      };
    }else if(this.field === undefined){
      searchArgsInSequelize['$'+this.operator] = this.searchArg.map(sa => {
        let new_sa = new searchArg(sa);
        return new_sa.toSequelize();
      });
    }else{
       searchArgsInSequelize[this.field] = {
         ['$'+this.operator] : this.searchArg.map(sa => {
           let new_sa = new searchArg(sa);
           return new_sa.toSequelize();
         })
       }
    }

    return searchArgsInSequelize;
  }
};
