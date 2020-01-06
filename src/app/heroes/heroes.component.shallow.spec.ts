import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroesComponent } from "./heroes.component";
import { HeroService } from "../hero.service";
import { NO_ERRORS_SCHEMA, Component, Input } from "@angular/core";
import { of } from "rxjs";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";

describe("HeroesComponent (shallow tests)", () => {
  let fixture: ComponentFixture<HeroesComponent>; // zmienna na fiksture komponentu
  let mockHeroService; // zmienna do mokowania serwisu
  let HEROES; // zmienna z danymi

  @Component({
    // fakowy child komponent
    selector: "app-hero",
    template: "<div></div>"
  })
  class FakeHeroComponent {
    @Input() hero: Hero;
    // @Output() delete = new EventEmitter();
  }

  beforeEach(() => {
    // przed każdym testem tworzy:
    // tablica z danymi
    HEROES = [
      { id: 1, name: "SpiderDude", strength: 8 },
      { id: 2, name: "Wonderful Woman", strength: 24 },
      { id: 3, name: "SuperDude", strength: 55 }
    ];
    mockHeroService = jasmine.createSpyObj([
      // mokowanie funkcji serwisu
      "getHeroes",
      "addHero",
      "deleteHero"
    ]);
    TestBed.configureTestingModule({
      // konfiguracja modułu
      declarations: [HeroesComponent, FakeHeroComponent], // deklaracje komponentu i child komponnetu
      providers: [{ provide: HeroService, useValue: mockHeroService }]
      // dłuższa wersja wprowadzenia providera do wstawienia wartości z mocka
      // schemas: [NO_ERRORS_SCHEMA] // ignoruje Child elements
    });
    fixture = TestBed.createComponent(HeroesComponent); // tworzy fiksture
  });
  it("should set heroes correctly from the service", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES)); // mokuje jakie dane zwroci konkretna funkcja serwisu
    fixture.detectChanges(); // mockuje ngOnInit
    expect(fixture.componentInstance.heroes.length).toBe(3); // sprawdza ile objektów  bedzie w zmiennej 'heroes'
  });
  it("should create one li for each hero", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES)); // mokuje jakie dane zwroci konkretna funkcja serwisu
    fixture.detectChanges(); // mockuje ngOnInit

    expect(fixture.debugElement.queryAll(By.css("li")).length).toBe(3);
  });
});
