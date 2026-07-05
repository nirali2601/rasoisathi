import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthSignalStore } from '../../core/stores/auth-signal.store';
import { SnackService } from '../../core/services/snack.service';

const strong = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
function samePassword(control: AbstractControl) { return control.value.password === control.value.confirmPassword ? null : { mismatch: true }; }

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule],
  template: `
    <section class="auth-page">
      <div class="auth-bg" aria-hidden="true"></div>
      <div class="auth-card">
        <div class="auth-brand"><span>R</span> RasoiSathi <em>AI</em></div>
        <h1>Create your account</h1>
        <p class="auth-sub">Join thousands of home cooks discovering recipes with AI</p>

        <form class="form" [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline">
            <mat-label>Full Name</mat-label>
            <mat-icon matPrefix>person</mat-icon>
            <input matInput formControlName="name" autocomplete="name" />
          </mat-form-field>

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
            <input matInput [type]="showPassword() ? 'text' : 'password'" formControlName="password" autocomplete="new-password" />
            <button mat-icon-button matSuffix type="button" (click)="showPassword.set(!showPassword())" aria-label="Toggle password visibility">
              <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-hint>8+ chars, uppercase, number, special character</mat-hint>
            @if (form.controls.password.touched && form.controls.password.invalid) {
              <mat-error>Password doesn't meet requirements</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Confirm Password</mat-label>
            <mat-icon matPrefix>lock</mat-icon>
            <input matInput [type]="showConfirm() ? 'text' : 'password'" formControlName="confirmPassword" autocomplete="new-password" />
            <button mat-icon-button matSuffix type="button" (click)="showConfirm.set(!showConfirm())" aria-label="Toggle password visibility">
              <mat-icon>{{ showConfirm() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (form.controls.confirmPassword.touched && form.errors?.['mismatch']) {
              <mat-error>Passwords do not match</mat-error>
            }
          </mat-form-field>

          <button mat-flat-button color="primary" class="submit-btn" [disabled]="form.invalid || loading()">
            @if (loading()) { <mat-spinner diameter="20" /> }
            @else { <ng-container><mat-icon>person_add</mat-icon> Create Account</ng-container> }
          </button>
        </form>

        <p class="switch">Already registered? <a routerLink="/login">Login here</a></p>
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
      width: min(100%, 480px);
      z-index: 1;
    }
    .auth-brand { align-items: center; display: inline-flex; font-weight: 800; gap: 8px; margin-bottom: 24px; }
    .auth-brand span { background: linear-gradient(135deg, var(--primary), var(--primary-light)); border-radius: 10px; color: #fff; display: grid; height: 36px; place-items: center; width: 36px; }
    .auth-brand em { color: var(--primary); font-style: normal; }
    .auth-card h1 { font-size: 1.75rem; font-weight: 800; margin: 0 0 6px; }
    .auth-sub { color: var(--muted); margin: 0 0 28px; }
    .form { display: grid; gap: 4px; }
    .submit-btn { height: 48px; margin-top: 8px; width: 100%; }
    .submit-btn mat-spinner ::ng-deep circle { stroke: #fff; }
    .switch { color: var(--muted); margin: 24px 0 0; text-align: center; }
    .switch a { color: var(--primary); font-weight: 700; text-decoration: none; }
  `]
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthSignalStore);
  private router = inject(Router);
  private snack = inject(SnackService);
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(strong)]],
    confirmPassword: ['', Validators.required]
  }, { validators: samePassword });
  showPassword = signal(false);
  showConfirm = signal(false);
  loading = signal(false);

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const { confirmPassword, ...data } = this.form.getRawValue();
    this.auth.register(data).subscribe({
      next: () => { this.snack.show('Account created successfully!'); this.router.navigate(['/search']); },
      error: () => this.loading.set(false)
    });
  }
}
