import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    sessionStorage.removeItem('ncya-registered');
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  afterEach(() => sessionStorage.removeItem('ncya-registered'));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'ncya' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ncya');
  });

  it('should show registration before the site', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('NCYA');
    expect(compiled.querySelector('.registration-copy')?.textContent).toContain('Your Sunday Got Better');
    expect(compiled.querySelector('input[name="name"]')?.hasAttribute('required')).toBeTrue();
    expect(compiled.querySelector('input[name="phone"]')?.hasAttribute('required')).toBeTrue();
    expect(compiled.querySelector('input[name="age"]')?.hasAttribute('required')).toBeFalse();
    expect(compiled.querySelector('select[name="gender"]')?.hasAttribute('required')).toBeFalse();
    expect(compiled.querySelector('input[name="email"]')?.hasAttribute('required')).toBeFalse();
    expect(compiled.querySelector('app-hero')).toBeNull();
  });

  it('opens the site only after a successful save', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.visitor = { name: 'Test Visitor', age: 24, phone: '9876543210', gender: 'Female', email: 'test@example.com' };
    spyOn(window, 'fetch').and.resolveTo(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    await app.register({ invalid: false } as NgForm);
    fixture.detectChanges();
    expect(app.registered).toBeTrue();
    expect(sessionStorage.getItem('ncya-registered')).toBe('true');
    expect((fixture.nativeElement as HTMLElement).querySelector('app-hero h1')?.textContent).toContain('NCYA');
  });

  it('accepts registration when optional fields are blank', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.visitor = { name: 'Test Visitor', age: null, phone: '9876543210', gender: '', email: '' };
    spyOn(window, 'fetch').and.resolveTo(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    await app.register({ invalid: false } as NgForm);
    expect(app.registered).toBeTrue();
  });

  it('restores the site after a refresh in the same tab', fakeAsync(() => {
    sessionStorage.setItem('ncya-registered', 'true');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('app-hero h1')?.textContent).toContain('NCYA');
    expect((fixture.nativeElement as HTMLElement).querySelector('.registration')).toBeNull();
  }));

  it('keeps the form open when the save fails', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.visitor = { name: 'Test Visitor', age: 24, phone: '9876543210', gender: 'Female', email: 'test@example.com' };
    spyOn(window, 'fetch').and.rejectWith(new Error('offline'));
    await app.register({ invalid: false } as NgForm);
    expect(app.registered).toBeFalse();
    expect(sessionStorage.getItem('ncya-registered')).toBeNull();
    expect(app.error).toContain('could not save');
    expect(app.submitting).toBeFalse();
  });

  it('explains when registration is not configured', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.visitor = { name: 'Test Visitor', age: 24, phone: '9876543210', gender: 'Female', email: 'test@example.com' };
    spyOn(window, 'fetch').and.resolveTo(new Response(JSON.stringify({ ok: false }), { status: 503 }));
    await app.register({ invalid: false } as NgForm);
    expect(app.registered).toBeFalse();
    expect(app.error).toContain('not configured');
    expect(app.submitting).toBeFalse();
  });

  it('does not submit an invalid form', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const fetchSpy = spyOn(window, 'fetch');
    await fixture.componentInstance.register({ invalid: true } as NgForm);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects phone numbers not accepted by Apps Script', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.visitor = { name: 'Test Visitor', age: 24, phone: '+919876543210', gender: 'Female', email: 'test@example.com' };
    const fetchSpy = spyOn(window, 'fetch');
    await app.register({ invalid: false } as NgForm);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(app.error).toContain('10-digit Indian mobile number');
  });
});
