//mongoDB CURD操作参考

var MongoClient = require("mongodb").MongoClient;
var DB_URL = "mongodb://localhost:27017/chm";


//插入数据
function insertData(db)
{
    var devices = db.collection('vip');
    var data = {"name":"node","age":22,"addr":"nb","addTime":new Date()};
    devices.insert(data,function(error, result){
        if(error)
        {
            console.log('Error:'+ error);
        }else{

            console.log(result.result.n);
        }
        db.close();
    });
}

MongoClient.connect(DB_URL, function(error, db){
    console.log('连接成功!');
    insertData(db);
});



//查找数据
var selectData = function(db, callback) {
    //连接到表
    var collection = db.collection('vip');
    //查询数据
    var whereStr = {"name":'node'};
    collection.find(whereStr,function(error, cursor){
        cursor.each(function(error,doc){
            if(doc){
                //console.log(doc);
                if (doc.addTime) {
                    console.log("addTime: "+doc.addTime);
                }
            }
        });

    });

}

MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    selectData(db, function(result) {
        console.log(result);
        db.close();
    });
});



//更新数据
MongoClient.connect(DB_URL, function(error, db){
    console.log("连接成功!");
    updateData(db);
});

function updateData(db)
{
    var devices = db.collection('vip');
    var whereData = {"name":"node"}
    var updateDat = {$set: {"age":26}}; //如果不用$set，替换整条数据
    devices.update(whereData, updateDat, function(error, result){
        if (error) {
            console.log('Error:'+ error);
        }else{
            console.log(result);
        }
        db.close();
    });
}



//删除数据
MongoClient.connect(DB_URL, function(error, db){
    console.log("连接成功");
    deleteData(db);
});

function deleteData(db)
{
    var devices = db.collection('vip');
    var data = {"name":"node"};
    devices.remove(data, function(error, result){
        if (error) {
            console.log('Error:'+ error);
        }else{
            console.log(result.result.n);
        }
        db.close();
    })
}



//存储过程
MongoClient.connect(DB_URL, function(error,db){
    console.log("连接成功!");
    callProcess(db)
});

function callProcess(db)
{
    db.eval("get_vip_count()",function(error, result){
        if (error) {
            console.log(error);
        }else{
            console.log("count:"+result);
        }
        db.close();
    });
}

