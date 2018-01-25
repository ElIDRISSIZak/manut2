import { Component } from '@angular/core';
import {Location} from '@angular/common';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AdminService } from './admin.service';
// uploading File
import { FileUploader } from 'ng2-file-upload';
import { User } from '../model/user';
@Component({
  selector: 'admin-app',
  templateUrl: './admin.component.html'
})
export class AdminComponent {
  result : any;
  sfa: any;	
  data : any;
  public uploader:FileUploader = new FileUploader({url:'/api/upload'});
  currentUser:User;
	arrayFiliale : string [] = [ 'filiale1' , 'Rapide Racking', 'Key' , 'Pichon' , 'Witre' , 'Casal Sport' , 'Ikaros', 'manuco'];
  constructor(private _http: Http ,private _adminService: AdminService , private router: Router , private _location: Location ) {
	if (localStorage.getItem('ifAdmin') != "true") {

	   // this._location.back();
	}
	this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
  }
   backClicked() {
        this._location.back();
    }
   insertion(){
	var number = 0;

	
	if (this.currentUser.structure == "manutan") {
	
		for( let item of this.uploader.queue ){
			if((item.file.name.includes("manutanGMC") && item.file.type == "text/xml" ) && item.isSuccess == true){
		        console.log("GOOOD"); 
			number++;
			
			}
			else if((item.file.name.includes("manutanSFA") && item.file.type == "text/xml" ) && item.isSuccess == true){
		        console.log("GOOOD"); 
			number++;
			
			}
		

			else if(item.isSuccess == false){
			alert("Erreur : Veuillez charger le fichier tout d'abord");
			}

			console.log("=>", this.result);
		}
		if(number == 2){
			confirm("Integration données MANUTAN GMC et SFA ");
			this._http.get("/api/insertion")
      				.map(result => this.result = result.json().data)
				.subscribe(res => this.result = res);
			this._http.get("/api/insertionsfa")
      				.map(sfa => this.sfa = sfa.json().data)
				.subscribe(sfa => this.sfa = sfa );		
			alert("Données MANUTAN Bien Chargés!");
			window.location.reload();	
		}else
			alert("Veuillez charger les deux fichiers MANUTAN GMC et SFA ");
	}else {
		
		
		for( let item of this.uploader.queue ){
			if(item.file.name.includes(this.currentUser.structure) && item.isSuccess == true){
			let model = {structure : null , filename : null};
			model.structure = this.currentUser.structure;
			model.filename = item.file.name;
			console.log("=>  filename csv =>",model.filename);
			
			var headers = new Headers();
	    		headers.append('content-type','application/json');

		        this._http.post('/api/csv', JSON.stringify(model), {headers:headers})
			.subscribe(data => {
              		 this.data = data;
 				console.log("=> ",this.data._body);
            			});

				alert("Fichier bien chargé");
			}else if(item.isSuccess == false){
				alert("Erreur : Veuillez charger le fichier tout d'abord");
			}
			else{
				alert("Erreur : Veuillez charger le fichier de filiale ");
			}
			console.log("=>", this.result);
		}
	}
	
}
    
   uploadAll(){
	if (this.currentUser.structure == "manutan") {
		for( let item of this.uploader.queue ){
			if(item.file.name.includes("filiale1") || item.file.name == "api2.js" ||
			(item.file.name.includes("manutanGMC") && item.file.type == "text/xml" ) ||
			(item.file.name.includes("manutanSFA") && item.file.type == "text/xml" )  ){
			item.upload();
			}
			else{
				item.isError = true;	
			}
		}
	}else {
		 
		for( let item of this.uploader.queue ){
			//console.log("TEST ARRAY FILIALE  => ", this.arrayFiliale.includes(item.file.name)); 
			if(item.file.name.includes(this.currentUser.structure)){
				item.upload();
			}else{
				item.isError = true;	
			}
		}
	}
	
   }
   upload(item : any){
	if (this.currentUser.structure == "manutan") {
		if(item.file.name == "api2.js" || item.file.name.includes("manutanGMC") || item.file.name.includes("manutanSFA")){
			item.upload();
		}else{
			item.isError = true;	
		}
	}else if (item.file.name.includes(this.currentUser.structure)){
		item.upload();
	}else
		item.isError = true;
	
   }	
  
  
}
