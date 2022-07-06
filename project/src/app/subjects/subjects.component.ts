import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subs } from '../subs';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {

  closeResult!: String;
  subjects!: Subs[];
  sub! : Subs;  
  deleteId!: number;
  updateForm! : FormGroup;
  
  constructor(
    private httpClient: HttpClient, 
    private router:Router, 
    private modalService : NgbModal,
    private fb: FormBuilder
    ) {}

  getSubjects(){
    this.httpClient.get<any>('http://localhost:8080/api/subjects').subscribe(
      response => {
        console.log(response);
        this.subjects = response;
      }
    );
  }

  ngOnInit(): void {
   this.getSubjects();
   this.updateForm = this.fb.group({
     sId: [''],
     id: [''],
     name: [''],
     branch: [''],
     price: ['']
   })
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(f: NgForm) {
    const url = 'http://localhost:8080/api/subjects/addnew';
    this.httpClient.post(url, f.value)
      .subscribe((result)  => {
        this.ngOnInit(); 
      });
    this.modalService.dismissAll(); 
  }

  openUpdate(targetModal: any, subject: Subs) {
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
    console.log("reached value");

    this.updateForm.patchValue( {
      sId: subject.sId,
      id: subject.id, 
      name: subject.name,
      branch: subject.branch,
      price: subject.price,
      
    });
  }

  onSave() {
    console.log("ask value");
    const updateURL = 'http://localhost:8080/api/subjects/'+ this.updateForm.value.sId+'/update' ;
    console.log(this.updateForm.value);
    this.httpClient.post(updateURL, this.updateForm.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  openDelete(targetModal: any, subject: Subs) {
    this.deleteId = subject.sId;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  onDelete() {
    const deleteURL = 'http://localhost:8080/api/subjects/' + this.deleteId + '/delete';
    console.log("reached");

    this.httpClient.delete(deleteURL)
    
      .subscribe((results) => {
        this.ngOnInit();
        console.log("refreshed");
        this.modalService.dismissAll();

      });
  }
  
}


