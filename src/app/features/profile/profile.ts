import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthSignalStore } from '../../core/stores/auth-signal.store';
import { SnackService } from '../../core/services/snack.service';
import { IstDatePipe } from '../../shared/pipes/ist-date.pipe';

@Component({
  selector: 'app-profile',
  imports: [IstDatePipe, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule],
  template: `
    <section class="page page-narrow">
      <div class="page-header">
        <h1 class="section-title">My Profile</h1>
        <p class="section-subtitle">Manage your account, password, and recipe search history.</p>
      </div>

      <div class="profile-grid">
        <mat-card class="panel profile-card">
          <div class="avatar">{{ initials() }}</div>
          <h2>{{ auth.user()?.name }}</h2>
          <p class="meta">{{ auth.user()?.email }}</p>
          <div class="stat-badges">
            <span class="badge"><mat-icon>favorite</mat-icon> {{ auth.user()?.favoriteCount || 0 }} favorites</span>
          </div>
          <form class="form" [formGroup]="profileForm" (ngSubmit)="saveProfile()">
            <mat-form-field appearance="outline">
              <mat-label>Display Name</mat-label>
              <input matInput formControlName="name" />
            </mat-form-field>
            <button mat-flat-button color="primary" [disabled]="profileForm.invalid || savingProfile()">
              @if (savingProfile()) { <mat-spinner diameter="20" /> } @else { Update Profile }
            </button>
          </form>
        </mat-card>

        <mat-card class="panel">
          <h2><mat-icon>lock</mat-icon> Change Password</h2>
          <form class="form" [formGroup]="passwordForm" (ngSubmit)="changePassword()">
            <mat-form-field appearance="outline">
              <mat-label>Current Password</mat-label>
              <input matInput [type]="showCurrent() ? 'text' : 'password'" formControlName="currentPassword" />
              <button mat-icon-button matSuffix type="button" (click)="showCurrent.set(!showCurrent())" aria-label="Toggle password visibility">
                <mat-icon>{{ showCurrent() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>New Password</mat-label>
              <input matInput [type]="showNew() ? 'text' : 'password'" formControlName="newPassword" />
              <button mat-icon-button matSuffix type="button" (click)="showNew.set(!showNew())" aria-label="Toggle password visibility">
                <mat-icon>{{ showNew() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>
            <button mat-stroked-button [disabled]="passwordForm.invalid || changingPassword()">
              @if (changingPassword()) { <mat-spinner diameter="20" /> } @else { Change Password }
            </button>
          </form>
        </mat-card>
      </div>

      <mat-card class="panel history">
        <h2><mat-icon>history</mat-icon> Recipe Search History</h2>
        @if (!auth.user()?.recentSearches?.length) {
          <div class="empty-history">
            <mat-icon>search</mat-icon>
            <p>No search history yet. Start exploring recipes!</p>
          </div>
        } @else {
          <ul class="history-list">
            @for (item of auth.user()?.recentSearches || []; track item.id) {
              <li>
                <div class="history-item">
                  <mat-icon>search</mat-icon>
                  <span class="query">{{ item.search_query }}</span>
                </div>
                <span class="meta ist-date">{{ item.created_at | istDate }}</span>
              </li>
            }
          </ul>
        }
      </mat-card>
    </section>
  `,
  styles: [`
    .page-header { margin-bottom: 8px; }
    .profile-grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    .profile-card { text-align: center; }
    .avatar {
      align-items: center;
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      border-radius: 50%;
      box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
      color: #fff;
      display: flex;
      font-size: 1.5rem;
      font-weight: 700;
      height: 80px;
      justify-content: center;
      margin: 0 auto 16px;
      width: 80px;
    }
    .profile-card h2 { font-size: 1.3rem; margin: 0 0 4px; }
    .stat-badges { margin: 12px 0 20px; }
    .stat-badges .badge { align-items: center; display: inline-flex; gap: 4px; }
    .stat-badges mat-icon { font-size: 16px; height: 16px; width: 16px; }
    .profile-card .form { margin: 0 auto; text-align: left; }
    .panel h2 { align-items: center; display: flex; font-size: 1.1rem; gap: 8px; margin: 0 0 18px; }
    .panel h2 mat-icon { color: var(--primary); }
    .history { margin-top: 24px; }
    .empty-history { color: var(--muted); padding: 32px; text-align: center; }
    .empty-history mat-icon { font-size: 40px; height: 40px; opacity: 0.5; width: 40px; }
    .history-list { display: grid; gap: 0; list-style: none; margin: 0; padding: 0; }
    .history-list li {
      align-items: center;
      border-bottom: 1px solid var(--border);
      display: flex;
      gap: 16px;
      justify-content: space-between;
      padding: 14px 4px;
    }
    .history-list li:last-child { border-bottom: none; }
    .history-item { align-items: center; display: flex; gap: 10px; min-width: 0; }
    .history-item mat-icon { color: var(--primary); flex-shrink: 0; font-size: 20px; height: 20px; width: 20px; }
    .query { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .history-list .meta { flex-shrink: 0; text-align: right; }
  `]
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  auth = inject(AuthSignalStore);
  private snack = inject(SnackService);
  profileForm = this.fb.nonNullable.group({ name: ['', [Validators.required, Validators.minLength(2)]] });
  passwordForm = this.fb.nonNullable.group({ currentPassword: ['', Validators.required], newPassword: ['', Validators.required] });
  savingProfile = signal(false);
  changingPassword = signal(false);
  showCurrent = signal(false);
  showNew = signal(false);

  ngOnInit(): void {
    this.auth.loadProfile().subscribe((user) => this.profileForm.patchValue({ name: user.name }));
  }

  initials(): string {
    const name = this.auth.user()?.name || '';
    return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || '?';
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.savingProfile.set(true);
    this.auth.updateProfile(this.profileForm.value.name || '').subscribe({
      next: () => { this.snack.show('Profile updated successfully'); this.savingProfile.set(false); },
      error: () => this.savingProfile.set(false)
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    this.changingPassword.set(true);
    const value = this.passwordForm.getRawValue();
    this.auth.changePassword(value.currentPassword, value.newPassword).subscribe({
      next: () => { this.snack.show('Password changed successfully'); this.passwordForm.reset(); this.changingPassword.set(false); },
      error: () => this.changingPassword.set(false)
    });
  }
}
