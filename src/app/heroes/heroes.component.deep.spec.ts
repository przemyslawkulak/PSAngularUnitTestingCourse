import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroesComponent } from "./heroes.component";
import { HeroService } from "../hero.service";
import { NO_ERRORS_SCHEMA, Component, Input, Directive } from "@angular/core";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";
import { of } from "rxjs/internal/observable/of";

@Directive({
  selector: "[routerLink]",
  host: { "(click)": "onClick()" }
})
export class RouterLinkDirectiveStub {
  @Input("routerLink") linkParams: any;
  navigatedTo: any = null;
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

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
      declarations: [HeroesComponent, HeroComponent, RouterLinkDirectiveStub], // deklaracje komponentu i child komponnetu
      providers: [{ provide: HeroService, useValue: mockHeroService }]
      // schemas: [NO_ERRORS_SCHEMA]
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

  it(`should call HeroService.deleteHero when the HeroComponent's
  delete button is clicked`, () => {
    spyOn(fixture.componentInstance, "delete");
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    // run ngOnInit
    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    // heroComponents[0]
    //   .query(By.css("button"))
    //   .triggerEventHandler("click", { stopPropagation: () => {} });

    // (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);

    heroComponents[0].triggerEventHandler("delete", null);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });
  it("should add a new hero to the hero list when the add button is clicked", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    // run ngOnInit
    fixture.detectChanges();
    const name = "Mr Ice";
    mockHeroService.addHero.and.returnValue(
      of({ id: 5, name: name, strength: 4 })
    );
    const inputElement = fixture.debugElement.query(By.css("input"))
      .nativeElement;
    const addButton = fixture.debugElement.queryAll(By.css("button"))[0];

    inputElement.value = name;
    addButton.triggerEventHandler("click", null);
    fixture.detectChanges();

    const heroText = fixture.debugElement.query(By.css("ul")).nativeElement
      .textContent;
    expect(heroText).toContain(name);
  });

  it("should have the correct route for the first hero", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    // run ngOnInit
    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );
    const routerLink = heroComponents[0]
      .query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub);

    heroComponents[0].query(By.css("a")).triggerEventHandler("click", null);

    expect(routerLink.navigatedTo).toBe("/detail/1");
  });
});
