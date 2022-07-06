import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  public loginForm!: FormGroup;
  constructor(private formBuilder : FormBuilder, private http: HttpClient, private router: Router){}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username:[''],
      password:[''],
    })
    
  }

  login(){
    console.log('entered');

    this.http.get<any>("http://localhost:8080/api/users")
    .subscribe(res=>{
      console.log('entered');

      const user = res.find((a:any)=>{
        return a.username === this.loginForm.value.username && a.password === this.loginForm.value.password
      });

      if(user){
        alert('Login success!');
        
        this.router.navigate(['user']);
      }
      else if(this.loginForm.value.username==="admin" && this.loginForm.value.password==="admin"){
        this.router.navigate(['admin']);

      }


      else
      alert('User not found!');
      this.loginForm.reset();

    },
    err=>{
      alert('Something went wrong!');
      this.loginForm.reset();

    })
  }
}
