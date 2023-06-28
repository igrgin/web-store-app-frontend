import {Component, OnInit} from '@angular/core';
import {AuthService} from "../service/auth/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {Validators} from '@angular/forms';
import {StorageService} from "../service/storage/storage.service";
import {ToastService} from "../service/toast/toast.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup | undefined;
  errorMessage = '';

  constructor(private authService: AuthService, private router:Router,  private toastService:ToastService, private storageService:StorageService, private formBuilder: FormBuilder) { }

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
        this.authService.user=undefined
        console.log("g")
        this.storageService.cleanRefreshToken()
        this.storageService.cleanAccessToken()
        this.router.navigate(['login'])
        this.toastService.showSuccess("Successfully Registered", "You can now login.")
      },
      error: err => {
        this.toastService.showError("An error occurred", "There was a problem while registering you. " +
          "Please try again.")
        this.errorMessage = err.error.message;
      }
    });

  }


}
