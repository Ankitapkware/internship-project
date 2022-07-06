import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public signupForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient,private router: Router) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username: [''],
      firstName: [''],
      email:[''],
      password:['']
    })
  }

  signUp(){
    this.httpClient.post<any>('http://localhost:8080/api/users/addnew', this.signupForm.value)

    .subscribe(result =>{
      alert("Signup Success");
      this.signupForm.reset();
      this.router.navigate(['login']);

    })
  }

}
