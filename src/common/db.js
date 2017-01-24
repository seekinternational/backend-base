'use strict';
class DB {
  constructor(db) {
    this.db = db;
  }
  insert(key, msg, table, callback) {
    const timestamp = new Date().getTime();
    const params = {
        TableName: table,
        Item: {
          id: key,
          text: msg,
          checked: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      };
    this.db.putItem(params, callback);
  }

  update(key, kvp, table, callback) {

	  const timestamp = new Date().getTime();
	  let params = {AttributeUpdates: {}};
	  params.TableName = table;
	  params.Key = { id : { S: key} };

	  for(var k in kvp) {

		let value = kvp[k];
		let Value = {} , type = '';
		if(Array.isArray(value)) {
			type = "S";
			let typeCheck = value.pop(0);
			value.push(typeCheck);
			console.log("typecheck : " + (typeof typeCheck));
			if(typeof typeCheck === "number") {
				type = "N" + type;
			} else if(typeof typeCheck === "string") {
				type = "S" + type;
			}

		} else if(typeof value === "number") {
			type = "N" + type;
		} else if(typeof value === "string") {
			type = "S" + type;
		} else if(typeof value === "boolean") {
			type = "BOOL";
		} else if(typeof value === "object") {
			type = "M"
		}

		Value[type] = value;

		params.AttributeUpdates[k] = { Value, Action: "PUT" }
	  }
	  params.ReturnValues = "NONE";
	  console.log(JSON.stringify(params));
	  this.db.updateItem(params, callback);
  }


  selectByFieldExists(field, table, callback) {

	let params = {
      "FilterExpression": `attribute_exists(${field})`,
      "TableName": table
    };
    db.scan(params, callback);
  }
}
module.exports = DB;
