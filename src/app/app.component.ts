import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
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
  imports: [CommonModule, HeroComponent, CommunityComponent, ConnectComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'ncya';
  sparks: Spark[] = this.makeSparks(26);
  private observer?: IntersectionObserver;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private host: ElementRef<HTMLElement>,
  ) {}

  ngAfterViewInit(): void {
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
