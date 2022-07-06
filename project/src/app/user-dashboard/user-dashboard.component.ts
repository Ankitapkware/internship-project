import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subs } from '../subs';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  subjects!: Subs[];
  bbranch!: String;
  searchbranch!: string;

  constructor( private httpClient: HttpClient) { }

  getSubjects(){
    this.httpClient.get<any>('http://localhost:8080/api/subjects').subscribe(
      response => {
        console.log(response);
        this.subjects = response;
      }
    );
  }


  toCse(){
console.log("called");
        var str = "CSE"
        return str.match("CSE");
    
  }

  ngOnInit(): void {
    this.getSubjects();
  }

  searchByBranch(){

    if(this.searchbranch ==""){
      this.ngOnInit();
    }
    else{
      this.subjects=this.subjects.filter(res=>{
        return res.branch.toLocaleUpperCase().match(this.searchbranch.toLocaleUpperCase());
      })
    }
  }

  
  
}
