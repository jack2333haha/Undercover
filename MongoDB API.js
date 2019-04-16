var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://123.206.45.12:27017/undercover";

/**
 * 创建一个集合
 * @param collectionName
 */
function createCollection(collectionName){
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        console.log("数据库连接成功!");
        var dbase = db.db("undercover");
        dbase.createCollection(collectionName, function (err, res) {
            if (err) throw err;
            console.log("创建集合!");
            db.close();
        });
    });
}

/**
 * 插入一条数据对象
 * @param data
 */
function insterOne(data){
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        console.log("数据库连接成功!");
        var dbo = db.db("undercover");
        var myobj = { name: "菜鸟教程", url: "www.runoob" };
        dbo.collection("words").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("插入一条数据对象成功");
            db.close();
        });
    });
}

/**
 * 插入多条数据对象
 * @param dataObj
 */
function insterMulty(dataObj) {

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("undercover");
        // var myobj =  [
        //     { name: '菜鸟工具', url: 'https://c.runoob.com', type: 'cn'},
        //     { name: 'Google', url: 'https://www.google.com', type: 'en'},
        //     { name: 'Facebook', url: 'https://www.google.com', type: 'en'}
        // ];
        dbo.collection("word").insertMany(dataObj, function(err, res) {
            if (err) throw err;
            console.log("插入的数据对象数量为: " + res.insertedCount);
            db.close();
        });
    });



}
