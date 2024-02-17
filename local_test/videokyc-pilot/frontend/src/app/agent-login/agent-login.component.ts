import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppURL } from '../app.url';
import { AuthenticationService } from '../services/authentication.service';
import { alphanumericValidator } from '../utils/alphanumeric.validator';

@Component({
  selector: 'app-agent-login',
  templateUrl: './agent-login.component.html'
})
export class AgentLoginComponent implements OnInit {
  constructor(
    private builder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
  ) {
  }

  public copyRightYear: number = new Date().getFullYear();

  public submitted = false;
  isSessionExpired: boolean;
  private returnUrl: string;

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = this.builder.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(12), alphanumericValidator()]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(12)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    //this.authenticationService.agentLogout(null);
  }

  validate(field: string) {
    if (this.loginForm.get(field).hasError('invalidAlphanumeric')) {
      this.loginForm.controls[field].setErrors({ 'invalidAlphanumeric': true });
    }
  }

  async onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Please enter the user name and password!'
      });
      this.loginForm.markAllAsTouched();
      return;
    } else {
      const ctrls = this.loginForm.controls;

      try {
        let loginSuccess = await this.authenticationService.authenticateUser(ctrls.username.value, ctrls.password.value);
        // redirect to returnUrl from route parameters or default to '/'
        if (loginSuccess) {
          this.router.navigate([AppURL.QueueBoard]);
        } else {
          this.onLoginFailed();
        }

      } catch (error) {
        this.onLoginFailed();
      }
    }
  }

  onLoginFailed() {
    this.messageService.add({
      severity: 'error',
      summary: 'Authentication Failed!',
      detail: "Invalid username or password.!"
    });
  }
}
