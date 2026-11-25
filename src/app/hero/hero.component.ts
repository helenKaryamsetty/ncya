import { DOCUMENT } from '@angular/common';
import { Component, Inject, ViewEncapsulation, signal } from '@angular/core';

const CONFETTI_COLORS = ['#ff3aab', '#62edee', '#eaff67', '#b26bff', '#4dff9f'];

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class HeroComponent {
  readonly menuOpen = signal(false);

  constructor(@Inject(DOCUMENT) private document: Document) {}

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  burstConfetti(event: MouseEvent): void {
    const originX = event.clientX;
    const originY = event.clientY;
    const body = this.document.body;
    for (let i = 0; i < 20; i++) {
      const piece = this.document.createElement('span');
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 140;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 40;
      piece.className = 'confetti-piece';
      piece.style.setProperty('--tx', `${tx}px`);
      piece.style.setProperty('--ty', `${ty}px`);
      piece.style.setProperty('--rot', `${Math.random() * 540 - 270}deg`);
      piece.style.left = `${originX}px`;
      piece.style.top = `${originY}px`;
      piece.style.width = `${5 + Math.random() * 5}px`;
      piece.style.height = `${8 + Math.random() * 8}px`;
      piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      body.appendChild(piece);
      piece.addEventListener('animationend', () => piece.remove());
      setTimeout(() => piece.remove(), 1400);
    }
  }
}