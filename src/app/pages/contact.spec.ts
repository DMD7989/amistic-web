import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { MessageService } from '../inbox.service';
import { Contact } from './contact';

function setup(send: () => Promise<string | null>) {
  TestBed.configureTestingModule({
    providers: [{ provide: MessageService, useValue: { send: vi.fn(send) } }],
  });
  const fixture = TestBed.createComponent(Contact);
  fixture.detectChanges();
  return { fixture, send: TestBed.inject(MessageService).send as ReturnType<typeof vi.fn> };
}

describe('Contact', () => {
  it('envoie le message nettoyé et affiche la confirmation', async () => {
    const { fixture, send } = setup(async () => null);
    const page = fixture.componentInstance as unknown as Record<string, unknown> & {
      send(): Promise<void>;
    };
    page['name'] = ' Awa ';
    page['email'] = 'awa@example.org';
    page['message'] = ' Bonjour ';
    await page.send();
    fixture.detectChanges();
    expect(send).toHaveBeenCalledWith('Awa', 'awa@example.org', 'Bonjour');
    expect(fixture.nativeElement.querySelector('.success')?.getAttribute('role')).toBe('status');
  });

  it("affiche l'erreur renvoyée par le service", async () => {
    const { fixture } = setup(async () => "L'envoi a échoué.");
    await (fixture.componentInstance as unknown as { send(): Promise<void> }).send();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.error')?.textContent).toContain('échoué');
  });

  it('ignore silencieusement les robots (champ piège rempli)', async () => {
    const { fixture, send } = setup(async () => null);
    const page = fixture.componentInstance as unknown as Record<string, unknown> & {
      send(): Promise<void>;
    };
    page['website'] = 'http://spam.example';
    await page.send();
    expect(send).not.toHaveBeenCalled();
  });
});
