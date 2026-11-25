import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArrowUpRight, CalendarDays, Church, Heart, Instagram, LucideAngularModule, MessageCircle, Users, UserRound } from 'lucide-angular';

@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './connect.component.html',
  styleUrl: './connect.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ConnectComponent implements OnInit {
  readonly ArrowUpRight = ArrowUpRight;
  readonly CalendarDays = CalendarDays;
  readonly Church = Church;
  readonly Heart = Heart;
  readonly Instagram = Instagram;
  readonly MessageCircle = MessageCircle;
  readonly Users = Users;
  readonly UserRound = UserRound;
  topic = 'Prayer request';
  message = '';
  prayerQrUrl = '';

  constructor(@Inject(PLATFORM_ID) private platformId: object, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const url = new URL(this.document.location.href);
      url.hash = 'prayer';
      this.prayerQrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url.toString());
    }
  }

  get whatsappUrl(): string {
    const text = `Hi NCYA! ${this.topic}.${this.message.trim() ? '\n\n' + this.message.trim() : ''}`;
    return 'https://wa.me/?text=' + encodeURIComponent(text);
  }
}