import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HeroComponent } from './hero/hero.component';
import { CommunityComponent } from './community/community.component';
import { ConnectComponent } from './connect/connect.component';

interface Spark {
  x: number;
  y: number;
  s: number;
  c: string;
  dur: string;
  delay: string;
  peak: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HeroComponent, CommunityComponent, ConnectComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'ncya';
  sparks: Spark[] = this.makeSparks(26);
  registered = false;
  submitting = false;
  error = '';
  visitor = { name: '', age: null as number | null, phone: '', gender: '', email: '' };
  private observer?: IntersectionObserver;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private host: ElementRef<HTMLElement>,
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => {
      try {
        if (sessionStorage.getItem('ncya-registered') === 'true') this.showWebsite();
      } catch {
        return;
      }
    });
  }

  async register(form: NgForm): Promise<void> {
    if (form.invalid || this.submitting) return;
    this.error = '';
    const validAge = this.visitor.age === null ||
      (Number.isInteger(this.visitor.age) && this.visitor.age >= 1 && this.visitor.age <= 120);
    const email = this.visitor.email.trim();
    if (!this.visitor.name.trim() || !validAge ||
        !/^[6-9]\d{9}$/.test(this.visitor.phone) ||
        (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      this.error = 'Please enter your name and a valid 10-digit Indian mobile number. Age, gender, and email are optional.';
      return;
    }
    this.submitting = true;
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.visitor),
      });
      if (response.status === 503) {
        this.error = 'Registration is not configured yet. Please contact the NCYA team.';
        return;
      }
      const result = await response.json();
      if (!response.ok || (result.ok !== true && result.success !== true)) throw new Error('Registration failed');
      if (isPlatformBrowser(this.platformId)) {
        try {
          sessionStorage.setItem('ncya-registered', 'true');
        } catch {}
        window.scrollTo(0, 0);
      }
      this.showWebsite();
    } catch {
      this.error = 'We could not save your details. Please check your connection and try again.';
    } finally {
      this.submitting = false;
    }
  }

  private showWebsite(): void {
    this.registered = true;
    setTimeout(() => this.observeReveals());
  }

  private observeReveals(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const targets = this.host.nativeElement.querySelectorAll('.reveal');
    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: .15, rootMargin: '0px 0px -60px 0px' },
    );
    targets.forEach((el) => this.observer!.observe(el));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private makeSparks(count: number): Spark[] {
    const colors = ['#ff3aab', '#62edee', '#eaff67', '#b26bff', '#4dff9f'];
    const sparks: Spark[] = [];
    for (let i = 0; i < count; i++) {
      sparks.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 2 + Math.random() * 3,
        c: colors[i % colors.length],
        dur: `${3 + Math.random() * 5}s`,
        delay: `${Math.random() * 6}s`,
        peak: .55 + Math.random() * .4,
      });
    }
    return sparks;
  }
}
