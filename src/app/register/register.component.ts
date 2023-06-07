import {Component, OnInit} from '@angular/core';
import {AuthService} from "../service/auth/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {Validators} from '@angular/forms';

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
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(?:\\.[a-zA-Z]{2,})?$")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}|^(?=.*\\d)(?=.*[A-Z])(?=.*\\W).{8,}|^(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,}|^(?=.*[a-z])(?=.*\\d)(?=.*\\W).{8,}$")]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required]
    })
  }

  onSubmit(): void {
    if (this.form && this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authService.register(this.form?.getRawValue()).subscribe({
      next: _ => {
        this.router.navigate(['login'])
      },
      error: err => {
        this.errorMessage = err.error.message;
      }
    });

  }


}
