/*optimisation pour l'insertion sfa qui appelle 2 fonction d'insertion unit et attribute et traitement des données unit + attribute*/

// insertion Fichier Manutan SFA
// Insert JSON format is database from
router.get('/insertionsfa', (req, res) => {
  //attribut; insertion4
  //unit; insertion5
  insertion4(req, res);
  insertion5(req, res);

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
    var parser = new xml2js.Parser({
      attrkey: 'attribut'
    });
    parser.parseString(data, function(err, result) {
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
        // intergration dans les sfa des attribut name et des unit
        result.forEach((sfa) => {
          if (sfa.AttributeLink != null && typeof(sfa.AttributeLink) != "undefined") {
            sfa.AttributeLink.forEach((attributLink) => {

              // request ID + url attribute
              db.collection("attribute").findOne({
                "attribut.ID": attributLink.attribut.AttributeID
              }, function(err, attributes) {
                attributLink.name = attributes.Name;
                attributLink.units = [];
                //console.log(attributLink.name);

                if (attributes.Validation != null && typeof(attributes.Validation) != "undefined") {
                  var validations = attributes.Validation;
                  var unitLinks = validations[0].UnitLink;

                  if (unitLinks != null && typeof(unitLinks) != "undefined") {

                    var cpt = 0;
                    unitLinks.forEach((unitLink) => {

                      db.collection("unit").findOne({
                        "attribut.ID": unitLink.attribut.UnitID
                      }, function(err, unit) {
                        if (err) throw err;
                        if (unit != null) {
                          attributLink.units.push(unit.Name[0]);
                          //console.log(attributLink.units);
                          //console.log(attributLink.units);
                          cpt++;
                        }
                      });
                    });
                  }
                };
              })
            });
          }
        });
        connection((db) => {
          db.collection('productsmanutan').insert(item['Product'], {
            safe: true
          });
        });
      });
      if (err) throw err;
    });
    res.json("file inserted ");
  });
});


/*==================================================================*/

/*insertion des attribute transformé en fonction*/
// Insert JSON format is database from SFA Attribute
const insertion4 = (req, res) => {
  var collection;
  connection((db) => {
    collection = db.collection('attribute');
    ////console.log(collection);
  });
  ////console.log(collection);

  var fs = require('fs');
  fs.readFile('uploads/manutanSFA.xml', (err, data) => {
    if (err) throw err;
    // var json = JSON.parse(data);
    var parser = new xml2js.Parser({
      attrkey: 'attribut'
    });
    parser.parseString(data, function(err, result) {
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
          db.collection('attribute').insert(obj['Attribute'], {
            safe: true
          });
        });
      });
      if (err) throw err;
    });
    return true;
  });
};
router.get('/insertion4', (req, res) => {
  if (true === insertion4(req, res)) {
    return res.json('file inserted');
  }
});

/*Insertion des unit transformer en fonction*/

// Insert JSON format is database from SFA Unit
const insertion5 = (req, res) => {
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
      var parser = new xml2js.Parser({
        attrkey: 'attribut'
      });
      parser.parseString(data, function(err, result) {
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
            db.collection('unit').insert(obj1['Unit'], {
              safe: true
            });
          });
        });
        if (err) throw err;
      });
      return true;
    });
  };
  
  router.get('/insertion5', (req, res) => {
    if (true === insertion5(req, res)) {
      return res.json('file inserted');
    }
  });
  



/*==================================================================================================================*/
/*================================resquest sfa + attribut name + unit name==========================================*/
/*==================================================================================================================*/

/* request sfa id + Tag name + name unit */
router.get('/sfa2/:gmc', (req, res) => {

  db.collection("productsmanutan").find({
    "ClassificationReference.attribut.ClassificationID": req.params.gmc
  }, function(err, result) {
    setTimeout(() => {
      res.json(result);
    }, 200);
  });
});

/*==================================================================*/

/*====================services all user + delete user==========================*/

router.get('/alluser', (req, res) => {
  db.collection('users').find({});
});

router.get('/deleteuser/:user', (req, res) => {
  var userlogin = req.params.user;
  db.collection('users').remove({"username" : userlogin});
});

/*get info mapping des attribut*/

//find tag to get all Mapping informations
router.get('/infomappingtag/:idf/:attribut/:structure', (req, res) => {
    var idf = req.params.idf;
    var attribut = req.params.attribut;
    var structure = req.params.structure;
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
