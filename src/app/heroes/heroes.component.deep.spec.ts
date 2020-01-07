import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroesComponent } from "./heroes.component";
import { HeroService } from "../hero.service";
import { NO_ERRORS_SCHEMA, Component, Input } from "@angular/core";
import { of } from "rxjs";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";

describe("HeroesComponent (deep tests)", () => {
  let fixture: ComponentFixture<HeroesComponent>; // zmienna na fiksture komponentu
  let mockHeroService; // zmienna do mokowania serwisu
  let HEROES; // zmienna z danymi

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
      declarations: [HeroesComponent, HeroComponent], // deklaracje komponentu i child komponnetu
      providers: [{ provide: HeroService, useValue: mockHeroService }],
      schemas: [NO_ERRORS_SCHEMA]
      // dłuższa wersja wprowadzenia providera do wstawienia wartości z mocka
    });
    fixture = TestBed.createComponent(HeroesComponent); // tworzy fiksture
  });

  it("should render each hero as a HeroComponent", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    // run ngOnInit
    fixture.detectChanges();
    const heroComponentDEs = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );
    expect(heroComponentDEs.length).toEqual(3);
    for (let i = 0; i < heroComponentDEs.length; i++) {
      expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
    }
  });
});
