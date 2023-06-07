import {Component, OnInit} from '@angular/core';
import {AuthService} from "../service/auth/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastService} from "../service/toast/toast.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup | undefined;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router,private toastService:ToastService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
      password: ''
    })
  }

  onSubmit(): void {

    this.authService.login(this.form?.getRawValue()).subscribe({
      next: _ => {
        this.toastService.showSuccess("Success","You've been successfully logged in.")
        this.router.navigate(['home']);
      },
      error: err => {
        this.toastService.showError("An error occurred","There was a problem while logging you in. " +
          "Please try again.")
        this.errorMessage = err.error.message;
      }
    });

  }

}
