
/*suppression des mapping sfa et attribut*/

router.get('/mappingdelete/:idf/:idtagf/:user', (req, res) => {

	
	var idf = req.params.idf;
	var idtagf = req.params.idtagf;
	var userId = req.params.user;
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