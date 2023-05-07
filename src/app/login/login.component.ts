import {Component, OnInit} from '@angular/core';
import {AuthService} from "../service/auth/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup | undefined;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
      password: ''
    })
  }

  onSubmit(): void {

    this.authService.login(this.form?.getRawValue()).subscribe({
      next: _ => {
        this.router.navigate(['/home']);
      },
      error: err => {
        this.errorMessage = err.error.message;
      }
    });

  }

}
