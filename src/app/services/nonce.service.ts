import { DOCUMENT } from "@angular/common";
import { Meta } from '@angular/platform-browser';
import { Inject, Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { CSP_CONFIG } from "../core/configs/csp.config";

@Injectable({
    providedIn: 'root'
})
export class NonceService {
    private renderer: Renderer2;
    public nonceValue: string = '';

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private rendererFactory: RendererFactory2,
        private cspConfig: CSP_CONFIG,
        private meta: Meta
    ) { 
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    public addNonceToDynamicallyAddedScripts(): void {
        const cspValue: string = this.cspConfig.toString();
        
        // this.meta.addTag({ 
        //     "http-equiv": "Content-Security-Policy",
        //     content: "default-src 'self'; base-uri 'self'; connect-src 'self' https://*.fontawesome.com ws://api.instantcms.dk http://api.instantcms.dk; style-src 'self' 'nonce-" + cspValue + "' 'sha256-+z/QQnyTdvyxrqVNIzbN3v23KsDiBYjPHnUpLUh8D7k=' 'sha256-NSpTQ/P/HJanetMtkLmj2xe/lKbUsQiCLEd1NjuV0q4=' 'sha256-68pbKE1hj6V6yQhcLaYdaJADg/Djj5oS8YkEJb/tRG8=' 'sha256-08kQ8chUlBbGQAlv06NoDrIs/M1C91bvBlneOOfrodI=' 'sha256-biLFinpqYMtWHmXfkA1BPeCY0/fNt46SAZ+BBk5YUog=' 'sha256-biLFinpqYMtWHmXfkA1BPeCY0/fNt46SAZ+BBk5YUog=' 'sha256-spkiSWYpd8erPSt3Hnp3TqoxOEKuG9Zy0HsCkvbMw9k=' 'sha256-kYO5xCnKwLQTtMH1uRdbsx3oewQKHLiW3OEhG2bCe7M=' 'sha256-weRNzfHa/uc943Zmfb5qbcUweGnjMCB+s1Qz0dcOGBE=' 'sha256-VfhvLzb4TsqN+9xZpSWr7jN3O5DawYwsQjNTmWNE01Y=' 'sha256-LSlq11V8H4TkoWx9azKlaqw/lPRjGoZ/cnR02w5WC8s=' 'sha256-8P9hMJTrETOf2BZ+xPuPd3PE7mnuWDstsdu4dhGM2jk=' 'sha256-tk7FYsSecZS+4G11qBj3nlnASPv/MoEWyZSl9IIpgnc=' 'sha256-S7CVSMh1V3X4wSdTlyV3Q/Lrr7zoCb5LI77Ocpz/OwQ=' 'sha256-0QXsgMC3VmrlmkTfzP6YcSQKu95vRmPqKckuBYdTHu0=' 'sha256-O4m7iieHeHhDHNfyl/ZqC9pwizUWgT8wl8+P1UgrTSI=' 'unsafe-hashes'; script-src 'self' 'nonce-" + cspValue + "';" 
        // });

        // this.applyNonceToScripts(cspValue);
        // this.applyNonceToStyleLinks(cspValue);
        // this.applyNonceToStyles(cspValue);
    }

    private applyNonceToScripts(cspValue: string): void {
        const scripts = this.document.querySelectorAll('script');
        scripts.forEach((script: HTMLScriptElement) => {
            if (!script.hasAttribute('nonce')) {
                this.renderer.setAttribute(script, 'nonce', cspValue);
            }
        });
    }

    private applyNonceToStyles(cspValue: string): void {
        const styles = this.document.querySelectorAll('style');
        styles.forEach((style: HTMLStyleElement) => {
            console.log('style', style);
            if (!style.hasAttribute('nonce')) {
                this.renderer.setAttribute(style, 'nonce', cspValue);
            }
        });
    }

    private applyNonceToStyleLinks(cspValue: string): void {
        const styles = this.document.querySelectorAll('link');
        styles.forEach((style: HTMLLinkElement) => {
            if (!style.hasAttribute('nonce')) {
                this.renderer.setAttribute(style, 'nonce', cspValue);
            }
        });
    }
}