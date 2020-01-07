import { TestBed, inject } from "@angular/core/testing";
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";

describe("HeroService", () => {
  let mockMessageService;
  let httpTestingController: HttpTestingController;
  let service;
  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(["add"]); // mokuje metodę add
    TestBed.configureTestingModule({
      // konfiguracja modułu
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        {
          provide: MessageService,
          useValue: mockMessageService
        }
      ]
    });
    // httpTestingController = TestBed.get(HttpTestingController);
    // service = TestBed.get(HeroService);
  });
  describe("getHero", () => {
    it("should call get wit the correct URL", inject(
      // inject potrzebne serwisy
      [HeroService, HttpTestingController],
      (service: HeroService, httpTestingController: HttpTestingController) => {
        service.getHero(4).subscribe(); //

        const req = httpTestingController.expectOne("api/heroes/4"); // wysyła żądanie
        req.flush({ id: 4, name: "SuperDude", strenth: 100 }); // zwraca odpowiedź
        httpTestingController.verify(); // weryfikuje poprawność odpowiedzi
      }
    ));
  });
});
