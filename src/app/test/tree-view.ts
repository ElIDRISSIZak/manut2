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
	idDropped:any;
	idDragged:any;
	restrictedDrop1: any = null;
	idDropped2 : any;
	idDragged2:any;
	color2 : any;
	data: any;
	arrayFiliale : string [] = [ 'filiale1' , 'Rapide Racking', 'Key' , 'Pichon' , 'Witre' , 'Casal Sport' , 'Ikaros', 'manuco'];
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
        cl.icon = this.getIcon(cl);
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
					for( let att of cl2.product['0'].AttributeLink){
						att.message = "ID : "+att.attribut.AttributeID+" units "+att.units;
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
				console.log("count => ",this.count );
				if(this.count == 1826){
               				this.loading = true;
					console.log("count final => ",this.count );
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
	if ( ((localStorage.getItem('ifAdmin') == "true")) && (( this.arrayFiliale.includes(this.currentUser.structure)) || ( this.currentUser.structure == "manutan"))) {
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
       	   	console.log("RENTrE",cl2);
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
						console.log("=> MIG ", cl22 );
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
						console.log("=> Models ", cl33 );
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
							console.log("=> PROD ", prod );
							if(prod.techattrs){
								prod.techattrs.icon = '+';
								prod.techattrs.showIcon = true;								
								
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
	  	 //setTimeout(()=>{ this.product = product }, 2000),
	  	 this.product = product,
         	console.log("SFA PROD => ",this.product)

		});
        
		
     }
// Mapping Produit TO SFA
transferDataSuccess($event: any , att: any) {
        
		if(window.confirm('Vous allez mapper '+ $event.dragData.name+ 'avec la SFA: '+ att.Name["0"]+ 'Confirmer le mapping ?')){

			
		
		console.log("=> selcted ", $event.dragData );
		if($event.dragData.techattrs){
			 //if($event.dragData.techattrs.length > 0){
                   					$event.dragData.mapped = true;
							console.log("=> PROD MAPPED ", $event.dragData );
				
			//}
		}
		else if($event.dragData.products){
			 if($event.dragData.products.length > 0){
				console.log("rentre dans MODELS ");
				///////////////////////////////////////////
				for( let prod of $event.dragData.products){
                   					prod.mapped = true;
							console.log("=> PROD MAPp from model", prod );
				}
			}
		}else if($event.dragData.models){
								if($event.dragData.models.length > 0){
									for( let model of $event.dragData.models){
										if(model.products.length > 0){
											for( let prod of model.products){
                   									prod.mapped = true;
											console.log("=> X", prod );
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
							if(cl2.classification){             //MODELS HERE
								if(cl2.classification.length > 0){	
								for( let cl3 of cl2.classification){
									console.log("=> classif", cl3 );
								if(cl3.models.length > 0){
									for( let model of cl3.models){
										if(model.products.length > 0){
											for( let prod of model.products){
                   										prod.mapped = true;
												console.log("=> L1", prod );
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
											console.log("=> L2", prod );
											}
										}	
                   							}
								}
						}}}		}
					}if(cl.models){
						if(cl.models.length > 0){
						for( let model of cl.models){
							if(model.products.length > 0){
								for( let prod of model.products){
                   							prod.mapped = true;
									console.log("=> L3", prod );
								}
							}	
                   					
						}
						}
					}

				}
			
			}
		} 



			/*else if($event.dragData.models.length > 0){
				
				for( let model of $event.dragData.models){
                   			if(model.products.length > 0){

						for( let prod of model.products){
                   					prod.mapped = true;
							console.log("=> PROD MAPp from last classif", prod );
						}
					}

				}
			}*/
			
		/*}else if($event.dragData.classification){
			 if($event.dragData.classification.length > 0){
				
				for( let cl of $event.dragData.classification){
                   			if(cl.models.length > 0){

						for( let model of cl.models){
							if(model.products.length > 0){
								for( let prod of model.products){
                   							prod.mapped = true;
									console.log("=> PROD MAPp from last classif", prod );
								}
							}	
                   					
						}
					}

				}
			}
		} */
 
		
	
        this.test = true;
	 let mapp = {idf : null , idsfa : null , username : null};
	mapp.idf = $event.dragData.id;
	mapp.idsfa = att.attribut.ID;
	mapp.username = this.currentUser.username;
        //this.receivedData.push(mapp);
	this.color = 'cyan';
	this.idDragged = $event.dragData.id;
	this.idDropped = att.attribut.ID;
	this.selected = "Mapping success : classification : "+ mapp.idf +" attribut: "+ mapp.idsfa;
	
	var headers = new Headers();
    	headers.append('content-type','application/json');

	$event.dragData.mapped = true;
	att.mapped = true;
    	this._http.post('/api/mappingsfa', JSON.stringify(mapp), {headers:headers})
	.subscribe(data => {
               this.data = data;
 		console.log("=> ",this.data._body);
		/*if(this.data._body == "true"){
			
		} */
                
            });

	}
    }	
getSelectedNode(id:any, name: any){
	this.selected = null;
	this.selectedId = id;
	this.selectedName = name;
	console.log("cc",id,"  ==> ", name);
} 
// Mapping Produit TO SFA
transferDataSuccess2($event: any , att: any) {
        alert("Mapping Type 2: Success");
        this.test = true;
	 let mapp2 = {attribut : null , attributsfa : null , status : "en cours"};
	mapp2.attribut = $event.dragData;
	mapp2.attributsfa = att;
	mapp2.status = 'en cours';
        //this.receivedData.push(mapp);
	this.color2 = 'orange';
	//this.idDragged = $event.dragData;
	this.idDropped2 = att;
	this.idDragged2 = $event.dragData;
	//this.selected = "Mapping success : classification : "+ mapp.classification_id +" attribut: "+ mapp.sfa+" status : "+mapp.status; 
        console.log("EVENT => ",this.idDragged2);
    } 

  
}
