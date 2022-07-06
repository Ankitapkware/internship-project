import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { StudentsClass } from './StudentsClass';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  closeResult!: String;
  student!: StudentsClass[];
  stud! : StudentsClass;  
  deleteId!: number;

  updateForm! : FormGroup;
  
  constructor(
    private httpClient: HttpClient, 
    private modalService : NgbModal,
    private fb: FormBuilder
    ) {}
 

  getSubjects(){
    this.httpClient.get<any>('http://localhost:8080/api/users').subscribe(
      response => {
        console.log(response);
        this.student = response;
      }
    );
  }

  ngOnInit(): void {
    
   this.getSubjects();
   this.updateForm = this.fb.group({
     
     id: [''],
     username: [''],
     firstName: [''],
     email: ['']
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
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

  openUpdate(targetModal: any, student: StudentsClass) {
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
    console.log("reached value");

    this.updateForm.patchValue( {
      id: student.id,
      username: student.username, 
      firstName: student.firstName,
      email: student.email,
      password: student.password,
      
    });
  }

  onSave() {
    console.log("ask value");
    const updateURL = 'http://localhost:8080/api/users/'+ this.updateForm.value.id+'/update' ;
    console.log(this.updateForm.value);
    this.httpClient.post(updateURL, this.updateForm.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  openDelete(targetModal: any, student: StudentsClass) {
    this.deleteId = student.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  onDelete() {
    const deleteURL = 'http://localhost:8080/api/users/' + this.deleteId + '/delete';
    console.log("reached");

    this.httpClient.delete(deleteURL)
          .subscribe((results) => {
        this.ngOnInit();
        console.log("refreshed");
        this.modalService.dismissAll();

      });
  }
  
}


