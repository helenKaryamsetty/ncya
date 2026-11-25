import { Component, ViewEncapsulation } from '@angular/core';
import { ArrowUpRight, Compass, Cross, LucideAngularModule, MapPin, Sparkles, Users } from 'lucide-angular';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CommunityComponent {
  readonly ArrowUpRight = ArrowUpRight;
  readonly Compass = Compass;
  readonly Cross = Cross;
  readonly MapPin = MapPin;
  readonly Sparkles = Sparkles;
  readonly Users = Users;
}