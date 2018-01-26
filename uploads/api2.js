
router.get('/mappingtag/:idf/:idtagf/:idsfa/:idtaggmc/:user', (req, res) => {

	
	var idf = req.params.idf;
	//var idgmc = req.params.idgmc;
	var idtagf = req.params.idtagf;
	var idtaggmc = req.params.idtaggmc;
	var idsfa = req.params.idsfa;
	var userId = req.params.user;
	var structure;	
	
	db.collection("users").findOne({"username": userId}, function(err, user) {
		
		structure = user.structure;
		if(structure != "manutan"){
			
			db.collection("mappingsfa").findOne({"structure": structure, "idsfa": idsfa, "idf": idf}, function(err, mappingsfa) {
				console.log(mappingsfa);
				console.log(structure);
				console.log(idsfa);
				console.log(idf);
				if(mappingsfa != null){
					db.collection('mappingtag').remove({"idf": idf, "idtagf":idtagf, "structure": structure});
					//db.collection('mappingtag').insert({"idf": idf, "idtagf":idtagf, "idtaggmc":idtaggmc, "user":userId, "structure": structure, "date": Date.now(), "statut":"provisoire" });
													
					console.log(structure);
							 
					db.collection("productsmanutan").distinct("attribut.ID", {"AttributeLink.attribut.AttributeID":idtaggmc}, function(err, taggmc) {	
						db.collection("mappingsfa").distinct("idf" ,{"structure": structure, "idsfa": {$in :taggmc}}, function(err, searchmapping){	
							console.log("mapped idf", searchmapping);
							db.collection(structure).distinct("ProductID", {"ProductID" : idtagf, "ProductID": {$in : searchmapping} }, function(err, productsToMap) {
								db.collection("mappingtag").distinct( "idf", {"structure" : structure, "idtagf" : idtagf, "idf" : {$in : productsToMap}}, function(err, alreadyMap) {
									productsToMap.forEach((productToMap) => {
										if( alreadyMap.indexOf(productToMap) == -1) {
											db.collection('mappingtag').insert({"idf": productToMap, "idtagf":idtagf, "idtaggmc":idtaggmc, "user":userId, "structure": structure, "date": new Date(Date.now()).toISOString(), "statut":"provisoire" });
												console.log("insertion");
										}					
									});											
								});																			
							});
						});								
					});
				}
			});	
		}
	});
});