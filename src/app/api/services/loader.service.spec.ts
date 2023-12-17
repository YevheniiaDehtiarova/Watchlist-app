import { TestBed, inject } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let loaderService: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderService]
    });

    loaderService = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(loaderService).toBeTruthy();
  });

  it('should set loading to true', () => {
    loaderService.setLoading(true);
    expect(loaderService.getLoading()).toBe(true);
  });

  it('should set loading to false', () => {
    loaderService.setLoading(false);
    expect(loaderService.getLoading()).toBe(false);
  });
});
