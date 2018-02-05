const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');

const parseString = require('xml2js').parseString;
const http = require('http');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/mean', ['users']);
const xml2js = require('xml2js');
var cors = require('cors');
var multer = require('multer');
// converting xsls file to Json
const xlsxj = require("xlsx-to-json");
// require csvtojson
var csvToJson = require('convert-csv-to-json');
var Promise = require("bluebird");

// Connect
const connection = (closure) => {
    return MongoClient.connect("mongodb://localhost:27017/mean", (err, db) => {
        if (err) return //console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Get Tasks 
router.get('/tasks', (req, res) => {
    connection((db) => {
        db.collection('tasks')
            .find()
            .toArray()
            .then((tasks) => {
                response.data = tasks;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// find Task  by desc (modelisation)
router.get('/task', (req, res) => {
    connection((db) => {
        
        db.collection('tasks').find( { "desc": "modelisation" } )
        .each(function(err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                console.dir(doc);
                 res.json(doc);
            }
            if(err)
            // } else {
                res.json("doc");
            // }
        });
    });

});

// find Task  by id
router.get('/task/:id', (req, res, next) => {
    connection((db) => {
        
        var cursor =db.collection('tasks').findOne( {_id : mongojs.ObjectID(req.params.id)}, function(err, task)  {
            if(err){
                res.send(err);
            }
            res.json(task);

        });
        

    });
});

//Auth test
router.post('/authen', cors(), (req, res, next) => {
    var user = req.body;
    if(!user){
        res.status(400);
        res.json({
            "error":"bad DATA"
        });
    }else{

        connection((db) => {
            db.collection('users').findOne(user, function (err, user) {
		if(err){
                res.send("error1");
            }
        if(user){
            res.json(user);
            //console.log("user", user);
        }
        else{
            //console.log("user", "null");
            res.json(null);            
        }
        /*else{
            res.status(400);
            res.json({
                "error":"bad DATA"
            });
        } */  
    
        });
        
    });
    }
        
});

//save Task
router.post('/task', (req, res, next) => {
    var task = req.body;
    if(!task.title || !task.desc){
        res.status(400);
        res.json({
            "error":"bad DATA"
        });
    }else{

        connection((db) => {
            
            var cursor =db.collection('tasks').save(task, function(err, task){
                if(err){
                    res.send(err);
                }
                
              
            });
            
    
        });
        res.json(task);
    }
    
        
});

// Delete Task  by id
router.delete('/task/:id', (req, res, next) => {
    connection((db) => {
        
        db.collection('tasks').remove( {_id : mongojs.ObjectID(req.params.id)}, function(err, task)  {
            if(err){
                res.send(err);
            }
            res.json(task);

        });
        

    });
});


// Get classifications from Database and display JSON format
router.get('/classificationGMC', (req, res) => {
    /*var fs = require('fs');
    fs.readFile('step-xml.xml', (err, data) => {
        if (err) throw err;
        var parser = new xml2js.Parser({ignoreAttrs: true});
        parser.parseString(data, function (err, result) {
        // parseString(data, function (err, result) {
            res.json(result);
            
          });
      });*/
      connection((db) => {
        db.collection('classifications')
            .find()
            .toArray()
            .then((classifications) => {
                response.data = classifications;
                res.json(response.data);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });

    });
    
    // Get ALL Classifications xml file and display JSON format
router.get('/test', (req, res) => {
    var fs = require('fs');
    fs.readFile('step-XML-V0.1.xml', (err, data) => {
        if (err) throw err;
        var parser = new xml2js.Parser({ attrkey: '@' });
    //    parser.parseString(data, function (err, result) {
         parseString(data, function (err, result) {
            res.json(result);
            
          });
      });

    });
// Get xml file and display JSON format
router.get('/test3', (req, res) => {
    var fs = require('fs');
    fs.readFile('step-xml.xml', (err, data) => {
        if (err) throw err;
        var parser = new xml2js.Parser({ attrkey: '@' });
    //    parser.parseString(data, function (err, result) {
         parseString(data, function (err, result) {
            res.json(result);
            
          });
      });

    });
 /*     // Get xml file and display JSON format 
      // Insert JSON format in DataBase
router.get('/insertion', (req, res) => {
    var fs = require('fs');
    fs.readFile('uploads/manutanGMC.xml', (err, data) => {
        if (err) throw err;
        // var json = JSON.parse(data);

	// suppression des données dans la collection Classifications
            connection((db) => {
               db.collection('classifications').deleteMany({}); 
            });

        var parser = new xml2js.Parser({ attrkey: 'attribut' });
        parser.parseString(data, function (err, result) {
            // res.json(result);
            //console.log("=>",result, "<=");

		

            var value = result['STEP-ProductInformation']['Classifications'];
            //console.log(value);
        connection((db) => {
        db.collection('classifications').insert(value,{safe:true}, function(err, doc) {
            //console.log(doc);
        if(err) throw err;
            res.json("file inserted ");
        });
            
          });
        });
      });
    });*/
    // Get xml file and display JSON format 
      // Insert JSON format in DataBase
function getFileExtension5(filename) {
	return filename.slice((filename.lastIndexOf(".xml") - 1 >>> 0) + 2);
}	  
	  
router.post('/insertion', cors(), (req, res, next) => {

    var model = req.body;	
	var filename = model.filename;
 	

 if( getFileExtension5(filename) == 'xml' && filename.startsWith("manutanGMC")) {	
	 
	var fs = require('fs');
	fs.readFile('uploads/' + filename, (err, data) => {
	    if (err) throw err;
	    // var json = JSON.parse(data);
	
		// suppression des données dans la collection Classifications
	        connection((db) => {
	           db.collection('classifications').deleteMany({}); 
	        });
	
	    var parser = new xml2js.Parser({ attrkey: 'attribut' });
	    parser.parseString(data, function (err, result) {
	        // res.json(result);
	        //console.log("=>",result, "<=");
	
	        var value = result['STEP-ProductInformation']['Classifications'];
	        //console.log(value);
		    connection((db) => {
			    db.collection('classifications').insert(value,{safe:true}, function(err, doc) {
			        //console.log(doc);
				    if(err) throw err;
				        res.json("file inserted ");
				    });	        
			    });			
		    });
	  	});
	};
});



//insertion after upload
router.post('/insertion2', (req, res, next) => {
    var file = req.body;
    if(!file){
        res.status(400);
        res.json({
            "error":"bad DATA"
        });
    }
	var fs = require('fs');
    	fs.readFile('step-XML-V0.1.xml', (err, data) => {
        if (err) throw err;
        // var json = JSON.parse(data);
        var parser = new xml2js.Parser({ attrkey: 'attribut' });
        parser.parseString(data, function (err, result) {
            // res.json(result);
            //console.log("=>",result, "<=");
            var value = result['STEP-ProductInformation']['Classifications'];
            //console.log(value);
        connection((db) => {
        db.collection('classifications').insert(value,{safe:true}, function(err, doc) {
            //console.log(doc);
        if(err) throw err;
            res.json("file inserted ");
        });
            
          });
        });
      });
        
});

// Get xml file and display JSON format
const fs = require('fs');

function readJSONFile(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if(err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch(exception) {
      callback(exception);
    }
  });
}


router.get('/xslstest', (req, res) => {
    xlsxj({
    	input: "uploads/filiale1.xlsx", 
    	output: "uploads/outputt.json"
    }, function(err, result) {
    	if(err) {
      		console.error(err);
    	}else {

		var root = [];
		var id1 = 0;
		var id2 = 0;
		var id3 = 0;
		var id4 = 0;
		var id5 = 0;
		var classification1 = {};
		var classification2 = {};
		var classification3 = {};
		var idmd9 = 0;
		result.forEach(function(item){
      			////console.log("1");
			
			if(item["Classification level 1 ID"] != id1){
				/*if(id1 != 0){
					root.push(classification1);	
				}*/
				classification1= {};
				classification2= {};
				classification2.models = [];
				classification3= {};
				classification4= {};
				classification1.id = item["Classification level 1 ID"];
				classification1.name = item["Classification level 1 NAME"];
				id1 = classification1.id;
				//classification1.push(id1);	
				//classification1.push(name);
				classification1.classification = [];
				if(item["Classification level 2 ID"] != id2){
					////console.log("** id2 CHANGE**");
					classification2.id = item["Classification level 2 ID"];
					classification2.name = item["Classification level 2 NAME"];
					id2 = item["Classification level 2 ID"];
					classification2.classification = [];
					classification2.models = [];

				     
					/*if(item["Classification level 3 ID"] != id3){
						//console.log("ID3 ", item["Classification level 3 ID"]);
						classification3.id = item["Classification level 3 ID"];
						classification3.name = item["Classification level 3 NAME"];
						id3 = classification3.id;
						//console.log("** ===> id3 inserted ==**", id3);
						classification2.classification.push(classification3);
					}*/

					//classification2.push(id2);
					//classification2.push(item["Classification level 2 NAME"]);
												
					classification1.classification.push(classification2);
					
					root.push(classification1);
					classification2= {};
					//classification1= {};
					//root.push(classification1);
				}//else
					//console.log("** ===> id1 id2 ==**");
					/*if(item["Classification level 3 ID"] != id3){
						//console.log("** id2 changed ", item["Classification level 3 ID"]);
						classification3.id = item["Classification level 3 ID"];
						classification3.name = item["Classification level 3 NAME"];
						id3 = classification3.id;
						
						classification2.classification.push(classification3);
					}*/
					//root.push(classification1);
					//classification1= {};	
				
			}else{
				if(item["Classification level 2 ID"] != id2){
					classification2.id = item["Classification level 2 ID"];
					classification2.name = item["Classification level 2 NAME"];
					id2 = classification2.id;
					classification2.classification = [];
					classification2.models = [];
					
					/*if(item["Classification level 3 ID"] != id3){
						//console.log("ID3 ", item["Classification level 3 ID"]);
						classification3.id = item["Classification level 3 ID"];
						classification3.name = item["Classification level 3 NAME"];
						id3 = classification3.id;
						
						classification2.classification.push(classification3);
					}*/
					//classification2.push(id2);
					//classification2.push(item["Classification level 2 NAME"]);

					classification1.classification.push(classification2);
					//root.push(classification1);
					classification2= {};
				}
			}  
		});
		//MODELS FOR LEVEL 2
		var idmd10 = 0;
		var idp = 0;
		idattr1 = 0;
		idattr2 = 0;
		idattr3 = 0;
		result.forEach(function(item){
			////console.log("** TEST**");
			
			root.forEach(function(item10){
			var cll = item10.classification;	
			//classification3.models = [];
				model= {};
				model.products = [];
			cll.forEach(function(item11){
			if((item["Classification level 2 ID"] == item11.id)&&(item["Model ID"] != "-") && (idmd10 != item["Model ID"]) && ("-" == 					item["Classification level 3 ID"])){
								//console.log("for cl2 =>  **",idmd2 );
								model.id = item["Model ID"];
								model.name = item["Model NAME"];
								idmd10 = item["Model ID"];
								//classification4.models.push(model);
								item11.models.push(model);
								//console.log("Niv 2=>",item11.id);
				}
			
			var prods = item11.models;
			product= {};
			product.techattrs = [];
					prods.forEach(function(it){
						//console.log("PROD N1 => ", idp );
						if((item["Model ID"] == it.id)&&(item["Product ID"] != "-") 
							&& (idp != item["Product ID"])){
								//console.log("Product  **",idp );
								product.id = item["Product ID"];
								product.name = item["Product NAME"];
								product.shortdesc = item["short description"];
								product.longdesc = item["long description"];
								idp = item["Product ID"];
								//classification4.models.push(model);
								it.products.push(product);
								//console.log("=>",it.id);
							}
							//Technical attribut ID
					var techattrs = it.products;
					techattr = {};
					
					techattrs.forEach(function(tech){
						//console.log("ATTR N1 => ", idattr1 );
						if((item["Product ID"] == tech.id)&&(item["Technical attribut ID"] != "-") 
							&& (idattr1 != item["Technical attribut ID"])){
								//console.log("ATTRIBUT   **",idattr1 );
								techattr.id = item["Technical attribut ID"];
								techattr.name = item["Technical attribut NAME"];
								techattr.value = item["Technical attribut VALUE"];
								techattr.unit = item["Technical attribut UNIT"];
								idattr1 = item["Technical attribut ID"];
								//classification4.models.push(model);
								tech.techattrs.push(techattr);
								//console.log("ATT saved=>",tech.id);
						}
					});

					//FIN iteration

			});

			});
			});
		});
		var idcsv = 0;
		var idmd = 0;
		var idmd2 = 0;
		var idmd3 = 0;
		var idprod = 0;
		var idprod1 = 0;
		var idprod2 = 0;
		result.forEach(function(item){
			////console.log("** TEST**");
			idcsv++;
			root.forEach(function(item2){
				var iditem2 = 0;
				classification3= {};
				classification3.classification = [];
				classification3.models = [];
				model= {};
				model.products = [];
				var cl = item2.classification;
				cl.forEach(function(item3){
					if((iditem2 ==0 ) && (idcsv == 1)){
						//console.log("** ITEM  **",item3.id);
						iditem2++;
					}
					
					if((item["Classification level 2 ID"] == item3.id) && (id3 != item["Classification level 3 ID"]) && ("-" != 						item["Classification level 3 ID"])){
						//console.log("** INSERT HERE  **",item3.id);
						classification3.id = item["Classification level 3 ID"];
						classification3.name = item["Classification level 3 NAME"];
						id3 = item["Classification level 3 ID"];
						item3.classification.push(classification3);
					}
					/*else if((item["Classification level 2 ID"] == item3.id) &&
						 (id3 != item["Classification level 3 ID"]) &&
					 	("-" == item["Classification level 3 ID"])){
						
						model.id = item["Model ID"];
						model.name = item["Model NAME"];
						id3 = item["Classification level 3 ID"];
						item3.products.push(classification3);
					}*/

//MODELS
					model2= {};
					model2.products = [];
					var md2 = item3.classification;
					
					md2.forEach(function(item8){
						
						if((item["Classification level 3 ID"] == item8.id)&&(item["Model ID"] != "-") && (idmd2 != item["Model ID"])){
								//console.log("M **",idmd2 );
								model2.id = item["Model ID"];
								model2.name = item["Model NAME"];
								idmd2 = item["Model ID"];
								//classification4.models.push(model);
								item8.models.push(model2);
								//console.log("Niv 3=>",item8.id);
							}
					
						var prods2 = item8.models;
						product2= {};
						product2.techattrs = [];
						prods2.forEach(function(item9){
						//console.log("TEST" );
						if((item["Model ID"] == item9.id)&&(item["Product ID"] != "-") 
							&& (idprod2 != item["Product ID"])){
								//console.log("Product  **",idprod2 );
								product2.id = item["Product ID"];
								product2.name = item["Product NAME"];
								product2.shortdesc = item["short description"];
								product2.longdesc = item["long description"];
								idprod2 = item["Product ID"];
								//classification4.models.push(model);
								item9.products.push(product2);
								//console.log("=>",item9.id);
							}
				//Technical attribut ID
					var techattrs = item9.products;
					techattr = {};
					
					techattrs.forEach(function(tech){
						//console.log("ATTR LEV3 => ", idattr2 );
						if((item["Product ID"] == tech.id)&&(item["Technical attribut ID"] != "-") 
							&& (idattr2 != item["Technical attribut ID"])){
								//console.log("ATTRIBUT   **",idattr2 );
								techattr.id = item["Technical attribut ID"];
								techattr.name = item["Technical attribut NAME"];
								techattr.value = item["Technical attribut VALUE"];
								techattr.unit = item["Technical attribut UNIT"];
								idattr2 = item["Technical attribut ID"];
								//classification4.models.push(model);
								tech.techattrs.push(techattr);
								//console.log("ATT saved=>",tech.id);
						}
					});

					//FIN iteration

					});


					});

//MODELS			
					classification4= {};
					classification4.models = [];
					var cl2 = item3.classification;
					
					cl2.forEach(function(item4){
						
						
						
						if((item["Classification level 3 ID"] == item4.id) && ("-" != item["Classification level 4 ID"])){
							/*if( id4 == 0){
								classification4.classification = [];
							}*/						
							////console.log("** ID4 **",item["Classification level 4 ID"]);
							classification4.id = item["Classification level 4 ID"];
							classification4.name = item["Classification level 4 NAME"];
							
							/*if((item["Model ID"] != "-") && (idmd != item["Model ID"])){
								
								model.id = item["Model ID"];
								model.name = item["Model NAME"];
								idmd = item["Model ID"];
								classification4.models.push(model);
								//console.log("M **",item["Model ID"]);
							}*/
							if(item4.classification && (id4 != item["Classification level 4 ID"])){
								item4.classification.push(classification4);
								////console.log("** ID4 PUSH **", id4);	
							}	
							
							id4 = item["Classification level 4 ID"];
						}
					model= {};
					model.products = [];
					var md1 = item4.classification;
					
					md1.forEach(function(item6){
						
						if((item["Classification level 4 ID"] == item6.id)&&(item["Model ID"] != "-") && (idmd != item["Model ID"])){
								//console.log("M **",idmd );
								model.id = item["Model ID"];
								model.name = item["Model NAME"];
								idmd = item["Model ID"];
								//classification4.models.push(model);
								item6.models.push(model);
								//console.log("66=>",item6.id);
							}
					
						var prods = item6.models;
						product= {};
						product.techattrs = [];
					prods.forEach(function(item7){
						//console.log("TEST" );
						if((item["Model ID"] == item7.id)&&(item["Product ID"] != "-") 
							&& (idprod != item["Product ID"])){
								//console.log("Product  **",idprod );
								product.id = item["Product ID"];
								product.name = item["Product NAME"];
								product.shortdesc = item["short description"];
								product.longdesc = item["long description"];
								idprod = item["Product ID"];
								//classification4.models.push(model);
								item7.products.push(product);
								//console.log("=>",item7.id);
							}
						//Technical attribut ID
					var techattrs = item7.products;
					techattr = {};
					
					techattrs.forEach(function(tech){
						//console.log("ATTR LEV3 => ", idattr3 );
						if((item["Product ID"] == tech.id)&&(item["Technical attribut ID"] != "-") 
							&& (idattr3 != item["Technical attribut ID"])){
								//console.log("ATTRIBUT LEV 4   **",idattr3 );
								techattr.id = item["Technical attribut ID"];
								techattr.name = item["Technical attribut NAME"];
								techattr.value = item["Technical attribut VALUE"];
								techattr.unit = item["Technical attribut UNIT"];
								idattr3 = item["Technical attribut ID"];
								//classification4.models.push(model);
								tech.techattrs.push(techattr);
								//console.log("ATT saved=>",tech.id);
						}
					});

					//FIN iteration
					});


					});

					/*// Integration Model and Products
					model= {};
					model.products = [];
					var mdl = item4.classification;
					
					mdl.forEach(function(item5){
						
						if((item["Classification level 4 ID"] == item5.id) && (id5 != item["Model ID"])
							&& ("-" != item["Model ID"])){
													
							//console.log("** ID MODEL **",item["Model ID"]);
							model.id = item["Model ID"];
							model.name = item["Model NAME"];
							//console.log("**MODEL **",model);
							
							if(item5.models && (id5 != item["Model ID"])){
								item5.models.push(model);
								//console.log("** ID4 PUSH **", id5);	
							}
							
							id5 = item["Model ID"];
						}
					// Integration Model and Products
						
						
					});*/
					
	
					});
					
					/*if((item["Classification level 3 ID"] == item3.id) && (id3 != item["Classification level 3 ID"])){

						classification3.id = item["Classification level 3 ID"];
						classification3.name = item["Classification level 3 NAME"];
						id3 = item["Classification level 3 ID"];
						item3.classification.push(classification3);
					}*/
				});
				
				/*if(item["Classification level 2 ID"] == item2){
					//console.log("** id2 changed ", item["Classification level 3 ID"]);
					classification3.id = item["Classification level 3 ID"];
					classification3.name = item["Classification level 3 NAME"];
					id3 = classification3.id;
					
					classification2.classification.push(classification3);
				}*/
				
			});
						
		});
	

	// MODELS ICI apres qu on a terminé iteration des CLASSIFICATIONS


	
			
	//result.forEach(function(item){
		////console.log("** TEST => rooot class**");
		/*var idtest= 0;
		var idclassif =0
		root.forEach(function(item2){
			var id_model = 0;
			var idnbr = 0;
			model= {};
			model.products = [];
			
			var cl = item2.classification;
				//item3.models

			
			var poitem = 0;
			
			cl.forEach(function(item3){
				poitem =  item3.id;
				
				item3.models = [];
				if (typeof item3.classification == 'undefined' || item3.classification.length == 0) {
    					// the array is EMPTY
					//item3.models = [];
					idnbr++;
					////console.log("** empty level => **", item3.id);
					//console.log("++++");
					result.forEach(function(item){
					    if( (item3.id ==  item["Classification level 2 ID"]) && (idtest !=  item["Classification level 2 ID"])){
						//if((idtest !=  item["Classification level 1 ID"])){
							//console.log("------");
							model.id = item["Model ID"];
							model.name = item["Model NAME"];
							id_model = item["Model ID"];
							idtest = item["Classification level 2 ID"];			
							item3.models.push(model);
							//console.log("** level => **", item3.id);
							idtest = item["Classification level 1 ID"];
							//console.log("** ID =*", idtest);
						//}
					    }
					});
					
				}
										
			});
			

		
	});*/
	/*var idtest= 0;
	var idclassif =0
	result.forEach(function(item){
		////console.log("** TEST => rooot class**");
		if(item["Classification level 3 ID"] == "-"){
		
		     root.forEach(function(item2){
			if(item["Classification level 2 ID"] == item2.classification){
		     });
		}
	
	});*/
	res.json(root);
	}	
	});

});

/*optimisation pour l'insertion sfa qui appelle 2 fonction d'insertion unit et attribute et traitement des données unit + attribute*/


//method tester et approuver et fonctionne
// insertion Fichier Manutan SFA
// Insert JSON format is database from SFA
function getFileExtension1(filename) {
	return filename.slice((filename.lastIndexOf(".xml") - 1 >>> 0) + 2);
}
 
router.post('/insertionsfa', cors(), (req, res, next) => {
    
    var model = req.body;
	var filename = model.filename;
    var collection;
    
    if( getFileExtension1(filename) == 'xml' && filename.startsWith("manutanSFA")) {
       
        connection((db) => {
            collection = db.collection('productsmanutan');
             ////console.log(collection);
        });
        ////console.log(collection);
       
        var fs = require('fs');
        fs.readFile('uploads/'+ filename, (err, data) => {
            if (err) throw err;
            // var json = JSON.parse(data);
            var parser = new xml2js.Parser({ attrkey: 'attribut' });
            parser.parseString(data, function (err, result) {
                // res.json(result);
                //console.log("=>",result, "<="); 
                var last = 0;
                var products = result['STEP-ProductInformation']['Products'];
                // suppression des données dans la collection productsmanutan
                connection((db) => {
                   db.collection('productsmanutan').deleteMany({}); 
                });
                //insertion des product avec item product par product
                products.forEach((item) => {
                    
                    connection((db) => {
                        db.collection('productsmanutan').insert(item['Product'], {safe: true});
                    });
                });                                    
            if(err) throw err;                    
            });
            res.json("file inserted ");
        });
    };  
});

/* insertion Fichier Manutan SFA
    // Insert JSON format is database from SFA
    router.get('/insertionsfa', (req, res) => {
        var collection;
    connection((db) => {
        collection = db.collection('productsmanutan');
         ////console.log(collection);
    });
    ////console.log(collection);
   
    var fs = require('fs');
    fs.readFile('uploads/manutanSFA.xml', (err, data) => {
        if (err) throw err;
        // var json = JSON.parse(data);
        var parser = new xml2js.Parser({ attrkey: 'attribut' });
        parser.parseString(data, function (err, result) {
            // res.json(result);
            //console.log("=>",result, "<="); 
            var last = 0;
            var products = result['STEP-ProductInformation']['Products'];
            // suppression des données dans la collection productsmanutan
            connection((db) => {
               db.collection('productsmanutan').deleteMany({}); 
            });
            //insertion des product avec item product par product
            products.forEach((item) => {
                
                connection((db) => {
                    db.collection('productsmanutan').insert(item['Product'], {safe: true});
                });
            });                    
        
        if(err) throw err;
            
        });
            res.json("file inserted ");
      });
});*/

// GET Sfa Product By ID Classification
// request ID + url
router.get('/sfa/:idclassif', (req, res) => {
            
  db.collection("productsmanutan").findOne({"ClassificationReference.attribut.ClassificationID" : req.params.idclassif}, function(err, result) {
    if (err) throw err;
    //console.log(req.params.idclassif);
   res.json(result);
  });
   
});

/*==================================================================*/
/*insertion fonction*/

// Insert JSON format is database from SFA Attribute
function getFileExtension2(filename) {
	return filename.slice((filename.lastIndexOf(".xml") - 1 >>> 0) + 2);
}

router.post('/insertion4', cors(), (req, res, next) => {
    
    var model = req.body;
	var filename = model.filename;
    var collection;
    
    if( getFileExtension2(filename) == 'xml' && filename.startsWith("manutanSFA")) {    
    
        connection((db) => {
            collection = db.collection('attribute');
             ////console.log(collection);
        });
        ////console.log(collection);
        
        var fs = require('fs');
        fs.readFile('uploads/'+ filename, (err, data) => {
            if (err) throw err;
            // var json = JSON.parse(data);
            var parser = new xml2js.Parser({ attrkey: 'attribut' });
            parser.parseString(data, function (err, result) {
                // res.json(result);
                //console.log("=>",result, "<="); 
                var last1 = 0;
                var attribute = result['STEP-ProductInformation']['AttributeList'];
                //console.log(result);
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
    };    
});

/*insertion 5*/

function getFileExtension4(filename) {
	return filename.slice((filename.lastIndexOf(".xml") - 1 >>> 0) + 2);
}

// Insert JSON format is database from SFA Unit
router.post('/insertion5', cors(), (req, res, next) => {
    
    var model = req.body;
	var filename = model.filename;
    var collection;
    
    if( getFileExtension4(filename) == 'xml' && filename.startsWith("manutanSFA")) {
        connection((db) => {
            collection = db.collection('unit');
             ////console.log(collection);
        });
        ////console.log(collection);
        
        var fs = require('fs');
        fs.readFile('uploads/'+ filename, (err, data) => {
            if (err) throw err;
            // var json = JSON.parse(data);
            var parser = new xml2js.Parser({ attrkey: 'attribut' });
            parser.parseString(data, function (err, result) {
                // res.json(result);
                //console.log("=>",result, "<="); 
                var last1 = 0;
                var unit = result['STEP-ProductInformation']['UnitList'];
                //console.log(result);
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
            //res.json("file inserted ");
        });
    };
});
// Insert JSON format is database from SFA Attribute
  /*  router.get('/insertion4', (req, res) => {
        var collection;
    connection((db) => {
        collection = db.collection('attribute');
         //console.log(collection);
    });
    //console.log(collection);
   
    var fs = require('fs');
    fs.readFile('uploads/manutanSFA.xml', (err, data) => {
        if (err) throw err;
        // var json = JSON.parse(data);
        var parser = new xml2js.Parser({ attrkey: 'attribut' });
        parser.parseString(data, function (err, result) {
            // res.json(result);
            //console.log("=>",result, "<="); 
            var last1 = 0;
            var attribute = result['STEP-ProductInformation']['AttributeList'];
            //console.log(result);
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
    });*/


// Insert JSON format is database from SFA Unit
 /*   router.get('/insertion5', (req, res) => {
        var collection;
    connection((db) => {
        collection = db.collection('unit');
         ////console.log(collection);
    });
    ////console.log(collection);
   
    var fs = require('fs');
    fs.readFile('uploads/manutanSFA.xml', (err, data) => {
        if (err) throw err;
        // var json = JSON.parse(data);
        var parser = new xml2js.Parser({ attrkey: 'attribut' });
        parser.parseString(data, function (err, result) {
            // res.json(result);
            //console.log("=>",result, "<="); 
            var last1 = 0;
            var unit = result['STEP-ProductInformation']['UnitList'];
            //console.log(result);
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
            //res.json("file inserted ");
      });
});*/


//Login
router.post('/testing', (req, res, next) => {
    var user = req.body;
    if(!user){
        res.status(400);
        res.json({
            "error":"bad DATA"
        });
    }else{

        connection((db) => {
            db.collection('users').findOne({ username: username, password: password }, function (err, user) {
		if(err){
                res.send(err);
            }
            res.json(user);
            
    
        });
        
    });
    }
        
});

router.get('/deleteuser/:user', (req, res) => {
  var userlogin = req.params.user;
  db.collection('users').remove({"username" : userlogin});
});

/* Johnny

/*==================================================================================================================*/
/*================================resquest sfa + attribut name + unit name==========================================*/
/*==================================================================================================================*/


/*==================================================================================================================*/
/*================================resquest sfa + attribut name + unit name==========================================*/
/*==================================================================================================================*/

/* request sfa id + Tag name + name unit */
router.get('/sfa2/:gmc', (req, res) => {
            
    
    db.collection("productsmanutan").find({"ClassificationReference.attribut.ClassificationID" : req.params.gmc},function(err, result) {

          result.forEach((sfa) => {
            if (sfa.AttributeLink != null && typeof(sfa.AttributeLink) != "undefined") {
                sfa.AttributeLink.forEach((attributLink) => {
                
                // request ID + url attribute
                db.collection("attribute").findOne({"attribut.ID" : attributLink.attribut.AttributeID}, function(err, attributes) {
		if(attributes != null){

                attributLink.name = attributes.Name;
                attributLink.units= [];
                //console.log(attributLink.name);                         
                        
                        if (attributes.Validation != null && typeof(attributes.Validation) != "undefined") {   
                            var validations = attributes.Validation;                             
                            var unitLinks = validations[0].UnitLink;
 
                            if (unitLinks != null && typeof(unitLinks) != "undefined") {
                                    
                                var cpt = 0;
                                unitLinks.forEach((unitLink) => {          
                                                           
                                    db.collection("unit").findOne({"attribut.ID":unitLink.attribut.UnitID }, function(err, unit) {
                                        if (err) throw err;
                                        if(unit !=null){
           				 attributLink.units.push(unit.Name[0]);
        				                                
                                        
                                        //console.log(attributLink.units);
                                        //console.log(attributLink.units); 
                                        cpt++;}
                                    }); 
                                });
                            }
                        };
			}
                    });
                    
                });
            }                         
        });  
        setTimeout(() => {
            res.json(result);
        },250); 
   });   
});


// test lookup

/* request sfa id + Tag name + name unit */
router.get('/sfa4/:gmc', (req, res) => {
	connection((db) => {
        
	db.collection('productsmanutan').aggregate([
		{
			$unwind: "$AttributeLink"
		 },
	  { $lookup:
		 {
		   from: 'attribute',
		   localField: 'attribut.AttributeID',
		   foreignField: 'attribut.ID',
		   as: 'inventory_docs'
		 }
	   },
	   {
		$match: { "inventory_docs": { $ne: [] } }
	 }
	  ], function(err, res1) {
	  console.log("res1");
	  db.close();
	  res.json(res1);
	});
  });
  
});
// Insert JSON format is database from SFA
    router.get('/insertion3', (req, res) => {
        var collection;
    connection((db) => {
        collection = db.collection('productsmanutan');
         ////console.log(collection);
    });
    ////console.log(collection);
   
    var fs = require('fs');
    fs.readFile('uploads/manutanSFA.xml', (err, data) => {
        if (err) throw err;
        // var json = JSON.parse(data);
        var parser = new xml2js.Parser({ attrkey: 'attribut' });
        parser.parseString(data, function (err, result) {
            // res.json(result);
            //console.log("=>",result, "<="); 
            var last = 0;
            var products = result['STEP-ProductInformation']['Products'];
            // suppression des données dans la collection productsmanutan
            connection((db) => {
               db.collection('productsmanutan').deleteMany({}); 
            });
            //insertion des product avec item product par product
            products.forEach((item) => {
                
                connection((db) => {
                    db.collection('productsmanutan').insert(item['Product'], {safe: true});
                });
            });                    
        if(err) throw err;           
        });
            res.json("file inserted ");
      });
    });
    
    // Insert JSON format is database from SFA Attribute
    router.get('/insertion4', (req, res) => {
        var collection;
    connection((db) => {
        collection = db.collection('attribute');
         ////console.log(collection);
    });

   
    var fs = require('fs');
    fs.readFile('uploads/manutanSFA.xml', (err, data) => {
        if (err) throw err;
        // var json = JSON.parse(data);
        var parser = new xml2js.Parser({ attrkey: 'attribut' });
        parser.parseString(data, function (err, result) {
            // res.json(result);
            //console.log("=>",result, "<="); 
            var last1 = 0;
            var attribute = result['STEP-ProductInformation']['AttributeList'];
            //console.log(result);
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
    
   // csv to json 
    router.get('/csv', (req, res) => {
    
    var collection;
    connection((db) => {
        collection = db.collection('filiale1');
         ////console.log(collection);
    });


    var json = csvToJson.getJsonFromCsv("uploads/filiale1.csv");



   var fs = require('fs');
        var fileInputName = 'uploads/filiale1.csv'; 
        var fileOutputName = 'uploads/fil.json';
         
 	var p = Promise.resolve();
	p.then( function() {
          return csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);
	}).then( function() {
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
		res.json(donnees);  
	      }); 
	});
	
  });
    
        // Insert JSON format is database from SFA Unit
    router.get('/insertion5', (req, res) => {
        var collection;
    connection((db) => {
        collection = db.collection('unit');
         ////console.log(collection);
    });
    ////console.log(collection);
   
    var fs = require('fs');
    fs.readFile('uploads/manutanSFA.xml', (err, data) => {
        if (err) throw err;
        // var json = JSON.parse(data);
        var parser = new xml2js.Parser({ attrkey: 'attribut' });
        parser.parseString(data, function (err, result) {
            // res.json(result);
            //console.log("=>",result, "<="); 
            var last1 = 0;
            var unit = result['STEP-ProductInformation']['UnitList'];
            //console.log(result);
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
            //res.json("file inserted ");
      });
    });

/*==========================================================================================*/
/*===================================Mapping Filiale========================================*/
/*==========================================================================================*/

/*=========================================================================================================================================================================*/
//SAVE MAPPING ZAKARIA
router.post('/mappingsfa', cors(), (req, res, next) => {
    var model = req.body;
	var idf = model.idf;
	var idsfa = model.idsfa;
	var namesfa = model.namesfa;
	var userId = model.username;
	var structure;
	var mapped = false;
    if(!model){
        res.status(400);
        res.json({
            "error":"bad DATA"
        });
    }else{
		db.collection("users").findOne({"username": userId}, function(err, user) {
		
		structure = user.structure;
		if(structure != "manutan"){
			
			db.collection(structure).findOne({"ProductID" : idf}, function(err, product) {				
				//console.log(structure);
				if( product != null) {
					//console.log("product");
					db.collection('mappingsfa').remove({"idf":idf, "structure": structure});
					db.collection('mappingsfa').insert({"idf":idf, "idsfa":idsfa, "namesfa":namesfa, "user":userId, "structure": structure, "date": Date.now(), "statut":"provisoire" });
				} else {
					db.collection(structure).distinct("ProductID", {$or : [{"Classificationlevel1ID" : idf}, {"Classificationlevel2ID" : idf}, {"Classificationlevel3ID" : idf}, {"Classificationlevel4ID" : idf}, {"ModelID" : idf}] }, function(err, idproduct) {
						
						 if(idproduct != null){
							 idproduct.forEach((productline) => {
							 	db.collection('mappingsfa').findOne({"idf" : productline, "structure": structure}, function(err, mapping) {	
									 //console.log(productline);
									 if (mapping == null){
										 //console.log("insert one");
										 db.collection('mappingsfa').insert({"idf": productline, "idsfa":idsfa, "namesfa":namesfa, "user":userId, "structure": structure, "date": Date.now(), "statut":"provisoire" });
									 } else {
										 //console.log("Already existing");
									 }
							 	});	 
					 		});
						 }									
					});
				}	
			});	
		}
	});
      
    }
      //res.json(mapped);   
});

// elle va remplacer celle en haut
/* mapping tag*/

router.post('/mappingtag', cors(), (req, res, next) => {
    var model = req.body;
	var idf = model.idf;
	var idsfa = model.idsfa;
	var userId = model.user;
	var idtagf = model.idtagf;
	var idtaggmc = model.idtaggmc;
	var nametaggmc = model.nametaggmc;
	
	var structure;	
	var inserted = true;
	console.log("test  ", userId);
	
	db.collection("users").findOne({"username": userId}, function(err, user) {
		
		structure = user.structure;
		if(structure != "manutan"){
		
				console.log(structure);
				console.log(idsfa);
				console.log(idf);
				
				db.collection('mappingtag').remove({"idf": idf, "idtagf":idtagf, "structure": structure});

							 
				db.collection("productsmanutan").distinct("attribut.ID", {"AttributeLink.attribut.AttributeID":idtaggmc}, function(err, taggmc) {	
					db.collection("mappingsfa").distinct("idf" ,{"structure": structure, "idsfa": {$in :taggmc}}, function(err, searchmapping){	
						console.log("mapped idf", searchmapping);
						db.collection(structure).distinct("ProductID", {"TechnicalattributID" : idtagf, "ProductID": {$in : searchmapping} }, function(err, productsToMap) {
							db.collection("mappingtag").distinct( "idf", {"structure" : structure, "idtagf" : idtagf, "idf" : {$in : productsToMap}}, function(err, alreadyMap) {
								productsToMap.forEach((productToMap) => {
									if( alreadyMap.indexOf(productToMap) == -1) {
										db.collection('mappingtag').insert({"idf": productToMap, "idtagf":idtagf, "idtaggmc":idtaggmc, "nametaggmc":nametaggmc,"user":userId, "structure": structure, "date": new Date(Date.now()).toISOString(), "statut":"provisoire" });
											console.log("insertion");
											inserted = true;
											

									}					
								});
								res.json(inserted);											
							});																			
						});
					});								
				});
		}
	});

	//res.json(inserted);
});

// find idProduit to get all Mapping informations
router.get('/infomapping1/:idf/:structure', (req, res) => {
	var idf = req.params.idf;
	var structure = req.params.structure;
    connection((db) => {
        
        db.collection('mappingsfa').findOne( { idf: idf , structure: structure }, function(err, mapping) {
        
     
		if(err){
                res.json(null);
            }
	    console.log(mapping);
            res.json(mapping);
            //if(err)
            // } else {
            //    res.json("doc");
            // }
    });
});
});

/*get info mapping des attribut*/

//find tag to get all Mapping informations
router.post('/infomappingtag', cors(), (req, res) => {
    
    var model = req.body;
    var idf = model.idf;
    var attribut = model.idtagf;
    var structure = model.structure;
   connection((db) => {

       db.collection('mappingtag').findOne( { "idf": idf, "idtagf": attribut, "structure": structure }, function(err, mappingtag) {

            if(err){
                res.json(null);
            }

            console.log(mappingtag);
            res.json(mappingtag);

        });
    });
});



/// INtegration code Johnny 23 Jan Mardi 2018
/*==================================================================*/
/*====================Insertion mapping du structure filiale========*/

/*router.get('/filiale/:structure', (req, res) => {
    
	var structure = req.params.structure;	
	var root = [];
	db.collection("mappingsfa").distinct("idf", {"structure" : structure}, function(err, mapping) {
    db.collection("mappingtag").find({"structure" : structure, "idf" : { $in : mapping}}, function(err, mappingtag) {
		var mappingkeys = [];
		mappingtag.forEach( function(currentmapping){
			mappingkeys.push(currentmapping.idf + currentmapping.idtagf);
		});
		
		var id1 = 0;
		var id2 = 0;
		var id3 = 0;
		var id4 = 0;
		var id5 = 0;
		var classification1 = {};
		var classification2 = {};
		var classification3 = {};
		var idmd9 = 0;
		db.collection(structure).find({}).sort({ "sorter": 1}, function(err, result) {
			//console.log("Taille result : ", result.length);	
		result.forEach(function(item){
      			////console.log("1");
			//console.log(item["Classificationlevel1ID"], "** =================!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!==================**", id1);
			if(item["Classificationlevel1ID"] != id1){
				
				classification1= {};
				classification2= {};
				classification2.models = [];
				classification3= {};
				classification4= {};
				classification1.id = item["Classificationlevel1ID"];
				classification1.name = item["Classificationlevel1NAME"];
				id1 = classification1.id;
				//classification1.push(id1);	
				//classification1.push(name);
				classification1.classification = [];
				//console.log("** =================!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!==================**");
				if(item["Classificationlevel2ID"] != id2){
					////console.log("** id2 CHANGE**");
					classification2.id = item["Classificationlevel2ID"];
					classification2.name = item["Classificationlevel2NAME"];
					id2 = item["Classificationlevel2ID"];
					classification2.classification = [];
					classification2.models = [];

				     

					//classification2.push(id2);
					//classification2.push(item["Classification level 2 NAME"]);
												
					classification1.classification.push(classification2);
					//console.log("** ==================================================================**");
					root.push(classification1);
					classification2= {};
					//classification1= {};
					//root.push(classification1);
				}//else
					//console.log("** ===> id1 id2 ==**");
					
				
			}else{
				if(item["Classificationlevel2ID"] != id2){
					classification2.id = item["Classificationlevel2ID"];
					classification2.name = item["Classificationlevel2NAME"];
					id2 = classification2.id;
					classification2.classification = [];
					classification2.models = [];
					
					
					//classification2.push(id2);
					//classification2.push(item["Classification level 2 NAME"]);

					classification1.classification.push(classification2);
					//root.push(classification1);
					classification2= {};
				}
			}  
		});
		//MODELS FOR LEVEL 2
		var idmd10 = 0;
		var idp = 0;
		idattr1 = 0;
		idattr2 = 0;
		idattr3 = 0;
//console.log("Taille result 2: ", result.length);	
		result.forEach(function(item){
			////console.log("** TEST**");
			
			root.forEach(function(item10){
			var cll = item10.classification;	
			//classification3.models = [];
				model= {};
				model.products = [];
			cll.forEach(function(item11){
			if((item["Classificationlevel2ID"] == item11.id)&&(item["ModelID"] != "-") && (idmd10 != item["ModelID"]) && ("-" == item["Classificationlevel3ID"])){//////////////////////
								//console.log("for cl2 =>  **",idmd2 );
								model.id = item["ModelID"];
								model.name = item["ModelNAME"];
								idmd10 = item["ModelID"];
								//classification4.models.push(model);
								item11.models.push(model);
								//console.log("Niv 2=>",item11.id);
				}
			
			var prods = item11.models;
			product= {};
			product.techattrs = [];
					prods.forEach(function(it){
						//console.log("PROD N1 => ", idp );
						if((item["ModelID"] == it.id)&&(item["ProductID"] != "-") 
							&& (idp != item["ProductID"])){
								//console.log("Product  **",idp );
								product.id = item["ProductID"];
								product.name = item["ProductNAME"];
								product.shortdesc = item["short description"];
								product.longdesc = item["long description"];
								idp = item["Product ID"];
								if(mapping.indexOf(product.id) > -1){
											//console.log(" find mapped ");
											product.mapped = "true";
											//console.log(product.mapped);		
								}
								//classification4.models.push(model);
								it.products.push(product);
								//console.log("=>",it.id);
							}
							//Technical attribut ID
					var techattrs = it.products;
					techattr = {};
					
					techattrs.forEach(function(tech){
						//console.log("ATTR N1 => ", idattr1 );
						if((item["ProductID"] == tech.id)&&(item["Technical attribut ID"] != "-") 
							&& (idattr1 != item["TechnicalattributID"])){
								//console.log("ATTRIBUT   **",idattr1 );
								techattr.id = item["TechnicalattributID"];
								techattr.name = item["TechnicalattributNAME"];
								techattr.value = item["TechnicalattributVALUE"];
								techattr.unit = item["TechnicalattributUNIT"];
								idattr1 = item["TechnicalattributID"];
								if(mappingkeys.indexOf(product.id + techattr.id) > -1){
									//console.log(" find mapped ");
									techattr.mapped = "true";
									//console.log(product.mapped);		
								}
								//classification4.models.push(model);
								tech.techattrs.push(techattr);
								//console.log("ATT saved=>",tech.id);
						}
					});

					//FIN iteration

			});

			});
			});
		});
		var idcsv = 0;
		var idmd = 0;
		var idmd2 = 0;
		var idmd3 = 0;
		var idprod = 0;
		var idprod1 = 0;
		var idprod2 = 0;
//console.log("Taille result 3: ", result.length);	
		result.forEach(function(item){
			////console.log("** TEST**");
			idcsv++;
			root.forEach(function(item2){
				var iditem2 = 0;
				classification3= {};
				classification3.classification = [];
				classification3.models = [];
				model= {};
				model.products = [];
				var cl = item2.classification;
				cl.forEach(function(item3){
					if((iditem2 ==0 ) && (idcsv == 1)){
						//console.log("** ITEM  **",item3.id);
						iditem2++;
					}
					
					if((item["Classificationlevel2ID"] == item3.id) && (id3 != item["Classificationlevel3ID"]) && ("-" != 	item["Classificationlevel3ID"])){
						//console.log("** INSERT HERE  **",item3.id);
						classification3.id = item["Classificationlevel3ID"];
						classification3.name = item["Classificationlevel3NAME"];
						id3 = item["Classificationlevel3ID"];
						item3.classification.push(classification3);
					}
					

//MODELS
					model2= {};
					model2.products = [];
					var md2 = item3.classification;
					
					md2.forEach(function(item8){
						
						if((item["Classificationlevel3ID"] == item8.id)&&(item["ModelID"] != "-") && (idmd2 != item["ModelID"])){
								//console.log("M **",idmd2 );
								model2.id = item["ModelID"];
								model2.name = item["ModelNAME"];
								idmd2 = item["ModelID"];
								//classification4.models.push(model);
								item8.models.push(model2);
								//console.log("Niv 3=>",item8.id);
							}
					
						var prods2 = item8.models;
						product2= {};
						product2.techattrs = [];
						prods2.forEach(function(item9){
						//console.log("TEST" );
						if((item["ModelID"] == item9.id)&&(item["ProductID"] != "-") 
							&& (idprod2 != item["ProductID"])){
								//console.log("Product  **",idprod2 );
								product2.id = item["ProductID"];
								product2.name = item["ProductNAME"];
								product2.shortdesc = item["shortdescription"];
								product2.longdesc = item["longdescription"];
								idprod2 = item["ProductID"];
								if(mapping.indexOf(product2.id) > -1){
											//console.log(" find mapped ");
											product2.mapped = "true";
											//console.log(product2.mapped);		
								}
								//classification4.models.push(model);
								item9.products.push(product2);
								//console.log("=>",item9.id);
							}
				//Technical attribut ID
					var techattrs = item9.products;
					techattr = {};
					
					techattrs.forEach(function(tech){
						//console.log("ATTR LEV3 => ", idattr2 );
						if((item["ProductID"] == tech.id)&&(item["TechnicalattributID"] != "-") 
							&& (idattr2 != item["TechnicalattributID"])){
								//console.log("ATTRIBUT   **",idattr2 );
								techattr.id = item["TechnicalattributID"];
								techattr.name = item["TechnicalattributNAME"];
								techattr.value = item["TechnicalattributVALUE"];
								techattr.unit = item["TechnicalattributUNIT"];
								idattr2 = item["TechnicalattributID"];
								if(mappingkeys.indexOf(product.id + techattr.id) > -1){
									//console.log(" find mapped ");
									techattr.mapped = "true";
									//console.log(product.mapped);		
								}
								//classification4.models.push(model);
								tech.techattrs.push(techattr);
								//console.log("ATT saved=>",tech.id);
						}
					});

					//FIN iteration

					});


					});

//MODELS			
					classification4= {};
					classification4.models = [];
					var cl2 = item3.classification;
					
					cl2.forEach(function(item4){
						
						
						
						if((item["Classificationlevel3ID"] == item4.id) && ("-" != item["Classificationlevel4ID"])){
													
							////console.log("** ID4 **",item["Classification level 4 ID"]);
							classification4.id = item["Classificationlevel4ID"];
							classification4.name = item["Classificationlevel4NAME"];
							
							
							if(item4.classification && (id4 != item["Classificationlevel4ID"])){
								item4.classification.push(classification4);
								////console.log("** ID4 PUSH **", id4);	
							}	
							
							id4 = item["Classificationlevel4ID"];
						}
					model= {};
					model.products = [];
					var md1 = item4.classification;
					
					md1.forEach(function(item6){
						
						if((item["Classificationlevel4ID"] == item6.id)&&(item["ModelID"] != "-") && (idmd != item["ModelID"])){
								//console.log("M **",idmd );
								model.id = item["ModelID"];
								model.name = item["ModelNAME"];
								idmd = item["ModelID"];
								//classification4.models.push(model);
								item6.models.push(model);
								//console.log("66=>",item6.id);
							}
					
						var prods = item6.models;
						product= {};
						product.techattrs = [];
					prods.forEach(function(item7){
						//console.log("TEST" );
						if((item["ModelID"] == item7.id)&&(item["ProductID"] != "-") 
							&& (idprod != item["ProductID"])){
								//console.log("Product  **",idprod );
								product.id = item["ProductID"];
								product.name = item["ProductNAME"];
								product.shortdesc = item["shortdescription"];
								product.longdesc = item["longdescription"];
								idprod = item["ProductID"];
								if(mapping.indexOf(product.id) > -1){
											//console.log(" find mapped ");
											product.mapped = "true";
											//console.log(product.mapped);		
								}
								//classification4.models.push(model);
								item7.products.push(product);
								//console.log("=>",item7.id);
								
							}
						//Technical attribut ID
					var techattrs = item7.products;
					techattr = {};
					
					techattrs.forEach(function(tech){
						//console.log("ATTR LEV3 => ", idattr3 );
						if((item["ProductID"] == tech.id)&&(item["TechnicalattributID"] != "-") 
							&& (idattr3 != item["TechnicalattributID"])){
								//console.log("ATTRIBUT LEV 4   **",idattr3 );
								techattr.id = item["TechnicalattributID"];
								techattr.name = item["TechnicalattributNAME"];
								techattr.value = item["TechnicalattributVALUE"];
								techattr.unit = item["TechnicalattributUNIT"];
								idattr3 = item["TechnicalattributID"];
								if(mappingkeys.indexOf(product.id + techattr.id) > -1){
									//console.log(" find mapped ");
									techattr.mapped = "true";
									//console.log(product.mapped);		
								}
								//classification4.models.push(model);
								tech.techattrs.push(techattr);
								//console.log("ATT saved=>",tech.id);
						}
					});

					});
					});

					});
					
				});
				
				
				
			});
						
		});
	
	

		//setTimeout(() => {
            res.json(root);
        //},1000); 
});
	
		
	});
});


});*/

/* filiale */

router.get('/filiale/:structure', (req, res) => {
    
	var structure = req.params.structure;	
	var root = [];
	db.collection("mappingsfa").distinct("idf", {"structure" : structure}, function(err, mapping) {
    db.collection("mappingtag").find({"structure" : structure, "idf" : { $in : mapping}}, function(err, mappingtag) {
		var mappingkeys = [];
		/*mappingtag.forEach( function(currentmapping){
			mappingkeys.push(currentmapping.idf + currentmapping.idtagf);
		});*/
		for (var a = 0; a < mappingtag.length; a++){
			mappingkeys.push(mappingtag[a].idf + mappingtag[a].idtagf);
		}
		console.log("final", mappingkeys);

		var id1 = 0;
		var id2 = 0;
		var id3 = 0;
		var id4 = 0;
		var id5 = 0;
		var classification1 = {};
		var classification2 = {};
		var classification3 = {};
		var idmd9 = 0;
		db.collection(structure).find({}).sort({ "sorter": 1}, function(err, result) {
			//console.log("Taille result : ", result.length);	
		result.forEach(function(item){
      			////console.log("1");
			//console.log(item["Classificationlevel1ID"], "** =================!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!==================**", id1);
			if(item["Classificationlevel1ID"] != id1){
				/*if(id1 != 0){
					root.push(classification1);	
				}*/
				classification1= {};
				classification2= {};
				classification2.models = [];
				classification3= {};
				classification4= {};
				classification1.id = item["Classificationlevel1ID"];
				classification1.name = item["Classificationlevel1NAME"];
				id1 = classification1.id;
				//classification1.push(id1);	
				//classification1.push(name);
				classification1.classification = [];
				//console.log("** =================!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!==================**");
				if(item["Classificationlevel2ID"] != id2){
					////console.log("** id2 CHANGE**");
					classification2.id = item["Classificationlevel2ID"];
					classification2.name = item["Classificationlevel2NAME"];
					id2 = item["Classificationlevel2ID"];
					classification2.classification = [];
					classification2.models = [];

				     
					/*if(item["Classification level 3 ID"] != id3){
						//console.log("ID3 ", item["Classification level 3 ID"]);
						classification3.id = item["Classification level 3 ID"];
						classification3.name = item["Classification level 3 NAME"];
						id3 = classification3.id;
						//console.log("** ===> id3 inserted ==**", id3);
						classification2.classification.push(classification3);
					}*/

					//classification2.push(id2);
					//classification2.push(item["Classification level 2 NAME"]);
												
					classification1.classification.push(classification2);
					//console.log("** ==================================================================**");
					root.push(classification1);
					classification2= {};
					//classification1= {};
					//root.push(classification1);
				}//else
					//console.log("** ===> id1 id2 ==**");
					/*if(item["Classification level 3 ID"] != id3){
						//console.log("** id2 changed ", item["Classification level 3 ID"]);
						classification3.id = item["Classification level 3 ID"];
						classification3.name = item["Classification level 3 NAME"];
						id3 = classification3.id;
						
						classification2.classification.push(classification3);
					}*/
					//root.push(classification1);
					//classification1= {};	
				
			}else{
				if(item["Classificationlevel2ID"] != id2){
					classification2.id = item["Classificationlevel2ID"];
					classification2.name = item["Classificationlevel2NAME"];
					id2 = classification2.id;
					classification2.classification = [];
					classification2.models = [];
					
					/*if(item["Classification level 3 ID"] != id3){
						//console.log("ID3 ", item["Classification level 3 ID"]);
						classification3.id = item["Classification level 3 ID"];
						classification3.name = item["Classification level 3 NAME"];
						id3 = classification3.id;
						
						classification2.classification.push(classification3);
					}*/
					//classification2.push(id2);
					//classification2.push(item["Classification level 2 NAME"]);

					classification1.classification.push(classification2);
					//root.push(classification1);
					classification2= {};
				}
			}  
		});
		//MODELS FOR LEVEL 2
		var idmd10 = 0;
		var idp = 0;
		idattr1 = 0;
		idattr2 = 0;
		idattr3 = 0;
//console.log("Taille result 2: ", result.length);	
		result.forEach(function(item){
			////console.log("** TEST**");
			
			root.forEach(function(item10){
			var cll = item10.classification;	
			//classification3.models = [];
				model= {};
				model.products = [];
			cll.forEach(function(item11){
			if((item["Classificationlevel2ID"] == item11.id)&&(item["ModelID"] != "-") && (idmd10 != item["ModelID"]) && ("-" == item["Classificationlevel3ID"])){//////////////////////
								//console.log("for cl2 =>  **",idmd2 );
								model.id = item["ModelID"];
								model.name = item["ModelNAME"];
								idmd10 = item["ModelID"];
								//classification4.models.push(model);
								item11.models.push(model);
								//console.log("Niv 2=>",item11.id);
				}
			
			var prods = item11.models;
			product= {};
			product.techattrs = [];
					prods.forEach(function(it){
						//console.log("PROD N1 => ", idp );
						if((item["ModelID"] == it.id)&&(item["ProductID"] != "-") 
							&& (idp != item["ProductID"])){
								//console.log("Product  **",idp );
								product.id = item["ProductID"];
								product.name = item["ProductNAME"];
								product.shortdesc = item["short description"];
								product.longdesc = item["long description"];
								idp = item["Product ID"];
								if(mapping.indexOf(product.id) > -1){
											//console.log(" find mapped ");
											product.mapped = "true";
											//console.log(product.mapped);		
								}
								//classification4.models.push(model);
								it.products.push(product);
								//console.log("=>",it.id);
							}
							//Technical attribut ID
							//celui ci ne passe pas le mapped
					var techattrs = it.products;
					techattr = {};
					
					techattrs.forEach(function(tech){
						//console.log("ATTR N1 => ", idattr1 );
						if((item["ProductID"] == tech.id)&&(item["Technical attribut ID"] != "-") 
							&& (idattr1 != item["TechnicalattributID"])){
								//console.log("ATTRIBUT   **",idattr1 );
								techattr.id = item["TechnicalattributID"];
								techattr.name = item["TechnicalattributNAME"];
								techattr.value = item["TechnicalattributVALUE"];
								techattr.unit = item["TechnicalattributUNIT"];
								idattr1 = item["TechnicalattributID"];
								if(mappingkeys.indexOf(tech.id + techattr.id) > -1){
									//console.log(mappingkeys);
									//console.log(" find mapped ");
									techattr.mapped = "true";
									//console.log(product.mapped);		
								}else{
									///console.log("NotFound ",tech.id + techattr.id);	
								}
								//classification4.models.push(model);
								tech.techattrs.push(techattr);
								//console.log("ATT saved=>",tech.id);
						}
					});

					//FIN iteration

			});

			});
			});
		});
		var idcsv = 0;
		var idmd = 0;
		var idmd2 = 0;
		var idmd3 = 0;
		var idprod = 0;
		var idprod1 = 0;
		var idprod2 = 0;
//console.log("Taille result 3: ", result.length);	
		result.forEach(function(item){
			////console.log("** TEST**");
			idcsv++;
			root.forEach(function(item2){
				var iditem2 = 0;
				classification3= {};
				classification3.classification = [];
				classification3.models = [];
				model= {};
				model.products = [];
				var cl = item2.classification;
				cl.forEach(function(item3){
					if((iditem2 ==0 ) && (idcsv == 1)){
						//console.log("** ITEM  **",item3.id);
						iditem2++;
					}
					
					if((item["Classificationlevel2ID"] == item3.id) && (id3 != item["Classificationlevel3ID"]) && ("-" != 	item["Classificationlevel3ID"])){
						//console.log("** INSERT HERE  **",item3.id);
						classification3.id = item["Classificationlevel3ID"];
						classification3.name = item["Classificationlevel3NAME"];
						id3 = item["Classificationlevel3ID"];
						item3.classification.push(classification3);
					}
					/*else if((item["Classification level 2 ID"] == item3.id) &&
						 (id3 != item["Classification level 3 ID"]) &&
					 	("-" == item["Classification level 3 ID"])){
						
						model.id = item["Model ID"];
						model.name = item["Model NAME"];
						id3 = item["Classification level 3 ID"];
						item3.products.push(classification3);
					}*/

//MODELS
					model2= {};
					model2.products = [];
					var md2 = item3.classification;
					
					md2.forEach(function(item8){
						
						if((item["Classificationlevel3ID"] == item8.id)&&(item["ModelID"] != "-") && (idmd2 != item["ModelID"])){
								//console.log("M **",idmd2 );
								model2.id = item["ModelID"];
								model2.name = item["ModelNAME"];
								idmd2 = item["ModelID"];
								//classification4.models.push(model);
								item8.models.push(model2);
								//console.log("Niv 3=>",item8.id);
							}
					
						var prods2 = item8.models;
						product2= {};
						product2.techattrs = [];
						prods2.forEach(function(item9){
						//console.log("TEST" );
						if((item["ModelID"] == item9.id)&&(item["ProductID"] != "-") 
							&& (idprod2 != item["ProductID"])){
								//console.log("Product  **",idprod2 );
								product2.id = item["ProductID"];
								product2.name = item["ProductNAME"];
								product2.shortdesc = item["shortdescription"];
								product2.longdesc = item["longdescription"];
								idprod2 = item["ProductID"];
								if(mapping.indexOf(product2.id) > -1){
											//console.log(" find mapped ");
											product2.mapped = "true";
											//console.log(product2.mapped);		
								}
								//classification4.models.push(model);
								item9.products.push(product2);
								//console.log("=>",item9.id);
							}
				//Technical attribut ID
				//le niveau de celui la passe bien par mapped
					var techattrs = item9.products;
					techattr = {};
					
					techattrs.forEach(function(tech){
						//console.log("ATTR LEV3 => ", idattr2 );
						if((item["ProductID"] == tech.id)&&(item["TechnicalattributID"] != "-") 
							&& (idattr2 != item["TechnicalattributID"])){
								//console.log("ATTRIBUT   **",idattr2 );
								techattr.id = item["TechnicalattributID"];
								techattr.name = item["TechnicalattributNAME"];
								techattr.value = item["TechnicalattributVALUE"];
								techattr.unit = item["TechnicalattributUNIT"];
								idattr2 = item["TechnicalattributID"];
								
								if(mappingkeys.indexOf(tech.id + techattr.id) > -1){
									
									//console.log(mappingkeys);
									//console.log(" find mapped ");
									techattr.mapped = "true";
									//console.log(product.mapped);		
								}else{
								}
								//classification4.models.push(model);
								tech.techattrs.push(techattr);
								//console.log("ATT saved=>",tech.id);
						}
					});

					//FIN iteration

					});


					});

//MODELS			
					classification4= {};
					classification4.models = [];
					var cl2 = item3.classification;
					
					cl2.forEach(function(item4){
						
						
						
						if((item["Classificationlevel3ID"] == item4.id) && ("-" != item["Classificationlevel4ID"])){
							/*if( id4 == 0){
								classification4.classification = [];
							}*/						
							////console.log("** ID4 **",item["Classification level 4 ID"]);
							classification4.id = item["Classificationlevel4ID"];
							classification4.name = item["Classificationlevel4NAME"];
							
							/*if((item["Model ID"] != "-") && (idmd != item["Model ID"])){
								
								model.id = item["Model ID"];
								model.name = item["Model NAME"];
								idmd = item["Model ID"];
								classification4.models.push(model);
								//console.log("M **",item["Model ID"]);
							}*/
							if(item4.classification && (id4 != item["Classificationlevel4ID"])){
								item4.classification.push(classification4);
								////console.log("** ID4 PUSH **", id4);	
							}	
							
							id4 = item["Classificationlevel4ID"];
						}
					model= {};
					model.products = [];
					var md1 = item4.classification;
					
					md1.forEach(function(item6){
						
						if((item["Classificationlevel4ID"] == item6.id)&&(item["ModelID"] != "-") && (idmd != item["ModelID"])){
								//console.log("M **",idmd );
								model.id = item["ModelID"];
								model.name = item["ModelNAME"];
								idmd = item["ModelID"];
								//classification4.models.push(model);
								item6.models.push(model);
								//console.log("66=>",item6.id);
						}
					
						var prods = item6.models;
						product= {};
						product.techattrs = [];
					prods.forEach(function(item7){
						//console.log("TEST" );
						if((item["ModelID"] == item7.id)&&(item["ProductID"] != "-") 
							&& (idprod != item["ProductID"])){
								//console.log("Product  **",idprod );
								product.id = item["ProductID"];
								product.name = item["ProductNAME"];
								product.shortdesc = item["shortdescription"];
								product.longdesc = item["longdescription"];
								idprod = item["ProductID"];
								if(mapping.indexOf(product.id) > -1){
									
											//console.log(" find mapped ");
											product.mapped = "true";
											//console.log(product.mapped);		
								}
								//classification4.models.push(model);
								item7.products.push(product);
							//console.log("=>",item7.id);								
							}
						//Technical attribut ID
						//celui ci ne passe de mapped
					var techattrs = item7.products;
					techattr = {};
					
					techattrs.forEach(function(tech){
						//console.log("ATTR LEV3 => ", idattr3 );
						if((item["ProductID"] == tech.id)&&(item["TechnicalattributID"] != "-") 
							&& (idattr3 != item["TechnicalattributID"])){
								//console.log("ATTRIBUT LEV 4   **",idattr3 );
								techattr.id = item["TechnicalattributID"];
								techattr.name = item["TechnicalattributNAME"];
								techattr.value = item["TechnicalattributVALUE"];
								techattr.unit = item["TechnicalattributUNIT"];
								idattr3 = item["TechnicalattributID"];
								if(mappingkeys.indexOf(tech.id + techattr.id) > -1){
									
									//console.log(" find mapped ");
									techattr.mapped = "true";
									//console.log(product.mapped);		
								}else{
									//console.log("NotFound ",tech.id + techattr.id);	
								}
								//classification4.models.push(model);
								tech.techattrs.push(techattr);
								//console.log("ATT saved=>",tech.id);
						}
					});

					});
					});

					});
					
				});
				
				
				
			});
						
		});
		//setTimeout(() => {
            res.json(root);
        //},1000); 
});
	
		
	});
});


});

/*==================================================================*/

router.get('/filialebak/:structure', (req, res) => {
    
	var structure = req.params.structure;	

	db.collection("mappingsfa").distinct("idf", {"structure" : structure}, function(err, mapping) {
		
		root = [];
		var id1 = 0;
		var id2 = 0;
		var id3 = 0;
		var id4 = 0;
		var id5 = 0;
		var classification1 = {};
		var classification2 = {};
		var classification3 = {};
		var idmd9 = 0;
		db.collection(structure).find({}, function(err, result) {
		result.forEach((item) => {
			
			if(item["Classificationlevel1ID"] != id1){

				classification1= {};
				classification2= {};
				classification2.models = [];
				classification3= {};
				classification4= {};
				classification1.id = item["Classificationlevel1ID"];
				classification1.name = item["Classificationlevel1NAME"];
				id1 = classification1.id;
				classification1.classification = [];
				if(item["Classificationlevel2ID"] != id2){
					classification2.id = item["Classificationlevel2ID"];
					classification2.name = item["Classificationlevel2NAME"];
					id2 = item["Classificationlevel2ID"];
					classification2.classification = [];
					classification2.models = [];
					classification1.classification.push(classification2);
					
					root.push(classification1);
					classification2= {};
				}//else
					//console.log("** ===> id1 id2 ==**");
				}else{
					if(item["Classificationlevel2ID"] != id2){
						classification2.id = item["Classificationlevel2ID"];
						classification2.name = item["Classificationlevel2NAME"];
						id2 = classification2.id;
						classification2.classification = [];
						classification2.models = [];
						classification1.classification.push(classification2);
						classification2= {};
					}
				}  
			});
		
		//MODELS FOR LEVEL 2
		var idmd10 = 0;
		var idp = 0;
		idattr1 = 0;
		idattr2 = 0;
		idattr3 = 0;
		result.forEach(function(item){
			
			root.forEach(function(item10){
				var cll = item10.classification;	
				model= {};
				model.products = [];
				cll.forEach(function(item11){
				if((item["Classificationlevel2ID"] == item11.id)&&(item["ModelID"] != "-") && (idmd10 != item["ModelID"]) && ("-" == item["Classificationlevel3ID"])){
					//console.log("for cl2 =>  **",idmd2 );
					model.id = item["ModelID"];
					model.name = item["ModelNAME"];
					idmd10 = item["ModelID"];
					item11.models.push(model);
					//console.log("Niv 2=>",item11.id);
				}
			
				var prods = item11.models;
				product= {};
					prods.forEach(function(it){
						//console.log("PROD N1 => ", idp );
						if((item["ModelID"] == it.id)&&(item["ProductID"] != "-") && (idp != item["ProductID"])){
							//console.log("Product  **",idp );
							product.id = item["ProductID"];
							product.name = item["ProductNAME"];
							idp = item["ProductID"];
							it.products.push(product);
							//console.log("=>",it.id);
							
							if(mapping.indexOf(product.id) > -1){
										//console.log(" find mapped ");
										product.mapped = "true";
										//console.log(product.mapped);		
							}	
						
						}
					});
				});
			});
		});////////////////////////////////////////////
		
		var idcsv = 0;
		var idmd = 0;
		var idmd2 = 0;
		var idmd3 = 0;
		var idprod = 0;
		var idprod1 = 0;
		var idprod2 = 0;
		result.forEach(function(item){
			idcsv++;
			root.forEach(function(item2){
				var iditem2 = 0;
				classification3= {};
				classification3.classification = [];
				classification3.models = [];
				model= {};
				model.products = [];
				var cl = item2.classification;
				cl.forEach(function(item3){
					if((iditem2 ==0 ) && (idcsv == 1)){
						//console.log("** ITEM  **",item3.id);
						iditem2++;
					}
					
					if((item["Classificationlevel2ID"] == item3.id) && (id3 != item["Classificationlevel3ID"]) && ("-" != item["Classificationlevel3ID"])){
						//console.log("** INSERT HERE  **",item3.id);
						classification3.id = item["Classificationlevel3ID"];
						classification3.name = item["Classificationlevel3NAME"];
						id3 = item["Classificationlevel3ID"];
						item3.classification.push(classification3);
					}


//MODELS
					model2= {};
					model2.products = [];
					var md2 = item3.classification;
					
					md2.forEach(function(item8){
						
						if((item["Classificationlevel3ID"] == item8.id)&&(item["ModelID"] != "-") && (idmd2 != item["ModelID"])){
								//console.log("M **",idmd2 );
								model2.id = item["ModelID"];
								model2.name = item["ModelNAME"];
								idmd2 = item["ModelID"];
								item8.models.push(model2);
								//console.log("Niv 3=>",item8.id);
						}
					
						var prods2 = item8.models;
						product2 = {};
						prods2.forEach(function(item9){
							//console.log("TEST Prod" );
							if((item["ModelID"] == item9.id)&&(item["ProductID"] != "-") && (idprod2 != item["ProductID"])){
								
									//console.log("Product test **",idprod2 );
									product2.id = item["ProductID"];
									product2.name = item["ProductNAME"];
									idprod2 = item["ProductID"];
									//console.log(product2.id);
									
									if(mapping.indexOf(product2.id) > -1){
										//console.log(" find mapped ");
										product2.mapped = "true";
										//console.log(product2.mapped);	
									}	
						
									//console.log("test");
									item9.products.push(product2);
									
									//console.log("=>",item9.id);
							}
						});
					});

//MODELS			
					classification4= {};
					classification4.models = [];
					var cl2 = item3.classification;
					
					cl2.forEach(function(item4){
						
						
						
						if((item["Classificationlevel3ID"] == item4.id) && ("-" != item["Classificationlevel4ID"])){

							classification4.id = item["Classificationlevel4ID"];
							classification4.name = item["Classificationlevel4NAME"];

							if(item4.classification && (id4 != item["Classificationlevel4ID"])){
								item4.classification.push(classification4);
							}	
							
							id4 = item["Classificationlevel4ID"];
						}
						model= {};
						model.products = [];
						var md1 = item4.classification;
						
						md1.forEach(function(item6){
							
							if((item["Classificationlevel4ID"] == item6.id)&&(item["ModelID"] != "-") && (idmd != item["ModelID"])){
									//console.log("M **",idmd );
									model.id = item["ModelID"];
									model.name = item["ModelNAME"];
									idmd = item["ModelID"];
									item6.models.push(model);
									//console.log("66=>",item6.id);
								}
						
							var prods = item6.models;
							product= {};
							prods.forEach(function(item7){
								//console.log("TEST" );
								if((item["ModelID"] == item7.id)&&(item["ProductID"] != "-") 
									&& (idprod != item["ProductID"])){
										//console.log("Product  **",idprod );
										product.id = item["ProductID"];
										product.name = item["ProductNAME"];
										idprod = item["ProductID"];
										item7.products.push(product);
										//console.log("=>",item7.id);
										
										if(mapping.indexOf(product.id) > -1){
										//console.log(" find mapped ");
										product.mapped = "true";
										//console.log(product.mapped);
										}	
									}
								});
							});
						});
					});				
				});						
			});
		//setTimeout(() => {
            res.json(root);
        //},1000); 
		});
	});
});


/*============================================================================*/
/*===========Insertion avec nom de la structure extension corection===========*/
/*============================================================================*/
//FCT
function getFileExtension3(filename) {
	return filename.slice((filename.lastIndexOf(".csv") - 1 >>> 0) + 2);
  }

// csv to json 
router.post('/csv', cors(), (req, res, next) => {
   var model = req.body;
	  var filename = model.filename;
  var structure = model.structure;
  //console.log("test csv", structure, "=> name",filename);
  if( getFileExtension3(filename) == 'csv' && filename.startsWith(structure)) {

	 ////console.log(json);
	 var fs = require('fs');
			 
	 var fileInputName = 'uploads/' + filename; 
	 var fileOutputName = 'uploads/output.json';
	var filiale;
	
	
	console.log("terminer");
	

   var p = Promise.resolve();
	p.then( function() {
	return fs.readFile(fileOutputName, 'utf8', (err, data) => {
	    if (err) throw err;
		filiale = JSON.parse(data)
	      
		});
	}).then( function() {
		    connection((db) => {
					console.log("BASE D DONNES");
				  db.collection(structure).remove({}, function(err, mapping) {
					console.log("Structure", structure);
					  cpt = 0;
					  filiale.forEach((objf1) => {
						  objf1.sorter = cpt;
					  	console.log("insertONE", cpt);
						  db.collection(structure).insert(objf1, {safe: true});
						  cpt++;
  
					   }); 
				  //});
			  }); 
		 
		 
		//res.json(donnees);  
	      }); 
	});
	
  };
  //res.json("file inserted"); 
});

 
/*suppression des mapping sfa et attribut*/
router.post('/mappingdelete', cors(), (req, res) => {
    
    var model = req.body;
    var idf = model.idf;
    var idtagf = model.idtagf;
    var userId = model.username;
    var structure;
		
		db.collection("users").findOne({"username": userId}, function(err, user) {
			
			structure = user.structure;
			if(structure != "manutan"){
				
				db.collection(structure).findOne({"ProductID" : idf, "TechnicalattributID" : idtagf}, function(err, attribut) {
					if(attribut != null){
						db.collection('mappingtag').remove({"idf" : idf, "structure" : structure, "idtagf" : idtagf});
					}else{
						//var product;
						db.collection(structure).findOne({"ProductID" : idf}, function(err, product) {					
							//console.log(product);
							if( product != null) {
								//console.log("product");
								db.collection('mappingsfa').remove({"idf" : idf, "structure" : structure});
								db.collection('mappingtag').remove({"idf" : idf, "structure" : structure});
							} else {
								db.collection(structure).distinct("ProductID", {$or : [{"Classificationlevel1ID" : idf}, {"Classificationlevel2ID" : idf}, {"Classificationlevel3ID" : idf}, {"Classificationlevel4ID" : idf}, {"ModelID" : idf}] }, function(err, idproduct) {
									
									 if(idproduct != null){
										 idproduct.forEach((productline) => { 	
											//console.log(productline);								
											//console.log("insert one");
											db.collection('mappingsfa').remove({"idf": productline, "structure" : structure}); 
											db.collection('mappingtag').remove({"structure" : structure, "idf" : productline});
										 });	 
									 }									
								});
							}	
					});			
				}
			});		
		}
	});
});
 
/*Creation user + password + structure*/
router.get('/createuser/:login/:password/:structure', (req, res) =>{
	var userlogin = req.params.login;
	var newpassword = req.params.password;
	var newstructure = req.params.structure;
	 
	db.collection("users").findOne({"username": userlogin}, function(err, user) {
		if(user == null){
			db.collection("users").insert({"username" : userlogin, "password" : newpassword, "structure" : newstructure, "admin" : true});
		}
	});
});

// code 23 janvier Mardi 2018
//save USER
router.post('/user', (req, res, next) => {
    var user = req.body;
    if(!user.username || !user.password){
        res.status(400);
        res.json({
            "error":"bad DATA"
        });
    }else{

        connection((db) => {
            
            var cursor =db.collection('users').save(user, function(err, user){
                if(err){
                    res.send(err);
                }
                
              
            });
            
    
        });
        res.json(user);
    }
    
        
});

// Delete User  by id
router.get('/userdel/:id', (req, res, next) => {
	var id = req.params.id;
    connection((db) => {
        
        db.collection('users').remove( {username : id}, function(err, user)  {
            if(err){
                res.send(err);
            }
            res.json("deleted");

        });
        

    });
});


/*  FIIIIIIIIN */

// Uploading File
var storage = multer.diskStorage({ //multers disk storage settings

        destination: function (req, file, cb) {

            cb(null, './uploads/');

        },

        filename: function (req, file, cb) {

            var datetimestamp = Date.now();

           //cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);            		    
				cb(null, file.originalname);  

        }

    });
var upload = multer({ //multer settings

                    storage: storage

                }).single('file');



    /** API path that will upload the files */

router.post('/upload', function(req, res) {

        upload(req,res,function(err){
            //console.log(req.file);
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });
    });
     /*service indicateur*/

router.get('/indicateur/:structure', (req, res) => {
	var structure = req.params.structure;
	db.collection("mappingsfa").count({"structure" : structure}, function(err, mappingsfa) {
		db.collection(structure).distinct("ProductID", {}, function(err, productf) {
			db.collection("mappingtag").count({"structure" : structure}, function(err, mappingtag) {
				db.collection(structure).count({}, function(err, producttag) {
				var tab = [];
					tab.push(mappingsfa);
					tab.push(productf.length);
					tab.push(mappingtag);
					tab.push(producttag);					
					console.log(tab);
					res.json(tab);
				});
			});
		});
	});
});

  

module.exports = router;
