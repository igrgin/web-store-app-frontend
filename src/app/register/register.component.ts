import {Component, OnInit} from '@angular/core';
import {AuthService} from "../service/auth/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup | undefined;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
      password: '',
      first_name:'',
      last_name:''
    })
  }

  onSubmit(): void {

    this.authService.register(this.form?.getRawValue()).subscribe({
      next: _ => {
        this.router.navigate(['/login'])
      },
      error: err => {
        this.errorMessage = err.error.message;
      }
    });

  }


}
