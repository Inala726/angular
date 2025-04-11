import { Component } from '@angular/core';
import { NgIcon, provideIcons } from "@ng-icons/core"
import { bootstrapApple } from "@ng-icons/bootstrap-icons"

@Component({
  selector: 'app-hero',
  imports: [NgIcon],
  viewProviders: [provideIcons({bootstrapApple})],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {

}
