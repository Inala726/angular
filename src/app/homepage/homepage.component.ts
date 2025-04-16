import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {bootstrapHouseDoor, bootstrapShieldCheck, bootstrapLightningCharge, bootstrapPerson, bootstrapUiRadiosGrid, bootstrapLaptop} from '@ng-icons/bootstrap-icons';
import { FooterComponent } from '../components/footer/footer.component';
import { NavbarComponent } from '../components/navbar/navbar.component';


@Component({
  selector: 'app-homepage',
  imports: [NgIcon, FooterComponent, NavbarComponent],
  viewProviders: [provideIcons({bootstrapHouseDoor, bootstrapShieldCheck, bootstrapLightningCharge, bootstrapPerson, bootstrapUiRadiosGrid, bootstrapLaptop})],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

}
