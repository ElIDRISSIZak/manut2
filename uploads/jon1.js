//=======================================================================================//
//                                      insert                                           //
//=======================================================================================//  
 
 
 // Insert JSON format is database from SFA Attribute
    router.get('/insertion4', (req, res) => {
        var collection;
    connection((db) => {
        collection = db.collection('attribute');
         //console.log(collection);
    });
    //console.log(collection);
   
    var fs = require('fs');
    fs.readFile('uploads/step-XML-V0.1 - 1 SFA.xml', (err, data) => {
        if (err) throw err;
        // var json = JSON.parse(data);
        var parser = new xml2js.Parser({ attrkey: 'attribut' });
        parser.parseString(data, function (err, result) {
            // res.json(result);
            console.log("=>",result, "<="); 
            var last1 = 0;
            var attribute = result['STEP-ProductInformation']['AttributeList'];
            console.log(result);
            // suppression des données dans la collection productsmanutan
            connection((db) => {
               db.collection('attribute').deleteMany({}); 
            });
            //insertion des product avec item product par product
            attribute.forEach((obj) => {
                
                connection((db) => {
                    db.collection('attribute').insert(obj['Attribute'], {safe: true});
                });
            });                    
        if(err) throw err;           
        });
            res.json("file inserted ");
      });
    });
	
    
    
	// Insert JSON format is database from SFA Unit
    router.get('/insertion5', (req, res) => {
        var collection;
    connection((db) => {
        collection = db.collection('unit');
         //console.log(collection);
    });
    //console.log(collection);
   
    var fs = require('fs');
    fs.readFile('uploads/step-XML-V0.1 - 1 SFA.xml', (err, data) => {
        if (err) throw err;
        // var json = JSON.parse(data);
        var parser = new xml2js.Parser({ attrkey: 'attribut' });
        parser.parseString(data, function (err, result) {
            // res.json(result);
            console.log("=>",result, "<="); 
            var last1 = 0;
            var unit = result['STEP-ProductInformation']['UnitList'];
            console.log(result);
            // suppression des données dans la collection productsmanutan
            connection((db) => {
               db.collection('unit').deleteMany({}); 
            });
            //insertion des product avec item product par product
            unit.forEach((obj1) => {
                
                connection((db) => {
                    db.collection('unit').insert(obj1['Unit'], {safe: true});
                });
            });                    
        if(err) throw err;           
        });
            res.json("file inserted ");
      });
    });
    
    /* /!\ attention suivre les instructions en dessous de code  */
    
    // csv to json 
    router.get('/csv', (req, res) => {
    
    var collection;
    connection((db) => {
        collection = db.collection('filiale1');
         //console.log(collection);
    });
 
    var json = csvToJson.getJsonFromCsv("uploads/filiale1.csv");
    for(var i=0; i<json.length;i++){
        console.log(json[i]);
    }

   //console.log(json);
   var fs = require('fs');
        var fileInputName = 'uploads/filiale1.csv'; 
        var fileOutputName = 'uploads/fil.json';
         
        csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);
      fs.readFile(fileOutputName, 'utf8', function (erreur, donnees) {
         if (erreur)
            throw erreur; // Vous pouvez gérer les erreurs avant de parser le JSON
         var filiales1 = JSON.parse(donnees);
         
            connection((db) => {
               db.collection('filiale1').deleteMany({}); 
            });
         
         filiales1.forEach((objf1) => {
            
                connection((db) => {
                    db.collection('filiale1').insert(objf1, {safe: true});
                });
         });    
      }); 
  });
  
  /*  /!\  */
  /* const csvToJson = require("convert-csv-to-json"); */ 
  /* faire un npm install convert-csv-to-json --save  */    
    
//=======================================================================================//
//                                      Request                                          //
//=======================================================================================//  
    
    
// request ID + url unit
router.get('/unit/:names', (req, res, next) => {
    db.collection("unit").findOne({"Name": req.params.names}, function(err, result) {
      if (err) throw err;
      console.log(result);
      //db.close();
      res.json(result);
    });    
  });
  
// request ID + url attribute
router.get('/attribute/:att', (req, res) => {
  db.collection("attribute").findOne({"Name" : req.params.att}, function(err, result) {
    if (err) throw err;
    console.log(result);
    //db.close();
    res.json(result);
  });
});

// request ID + url filiale1
router.get('/objfiliale1/:objfil', (req, res) => {
  db.collection("objfiliale1").findOne({"Classificationlevel1NAME" : req.params.objfil}, function(err, result) {
    if (err) throw err;
    console.log(result);
    //db.close();
    res.json(result);
  });
});
    

/*// request ID + url filiale1
router.get('/objfiliale1/:objfil', (req, res) => {
  db.collection("objfiliale1").findOne({"Classificationlevel2NAME" : req.params.objfil}, function(err, result) {
    if (err) throw err;
    console.log(result);
    //db.close();
    res.json(result);
  });
});*/