import {Component, Input, ComponentFactoryResolver, ViewChild, OnInit} from '@angular/core';
import {Directory} from './directory';
import {Classification} from './classification';
import {ClassificationFi} from './classification-fi';

import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { User } from '../model/user';
import {Observable} from 'rxjs/Observable';
@Component({
    selector: 'tree-view',
    templateUrl: './tree-view.html',
    styleUrls  : ['tree-view.css']
})
export class TreeView implements OnInit {
    @Input() directories: Array<Directory>;
    @Input() Classification: Array<Classification>;
    ClassificationFi: Array<ClassificationFi>;
    showIcon = false;
    expanded = false;
    icon = null;
    result: any;
    classification: Classification[] = [];
    classificationFi: ClassificationFi[] = [];
    position = 'right';
    positionprod = 'left';
    ifAdmin: any;
    currentUser: User;
	product:any;
	loading: boolean = false;
	count : number = 1;
	// drag and drop
	test: boolean = false;
    transferData: Object = {id: 1, msg: 'Hello', draw: true};
    receivedData: Array<any> = [];	
    selected : any;
	selectedId : any;
	selectedName : any;
	color : any;
	color3 = 'primary';
	mode = 'indeterminate';
	value = 50;
	idDropped:any;
	idDragged:any;
	restrictedDrop1: any = null;
	idDropped2 : any;
	idDragged2:any;
	color2 : any;
	data: any;
	selectedMapping: any;
	selectedMapping2: any;
	idf :any;
	arrayFiliale : string [] = [ 'filiale1' , 'rapideracking', 'key' , 'pichon' , 'witre' , 'casalsport' , 'ikaros', 'manuco'];
	subject: any;
	content:any;
	destinataire:any;
	creation:any;
	indicateur:any;
	reste : number;
	calcul1:any;
	calcul2:any;
    constructor(private componentResolver: ComponentFactoryResolver,
                private router: Router, private _http: Http){
	this.currentUser = JSON.parse(localStorage.getItem("currentUser"));    
	if (localStorage.getItem('currentUser')) {
           	this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
   	   	//console.log(this.currentUser);
		
        }
	if (localStorage.getItem('ifAdmin') == "true") {
	   this.ifAdmin = true;	
   	   //console.log("tes if "+localStorage.getItem('ifAdmin'));	
	}
   	   //console.log(localStorage.getItem('ifAdmin'));
	
    	}
    ngOnInit(){
		
        console.log("From tree view =>"+this.Classification);        
         this.getAttribut();
	this.getDataFiliale();
	//console.log("loading Finish oninit -- => ",this.loading);
	this.getIndicateur();
    }
    /*expand(){
        this.expanded = !this.expanded;
        this.icon = this.getIcon();
    }*/
    getIcon(cl:any){
        if (cl.showIcon === true) {
          if(cl.expanded){
            return '- ';
          }
          return '+ ';
        }
        return null;
    }
    toggle(cl:Classification){
        console.log("aff =>"+this.classification["0"]);
        cl.icon = '-';
        cl.expanded = !cl.expanded;
        cl.icon = this.getIcon(cl);
    }
    toggle2(cl:any){
        
        cl.expanded = !cl.expanded;
	 //cl.icon = '-';
        cl.icon = this.getIcon(cl);
    }
    toggle3(cl:any){
        
        cl.expanded = !cl.expanded;
	 //cl.icon = '-';
          if(cl.expanded){
            cl.icon = '- ';
          }else
          cl.icon = '+ ';
    }
    getData():void {
        this._http.get("/api/test")
         .subscribe(result =>
            this.result = result.json()
         );
         console.log(this.result);
         
     }
     getResult():void {
         console.log(this.Classification["Classification"]);
         
         
         
     }
     getAttribut():any {
        console.log(this.Classification["0"].Classification);
        
        this.classification = this.Classification["0"].Classification["0"].Classification;
        console.log(this.classification);
        
        // this.classification = this.Classification["Classification"].Classification;
        this.classification["0"].icon = '+';
        for( let cl of this.classification){
           cl.expanded = false;
           cl.checked = false;
           cl.showIcon = true;
           cl.icon = '+';
           for( let cl2 of cl.Classification){
               cl2.expanded = false;
               cl2.checked = false;
               cl2.showIcon = true;
               cl2.icon = '+';
			
			setTimeout(()=>{ cl2.product = this._http.get("/api/sfa2/"+cl2.attribut.ID)
        	.map(product => <any>product.json())        
         	.subscribe(product =>{
	  	 
		if(product != null){
         		//console.log("SFA PROD -- => ",cl2.product.ClassificationReference["0"].attribut.ClassificationID, "GMC lv1 => ",cl2.Name["0"]);	
				cl2.product = product;			
				this.count ++;
				if(cl2.product['0']){
						cl2.product['0'].icon = '+';
					for( let att of cl2.product['0'].AttributeLink){
						att.message = "ID : "+att.attribut.AttributeID+" units "+att.units;
					}
					cl2.product['0'].Product.icon = '+';
					for( let prod of cl2.product['0'].Product){
						prod.icon = '+';
						prod.expanded = false;
                   				prod.checked = false;
                   				prod.showIcon = true;
						//console.log("PRD-",prod);
					}
				}
			}
		})}, 200);

               if(cl2.Classification){
                    for( let cl3 of cl2.Classification){
                   cl3.expanded = false;
                   cl3.checked = false;
                   cl3.showIcon = true;
                   cl3.icon = '+';
		
setTimeout(()=>{ cl3.product = this._http.get("/api/sfa2/"+cl3.attribut.ID)
        	.map(product => <any>product.json())        
         	.subscribe(product =>{
		if(product != null){         	
				cl3.product = product;
				this.count ++;
				if(cl3.product['0']){
						cl3.product['0'].icon = '+';
					for( let att of cl3.product['0'].AttributeLink){
						att.message = "ID : "+att.attribut.AttributeID+" units "+att.units;
					}
					cl3.product['0'].Product.icon = '+';
					for( let prod of cl3.product['0'].Product){
						prod.icon = '+';
						prod.expanded = false;
                   				prod.checked = false;
                   				prod.showIcon = true;
					}
				}
			}
		})}, 200);



		if(cl3.Classification){
                    for( let cl4 of cl3.Classification){
                   cl4.expanded = false;
                   cl4.checked = false;
                   cl4.showIcon = true;
                   cl4.icon = '+';
			setTimeout(()=>{ cl4.product = this._http.get("/api/sfa2/"+cl4.attribut.ID)
        	.map(product => <any>product.json())        
         	.subscribe(product =>{
		if(product != null){
         	//console.log("SFA PROD -- => ",cl4.product, "=> GMC  lv3=>", cl4.Name["0"]);
			cl4.product = product;
				this.count ++;
				if(cl4.product['0']){
						cl4.product['0'].icon = '+';
					for( let att of cl4.product['0'].AttributeLink){
						att.message = "ID : "+att.attribut.AttributeID+" units "+att.units;
					}
					cl4.product['0'].Product.icon = '+';
					for( let prod of cl4.product['0'].Product){
						prod.icon = '+';
						prod.expanded = false;
                   				prod.checked = false;
                   				prod.showIcon = true;
					}
				}

				console.log("count => ",this.count );
				if(this.count > 1626){
               				this.loading = true;
					console.log("count final => ",this.count );
					this.count =0;
				}
			}
		})}, 200);
			
		

	}
		}
                   }
               }
		
           }
               
        }
	console.log("loading Finish -- => ",this.loading);
		
		
	return this.classification;        
    }
    getDataFiliale():void {
	if ( this.arrayFiliale.includes(this.currentUser.structure)) {
        this._http.get('/api/filiale/'+this.currentUser.structure)
        .map(ClassificationFi => <ClassificationFi[]>ClassificationFi.json())        
         .subscribe(ClassificationFi =>{
	   setTimeout(()=>{ this.ClassificationFi = ClassificationFi }, 1000),
	   this.ClassificationFi = ClassificationFi,
         //console.log("FILIALE => ",this.ClassificationFi),
	this.getAttributFi()
	});
        }else{
		this.ClassificationFi = null;	
	}
		
     }
    getAttributFi():any {
        
	//if (( this.currentUser.structure == "filiale1" ) || ( this.currentUser.structure == "manutan")) {
	//	console.log("heho",this.ClassificationFi);
	
        //this.ClassificationFi["0"].icon = '+';
        for( let cl of this.ClassificationFi){
           cl.expanded = false;
           cl.checked = false;
           cl.showIcon = true;
           cl.icon = '+';
	   cl.lvl = 1;
       	   console.log("TEST F",cl);
	   console.log("CL =>",cl.classification);		
           for( let cl2 of cl.classification){
       	   	//console.log("RENTrE",cl2);
               cl2.expanded = false;
               cl2.checked = false;
               cl2.showIcon = true;
               cl2.icon = '+';
		cl2.lvl = 2;
		if(cl2.models){
                   			for( let cl22 of cl2.models){
                   				cl22.expanded = false;
                   				cl22.checked = false;
                   				cl22.showIcon = true;
                  	 			cl22.icon = '+';
						//console.log("=> MIG ", cl22 );
						//Integration d attribut Last level
						if(cl22.products){
							for( let prod2 of cl22.products){
                   					prod2.expanded = false;
                   					prod2.checked = false;
                   					prod2.showIcon = true;
                  	 				prod2.icon = '+';
							
								if(prod2.techattrs){
								prod2.techattrs.icon = '+';
								prod2.techattrs.showIcon = true;								
								for( let att of prod2.techattrs){
									att.idf = prod2.id;
									//console.log("=> ID PRODUIT ", att.idf );
								}
						}
							}
						}
                   			}
	          		}
               if(cl2.classification){
                    for( let cl3 of cl2.classification){
                   cl3.expanded = false;
                   cl3.checked = false;
                   cl3.showIcon = true;
                   cl3.icon = '+';
		   cl3.lvl = 3;
		   if(cl3.models){
                   			for( let cl33 of cl3.models){
                   				cl33.expanded = false;
                   				cl33.checked = false;
                   				cl33.showIcon = true;
                  	 			cl33.icon = '+';
						//console.log("=> Models ", cl33 );
						//Integration d attribut Last level
						if(cl33.products){
							for( let prod1 of cl33.products){
                   					prod1.expanded = false;
                   					prod1.checked = false;
                   					prod1.showIcon = true;
                  	 				prod1.icon = '+';
							console.log("=> PROD ", prod1 );
								if(prod1.techattrs){
								prod1.techattrs.icon = '+';
								prod1.techattrs.showIcon = true;									
								for( let att of prod1.techattrs){
									att.idf = prod1.id;
									//console.log("=> ID PRODUIT ", att.idf );
								}
						}
							}
						}
                   			}
		   }
		   if(cl3.classification){
                   	for( let cl4 of cl3.classification){
                   		cl4.expanded = false;
                   		cl4.checked = false;
                   		cl4.showIcon = true;
                  	 	cl4.icon = '+';
				cl4.lvl = 4;
				if(cl4.models){
                   			for( let cl5 of cl4.models){
                   				cl5.expanded = false;
                   				cl5.checked = false;
                   				cl5.showIcon = true;
                  	 			cl5.icon = '+';
						console.log("=> MIG ", cl5 );
						if(cl5.products){
							for( let prod of cl5.products){
                   					prod.expanded = false;
                   					prod.checked = false;
                   					prod.showIcon = true;
                  	 				prod.icon = '+';
							
							if(prod.techattrs){
								prod.techattrs.icon = '+';
								prod.techattrs.showIcon = true;								
								
								for( let att of prod.techattrs){
									att.idf = prod.id;
									//console.log("=> ID PRODUIT ", att.idf );
								}
								
							}
							}
						}
				
                   			}
	          		}

                   	}
	          }
                }
              }
               
           }
               
        }
	return this.ClassificationFi;
	/*}else{
		this.ClassificationFi = null; 
		return this.ClassificationFi;
	} */   
    }
	getDataSfa(cl:Classification,id:any) {
	
        	return this._http.get("/api/sfa/"+id)
        	.map(product => <any>product.json())        
         	.subscribe(product =>{
	  	 this.product = product

		});
        
		
     }
// Mapping Produit TO SFA
transferDataSuccess($event: any , att: any) {
        
		if(window.confirm('Vous allez mapper '+ $event.dragData.name+ 'avec la SFA: '+ att.Name["0"]+ 'Confirmer le mapping ?')){

			
		
		console.log("=> selcted ", $event.dragData );
		if($event.dragData.techattrs){
			 //if($event.dragData.techattrs.length > 0){
							
								   
			 				$event.dragData.mapped = true;
							

			//}
		}
		else if($event.dragData.products){
			 if($event.dragData.products.length > 0){
				console.log("rentre dans MODELS ");
				///////////////////////////////////////////
				for( let prod of $event.dragData.products){
                   					prod.mapped = true;
							
				}
			}
		}else if($event.dragData.models){
								if($event.dragData.models.length > 0){
									for( let model of $event.dragData.models){
										if(model.products.length > 0){
											for( let prod of model.products){
                   									prod.mapped = true;
											
											}
										}	
                   							}
								}




			}

			if($event.dragData.classification){
			 
			
			 if($event.dragData.classification.length > 0){
				
				for( let cl of $event.dragData.classification){

					if(cl.classification){
						if(cl.classification.length > 0){	
							for( let cl2 of cl.classification){
							            //MODELS HERE
								if(cl2.classification.length > 0){	
									for( let cl3 of cl2.classification){
									
									if(cl3.models.length > 0){
										for( let model of cl3.models){
											if(model.products.length > 0){
												for( let prod of model.products){
                   											prod.mapped = true;
												
												}
											}	
                   								}
									}
									}	
		
								}

							
								else if(cl2.models){
									if(cl2.models.length > 0){
										for( let model of cl2.models){
											if(model.products.length > 0){
												for( let prod of model.products){
                   											prod.mapped = true;
											
												}
											}	
                   								}
									}
							
								}
							}
						}
					}
					if(cl.models){
						if(cl.models.length > 0){
						for( let model of cl.models){
							if(model.products.length > 0){
								for( let prod of model.products){
                   							prod.mapped = true;
									
								}
							}	
                   					
						}
						}
					}
			//Bien
				}
			
			}
		} 

 
		
	
        this.test = true;
	 let mapp = {idf : null , idsfa : null , namesfa : null, username : null};
	mapp.idf = $event.dragData.id;
	mapp.idsfa = att.attribut.ID;
	mapp.username = this.currentUser.username;
	mapp.namesfa = att.Name["0"];

	this.color = 'cyan';
	this.idDragged = $event.dragData.id;
	this.idDropped = att.attribut.ID;
	//this.selected = "Mapping success : classification : "+ mapp.idf +" attribut: "+ mapp.idsfa;
	//att.mapped = true;
	var headers = new Headers();
    	headers.append('content-type','application/json');

	$event.dragData.mapped = true;
	
    	this._http.post('/api/mappingsfa', JSON.stringify(mapp), {headers:headers})
	.subscribe(data => {

		if((<any>data).json() !=null){
               		this.data = (<any>data).json();
 			console.log("=> ",this.data);
			

		}
                
            });
	//this.getIndicateur();
	}
    }	

getSelectedNode(id:any, name: any){
	this.selected = null;
	this.selectedId = id;
	this.selectedName = name;
	this.subject = this.currentUser.structure+" : Demande de création SFA pour : "+this.selectedName;
	this.content = "Bonjour%0A%0ANous souhaitons la création d'une SFA pour le produit "+this.selectedName+".%0A%0AVos commentaires.%0A%0ACordialement.";
	this.destinataire = "GRP_STEP_ROLLOUT";
	this.creation ="Demande de creation d'une SFA";
	this.selectedMapping = null;
	console.log("cc",id,"  ==> ", name);
	this.getIndicateur();
} 
getSelectedNode2(id:any, idf:any, name: any){
	this.selected = null;
	this.selectedId = id;
	this.selectedName = name;

	this._http.get('/api/infomapping1/'+idf+"/"+this.currentUser.structure)
    	.subscribe(data => {
		if((<any>data).json() !=null){
			let infosfa = null;
			infosfa= (<any>data).json();
 			console.log("=>SFA  : ",infosfa);
		   this.content = "Bonjour%0A%0ANous souhaitons la création d'un TAG pour:  "+this.selectedName+"("+this.selectedId+"). dans la SFA "+infosfa.namesfa+"("+infosfa.idsfa+")%0A%0AVos commentaires.%0A%0ACordialement.";
		 	this.subject = this.currentUser.structure+" : Demande de création de TAG pour : "+this.selectedName;
			this.destinataire = "GRP_STEP_ROLLOUT";
			this.creation ="Demande de creation d'un TAG";
			this.selectedMapping = null;
			this.selectedMapping2 = null;
		}else{
			this.content = "Bonjour%0A%0ANous souhaitons la création d'un TAG pour:  "+this.selectedName+"("+this.selectedId+").%0A%0AVos commentaires.%0A%0ACordialement.";
		 	this.subject = this.currentUser.structure+" : Demande de création de TAG pour : "+this.selectedName;
			this.destinataire = "GRP_STEP_ROLLOUT";
			this.creation = null;
			this.selectedMapping = null;
			this.selectedMapping2 = null;
				
		}
                
            	});

	
	console.log("cc",id,"  ==> ", name);
} 
// Mapping Produit TO SFA
transferDataSuccess2($event: any , att: any , sfa:any) {
	if(window.confirm('Vous allez mapper '+ $event.dragData.name+ 'Confirmer le mapping ?')){
       		
        	this.test = true;
	 	let mapp2 = {idf : null , idtagf : null , idsfa : null , idtaggmc : null, nametaggmc: null, user : null};
		mapp2.idf = $event.dragData.idf;
		mapp2.idtagf = $event.dragData.id;
		mapp2.idsfa = sfa.attribut.ID;
		mapp2.idtaggmc = att.attribut.AttributeID;
		mapp2.nametaggmc = att.name;
		mapp2.user = this.currentUser.username;

        	//this.receivedData.push(mapp);
		this.color2 = 'orange';
		//this.idDragged = $event.dragData;
		this.idDropped2 = att;
		this.idDragged2 = $event.dragData;
		
		
		
		var headers = new Headers();
    	headers.append('content-type','application/json');
		this._http.post('/api/mappingtag', JSON.stringify(mapp2), {headers:headers})
		.subscribe(data => {
					   this.data = (<any>data).json();
					   if(this.data == true){
						//att.mapped = true;
						$event.dragData.mapped = true;
						this.getIndicateur();
						console.log("=> MAPPING TAG DONE");
					}else
						alert("=> NOT mapped");
			 console.log("=> ",this.data);
			 
			/*if(this.data._body == "true"){
			
			} */
                
            	});
	

        	console.log("EVENT => ",mapp2);

	}
    } 

 getInfoMapping(product:any){
	
	

	this.selected = null;
	this.selectedId = product.id;
	this.selectedName = null;
	//this.selectedMapping =  {_id : null , idf : null , idsfa : null , user : null , structure : null , date : null, statut : null};
	this._http.get('/api/infomapping1/'+product.id+"/"+this.currentUser.structure)
    	.subscribe(data => {
			if(data !=null){
               			//this.selectedMapping = (<any>data)._body;
				this.selectedMapping = (<any>data).json();
				this.selectedMapping2 = null;
				this.getIndicateur();	
 				console.log("=> ",data);
			}
                
            	});

} 
getInfoMapping2(att:any){

	let model = {idf : null , idtagf : null , structure : null};
		model.idf = att.idf;
		model.idtagf = att.id;
		model.structure = this.currentUser.structure;
	this.selected = null;
	this.selectedId = null;
	this.selectedName = att.name;
	this.selectedMapping = null;
	console.log("=> Rentre La", model);
	var headers = new Headers();
    	headers.append('content-type','application/json');
	this._http.post('/api/infomappingtag', JSON.stringify(model), {headers:headers})
    	.subscribe(data => {
			if(data !=null){
				console.log("=data received ",data);
				this.selectedMapping2 = (<any>data).json();
					
 				console.log("=TAG infos> ",this.selectedMapping2);
			}
                
            	});

} 
deleteMapping(product:any){	
	if(window.confirm('Vous allez supprimer le mapping du Produit '+ product.name+ ' ?')){
	let model = {idf : null , idtagf : null , username : null};
		model.idf = product.id;
		model.idtagf = 1;
		model.username = this.currentUser.username;
	console.log("=> delete Mapping",this.currentUser.username);
	product.mapped =false;
	this.selectedMapping = null;
		if(product.techattrs){
			for( let att of product.techattrs){
			att.mapped = false;
			//this.getIndicateur();
			console.log("=> ALL ATT Non Mappés" );
			}
		}
	var headers = new Headers();
    	headers.append('content-type','application/json');
	this._http.post('/api/mappingdelete', JSON.stringify(model), {headers:headers})
    	.subscribe(data => {
			//if(data !=null){

				this.getIndicateur();
					
 				console.log("=>deleted " );
			//}
                
            	});
	this.getIndicateur();
	this.getSelectedNode(product.id, product.name);
	}
}

getIndicateur() {
	
        	return this._http.get("/api/indicateur/"+this.currentUser.structure)
        	.map(indicateur => <any>indicateur.json())        
         	.subscribe(indicateur =>{
	  	 //setTimeout(()=>{ this.product = product }, 2000),
	  	 this.indicateur = indicateur,
		this.reste = this.indicateur[1]-this.indicateur[0];
		this.calcul1 = (this.indicateur[0]/this.indicateur[1])*100;
		this.calcul2 = (this.indicateur[2]/this.indicateur[3])*100;
         	console.log("Indicateur Mapping=> ",this.indicateur)

		});
        
}		

deleteMapping2(product:any){	
	
	
}
redirection(pr : any){
	console.log("lien=> ",pr);
	if(pr.Values["0"]){
		
		if(pr.Values["0"].Value["0"]){
		console.log("lien2=> ",pr.Values["0"].Value["0"]._);
		window.open(pr.Values["0"].Value["0"]._);
		}
	}
	
}
deleteMappinglevel(cl:any){
	if(window.confirm('Vous allez tout les mapping du Noeud '+ cl.name+ ' ?')){
	let model = {idf : null , idtagf : null , username : null};
		model.idf = cl.id;
		model.idtagf = 1;
		model.username = this.currentUser.username;
	console.log("=> delete Mapping",this.currentUser.username);
	this.selectedMapping = null;
	if(cl.models){
		if(cl.models.length > 0){
			for( let model of cl.models){
				if(model.products.length > 0){
					for( let prod of model.products){
                   				prod.mapped = false;
						if(prod.techattrs){
							for( let att of prod.techattrs){
								att.mapped = false;
								//console.log("=> ALL ATT Non Mappés" );
							}
						}
					}
				}	
                  	}
		}
	}
	if((cl.classification)){
		console.log("=> click ",cl.name);
		if(cl.classification.length > 0){
			for( let cl2 of cl.classification){
							console.log("=> lvl2 ",cl2.name);
								if(cl2.models.length > 0){
									for( let model of cl2.models){
										if(model.products.length > 0){
											for( let prod of model.products){
                   										prod.mapped = false;
												if(prod.techattrs){
													for( let att of prod.techattrs){
														att.mapped = false;
														console.log("=> ALL ATT Non Mappés" );
													}
												}
											}
										}	
                   							}
								}		
								 if(cl2.classification.length > 0){
									for( let cl3 of cl2.classification){
										console.log("=> lvl3 ",cl3.name);
										
										if(cl3.models.length > 0){
												
											for( let model of cl3.models){
											if(model.products.length > 0){
												for( let prod of model.products){
                   											prod.mapped = false;	
													console.log("=> Mapp here",model.name);
													if(prod.techattrs){
																for( let att of prod.techattrs){
																	att.mapped = false;
																	console.log("=> ALL ATT Non Mappés" );
																}
													}
												}
											}	
                   									}
										}if(cl3.classification.length > 0){
											for( let cl4 of cl3.classification){
												console.log("=> lvl4 ",cl4.name);
											if(cl4.models.length > 0){
												for( let model of cl4.models){
													if(model.products.length > 0){
														for( let prod of model.products){
                   													prod.mapped = false;
															console.log("=> HERE ");
															if(prod.techattrs){
																for( let att of prod.techattrs){
																	att.mapped = false;
																	console.log("=> ALL ATT Non Mappés" );
																}
															}
														}
													}	
                   										}
											}
											}	
										
	
                   							}
									}
								}	

			}	
		
		}
	}
	
	var headers = new Headers();
    	headers.append('content-type','application/json');
	this._http.post('/api/mappingdelete', JSON.stringify(model), {headers:headers})
    	.subscribe(data => {
			//if(data !=null){

				this.getIndicateur();
					
 				console.log("=>deleted " );
			//}
                
            	});
	this.getSelectedNode(cl.id, cl.name);
	}
	
}

refresh(){
		this.ClassificationFi = null;
		this.getDataFiliale();
}
}
