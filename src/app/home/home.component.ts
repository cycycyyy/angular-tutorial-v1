import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HousingLocationComponent } from "../housing-location/housing-location.component";
import { HousingService } from "../housing.service";
import { HousingLocation } from "../housing-location";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, HousingLocationComponent],
  template: `
    <section>
      <form>
        <input
          type="text"
          placeholder="Filter by city"
          #filter
          (keydown)="filterResults(filter.value)"
        />
        <button
          class="primary"
          type="button"
          (click)="filterResults(filter.value)"
        >
          Search
        </button>
      </form>
    </section>
    <section>
      <app-housing-location
        *ngFor="let housingLocation of filteredLocationList"
        [housingLocation]="housingLocation"
        (click)="navigateToDetails(housingLocation.id)"
      ></app-housing-location>
    </section>
  `,
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  housingLocationList = [] as HousingLocation[];
  filteredLocationList: HousingLocation[] = [];

  housingService: HousingService = inject(HousingService);
  router: Router = inject(Router);

  navigateToDetails(id: number) {
    this.router.navigate(["details", id]);
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredLocationList = this.housingLocationList;
      return;
    }

    this.filteredLocationList = this.housingLocationList.filter((location) =>
      location?.city.toLowerCase().includes(text.toLowerCase())
    );
  }

  constructor() {
    this.housingService.getAllHousingLocations().then((locations) => {
      this.housingLocationList = locations;
      this.filteredLocationList = locations;
    });
  }
}
