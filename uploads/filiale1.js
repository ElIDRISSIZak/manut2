/*==================================================================*/
/*====================Insertion mapping du structure filiale========*/
/*==================================================================*/

router.get('/filiale/:structure', (req, res) => {
    
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
				}else
					console.log("** ===> id1 id2 ==**");
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
		result.forEach(function(item){
			
			root.forEach(function(item10){
				var cll = item10.classification;	
				model= {};
				model.products = [];
				cll.forEach(function(item11){
				if((item["Classificationlevel2ID"] == item11.id)&&(item["ModelID"] != "-") && (idmd10 != item["ModelID"]) && ("-" == item["Classificationlevel3ID"])){
					console.log("for cl2 =>  **",idmd2 );
					model.id = item["ModelID"];
					model.name = item["ModelNAME"];
					idmd10 = item["ModelID"];
					item11.models.push(model);
					console.log("Niv 2=>",item11.id);
				}
			
				var prods = item11.models;
				product= {};
					prods.forEach(function(it){
						console.log("PROD N1 => ", idp );
						if((item["ModelID"] == it.id)&&(item["ProductID"] != "-") && (idp != item["ProductID"])){
							console.log("Product  **",idp );
							product.id = item["ProductID"];
							product.name = item["ProductNAME"];
							idp = item["ProductID"];
							it.products.push(product);
							console.log("=>",it.id);
							
							if(mapping.indexOf(product.id) > -1){
										console.log(" find mapped ");
										product.mapped = "true";
										console.log(product.mapped);		
							}	
						
						}
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
						console.log("** ITEM  **",item3.id);
						iditem2++;
					}
					
					if((item["Classificationlevel2ID"] == item3.id) && (id3 != item["Classificationlevel3ID"]) && ("-" != item["Classificationlevel3ID"])){
						console.log("** INSERT HERE  **",item3.id);
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
								console.log("M **",idmd2 );
								model2.id = item["ModelID"];
								model2.name = item["ModelNAME"];
								idmd2 = item["ModelID"];
								item8.models.push(model2);
								console.log("Niv 3=>",item8.id);
						}
					
						var prods2 = item8.models;
						product2 = {};
						prods2.forEach(function(item9){
							console.log("TEST Prod" );
							if((item["ModelID"] == item9.id)&&(item["ProductID"] != "-") && (idprod2 != item["ProductID"])){
								
									console.log("Product test **",idprod2 );
									product2.id = item["ProductID"];
									product2.name = item["ProductNAME"];
									idprod2 = item["ProductID"];
									console.log(product2.id);
									
									if(mapping.indexOf(product2.id) > -1){
										console.log(" find mapped ");
										product2.mapped = "true";
										console.log(product2.mapped);	
									}	
						
									console.log("test");
									item9.products.push(product2);
									
									console.log("=>",item9.id);
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
									console.log("M **",idmd );
									model.id = item["ModelID"];
									model.name = item["ModelNAME"];
									idmd = item["ModelID"];
									item6.models.push(model);
									console.log("66=>",item6.id);
								}
						
							var prods = item6.models;
							product= {};
							prods.forEach(function(item7){
								console.log("TEST" );
								if((item["ModelID"] == item7.id)&&(item["ProductID"] != "-") 
									&& (idprod != item["ProductID"])){
										console.log("Product  **",idprod );
										product.id = item["ProductID"];
										product.name = item["ProductNAME"];
										idprod = item["ProductID"];
										item7.products.push(product);
										console.log("=>",item7.id);
										
										if(mapping.indexOf(product.id) > -1){
										console.log(" find mapped ");
										product.mapped = "true";
										console.log(product.mapped);
										}	
									}
								});
							});
						});
					});				
				});						
			});
		setTimeout(() => {
            res.json(root);
        },1000); 
		});
	});
});


/*==================================================================*/
/*===========Insertion avec nom de la structure extension===========*/
/*==================================================================*/

// csv to json 
router.get('/csv/:structure/:filename', (req, res) => {
    var filename = req.params.filename;
	var structure = req.params.structure;
	if( getFileExtension3(filename) == 'csv' && filename.startsWith(structure)) {

	   //console.log(json);
	   var fs = require('fs');
	   		
	   var fileInputName = 'uploads/' + filename; 
	   var fileOutputName = 'uploads/output.json';
	         
	   csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);
	   fs.readFile(fileOutputName, 'utf8', function (erreur, donnees) {
	         if (erreur)
	            throw erreur; // Vous pouvez gérer les erreurs avant de parser le JSON
	         var filiales1 = JSON.parse(donnees);
			 
			var collection;
		    connection((db) => {
		        collection = db.collection(structure);
		    });
			
			connection((db) => {
	             collection.deleteMany({}); 
	        });		
			connection((db) => {
		        collection = db.collection(structure);
		    });
	         
	         filiales1.forEach((objf1) => {
	            
	            connection((db) => {
	               collection.insert(objf1, {safe: true});
	            });
	         });    
	     }); 
	};
 });
 
/*==================================================================*/
/*======================Mapping sfa corrigé=========================*/
/*==================================================================*/

router.get('/mappingsfa/:idf/:idsfa/:user', (req, res) => {

	
	var idf = req.params.idf;
	var idsfa = req.params.idsfa;
	var userId = req.params.user;
	var structure;
	
	
	db.collection("users").findOne({"username": userId}, function(err, user) {
		
		structure = user.structure;
		if(structure != "manutan"){
			
			db.collection(structure).findOne({"ProductID" : idf}, function(err, product) {				
				console.log(structure);
				if( product != null) {
					console.log("product");
					db.collection('mappingsfa').remove({"idf":idf, "structure": structure});
					db.collection('mappingsfa').insert({"idf":idf, "idsfa":idsfa, "user":userId, "structure": structure, "date": Date.now(), "statut":"provisoire" });
				} else {
					db.collection(structure).distinct("ProductID", {$or : [{"Classificationlevel1ID" : idf}, {"Classificationlevel2ID" : idf}, {"Classificationlevel3ID" : idf}, {"Classificationlevel4ID" : idf}, {"ModelID" : idf}] }, function(err, idproduct) {
						
						 if(idproduct != null){
							 idproduct.forEach((productline) => {
							 	db.collection('mappingsfa').findOne({"idf" : productline, "structure": structure}, function(err, mapping) {	
									 console.log(productline);
									 if (mapping == null){
										 console.log("insert one");
										 db.collection('mappingsfa').insert({"idf": productline, "idsfa":idsfa, "user":userId, "structure": structure, "date": Date.now(), "statut":"provisoire" });
									 } else {
										 console.log("Already existing");
									 }
							 	});	 
					 		});
						 }									
					});
				}	
			});	
		}
	});
});

/*==========================================================================================*/
/*===================================Resquest One Solution==================================*/
/*==========================================================================================*/

/* request sfa id + Tag name + name unit */
router.get('/sfa/:gmc', (req, res) => {
            
    
    db.collection("productsmanutan").find({"ClassificationReference.attribut.ClassificationID" : req.params.gmc},function(err, result) {

          result.forEach((sfa) => {
            if (sfa.AttributeLink != null && typeof(sfa.AttributeLink) != "undefined") {
                sfa.AttributeLink.forEach((attributLink) => {
                
                // request ID + url attribute
                db.collection("attribute").findOne({"attribut.ID" : attributLink.attribut.AttributeID}, function(err, attributes) {
                attributLink.name = attributes.Name;
                attributLink.units= [];
                console.log(attributLink.name);                         
                        
                        if (attributes.Validation != null && typeof(attributes.Validation) != "undefined") {   
                            var validations = attributes.Validation;                             
                            var unitLinks = validations[0].UnitLink;
 
                            if (unitLinks != null && typeof(unitLinks) != "undefined") {
                                    
                                var cpt = 0;
                                unitLinks.forEach((unitLink) => {          
                                                           
                                    db.collection("unit").findOne({"attribut.ID":unitLink.attribut.UnitID }, function(err, unit) {
                                        if (err) throw err;
                                                                         
                                        attributLink.units.push(unit.Name[0]);
                                        console.log(attributLink.units);
    
                                        cpt++;
                                    }); 
                                });
                            }
                        };
                    });
                    
                });
            }                         
        });  
        setTimeout(() => {
            res.json(result);
        },200); 
   });   
});



