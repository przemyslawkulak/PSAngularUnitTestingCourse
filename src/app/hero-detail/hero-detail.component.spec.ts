import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
  flush,
  async
} from "@angular/core/testing";
import { HeroDetailComponent } from "./hero-detail.component";
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "../hero.service";
import { Location } from "@angular/common";
import { of } from "rxjs/internal/observable/of";
import { FormsModule } from "@angular/forms";

describe("HeroDetailComponent", () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockActivatedRoute, mockHeroService, mockLocation;
  beforeEach(() => {
    mockHeroService = jasmine.createSpyObj(["getHero", "updateHero"]);
    mockLocation = jasmine.createSpyObj(["back"]);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => {
            return "3";
          }
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation }
      ]
    });
    fixture = TestBed.createComponent(HeroDetailComponent);

    mockHeroService.getHero.and.returnValue(
      of({ id: 3, name: "SuperDude", strength: 100 })
    );
  });

  it("should render hero name in a h2 tag", () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("h2").textContent).toContain(
      "SUPERDUDE"
    );
  });

  // działa z asynchronicznym kodem, zarówno z promisami i setTimout
  it("should call updatehero when save is called", fakeAsync(() => {
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();
    flush(); // making ansynchron code as synchron
    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }));

  // test poniżej do promisów
  // it("should call updatehero when save is called", async(() => {
  //   mockHeroService.updateHero.and.returnValue(of({}));
  //   fixture.detectChanges();

  //   fixture.componentInstance.save();

  //   fixture.whenStable().then(() => {
  //     // kod w środku działa dopiero gdy wszystkie promisy zostana rozwiązane
  //     expect(mockHeroService.updateHero).toHaveBeenCalled();
  //   });
  // }));
});
