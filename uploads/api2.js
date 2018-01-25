/*==================================================================================================================*/
/*================================resquest sfa + attribut name + unit name==========================================*/
/*==================================================================================================================*/

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
                                        //console.log(unitLink.attribut.UnitID);
                                        //console.log(unit);                                     
                                        attributLink.units.push(unit.Name[0]);
                                        console.log(attributLink.units);
                                        //console.log(attributLink.units); 
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
