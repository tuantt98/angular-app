import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
})
export class AuthComponent {

  isLoginMode = true;
  isLoading = false;
  error: string = ''

  constructor(private authService: AuthService) { }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return
    }

    this.isLoading = true;
    const { email, password } = form.value;

    if (!this.isLoginMode) {
      // sign up
      this.authService
        .signUp(email, password)
        .subscribe(response => {
          console.log(response);
          this.isLoading = false;
        },
        error => {
          console.log(error);
          this.error = 'Something went wrong';
          this.isLoading = false;
        }
        );
    }

    form.reset();
  }
}
