import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthSignalStore } from '../../core/stores/auth-signal.store';
import { SnackService } from '../../core/services/snack.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule],
  template: `
    <section class="auth-page">
      <div class="auth-bg" aria-hidden="true"></div>
      <div class="auth-card">
        <div class="auth-brand"><span>R</span> RasoiSathi <em>AI</em></div>
        <h1>Welcome back</h1>
        <p class="auth-sub">Sign in to access your favorites and recipe history</p>

        <form class="form" [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <mat-icon matPrefix>mail</mat-icon>
            <input matInput formControlName="email" autocomplete="email" />
            @if (form.controls.email.touched && form.controls.email.invalid) {
              <mat-error>Enter a valid email address</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <mat-icon matPrefix>lock</mat-icon>
            <input matInput [type]="showPassword() ? 'text' : 'password'" formControlName="password" autocomplete="current-password" />
            <button mat-icon-button matSuffix type="button" (click)="showPassword.set(!showPassword())" aria-label="Toggle password visibility">
              <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (form.controls.password.touched && form.controls.password.invalid) {
              <mat-error>Password is required</mat-error>
            }
          </mat-form-field>

          <div class="row-between">
            <label class="remember"><input type="checkbox" formControlName="rememberMe" /> Remember me</label>
            <a class="forgot" href="javascript:void(0)" (click)="forgotPassword()">Forgot password?</a>
          </div>

          <button mat-flat-button color="primary" class="submit-btn" [disabled]="form.invalid || loading()">
            @if (loading()) { <mat-spinner diameter="20" /> }
            @else { <ng-container><mat-icon>login</mat-icon> Login</ng-container> }
          </button>
        </form>

        <p class="switch">New user? <a routerLink="/register">Create an account</a></p>
      </div>
    </section>
  `,
  styles: [`
    .auth-page { display: grid; min-height: calc(100vh - 140px); overflow: hidden; place-items: center; position: relative; padding: 32px 16px; }
    .auth-bg {
      background: linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(99,102,241,0.08) 100%),
        url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1920&q=80') center/cover;
      inset: 0;
      position: absolute;
      z-index: 0;
    }
    .auth-bg::after { background: rgba(255,255,255,0.75); content: ''; inset: 0; position: absolute; }
    .auth-card {
      backdrop-filter: blur(20px);
      background: var(--glass);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      padding: clamp(32px, 5vw, 44px);
      position: relative;
      width: min(100%, 440px);
      z-index: 1;
    }
    .auth-brand { align-items: center; display: inline-flex; font-weight: 800; gap: 8px; margin-bottom: 24px; }
    .auth-brand span { background: linear-gradient(135deg, var(--primary), var(--primary-light)); border-radius: 10px; color: #fff; display: grid; height: 36px; place-items: center; width: 36px; }
    .auth-brand em { color: var(--primary); font-style: normal; }
    .auth-card h1 { font-size: 1.75rem; font-weight: 800; margin: 0 0 6px; }
    .auth-sub { color: var(--muted); margin: 0 0 28px; }
    .form { display: grid; gap: 4px; }
    .row-between { align-items: center; display: flex; font-size: 0.88rem; justify-content: space-between; margin: 4px 0 12px; }
    .remember { align-items: center; color: var(--muted); display: flex; gap: 6px; }
    .forgot { color: var(--primary); font-weight: 600; text-decoration: none; }
    .submit-btn { height: 48px; width: 100%; }
    .submit-btn mat-spinner ::ng-deep circle { stroke: #fff; }
    .switch { color: var(--muted); margin: 24px 0 0; text-align: center; }
    .switch a { color: var(--primary); font-weight: 700; text-decoration: none; }
  `]
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthSignalStore);
  private router = inject(Router);
  private snack = inject(SnackService);
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  });
  showPassword = signal(false);
  loading = signal(false);

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const { rememberMe, ...credentials } = this.form.getRawValue();
    this.auth.login(credentials).subscribe({
      next: () => { this.snack.show('Welcome back!'); this.router.navigate(['/search']); },
      error: () => this.loading.set(false)
    });
  }

  forgotPassword(): void {
    this.snack.show('Password reset coming soon — contact support for now.');
  }
}
