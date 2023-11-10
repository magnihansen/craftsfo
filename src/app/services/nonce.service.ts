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
        // console.log('addNonceToDynamicallyAddedScripts', this.cspConfig);
        const cspValue: string = this.cspConfig.toString();
        this.applyNonceToScripts(cspValue);
        this.applyNonceToStyles(cspValue);

        this.meta.addTag({ 
            "http-equiv": "Content-Security-Policy",
            content: "default-src 'self'; base-uri 'self'; connect-src 'self' https://*.fontawesome.com; style-src 'self' 'nonce-" + cspValue + "'; script-src 'self' 'nonce-" + cspValue + "';" 
        });
        // <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
    }

    private applyNonceToScripts(cspValue: string): void {
        const scripts = this.document.querySelectorAll('script');
        scripts.forEach(script => {
            if (!script.hasAttribute('nonce')) {
                this.renderer.setAttribute(script, 'nonce', cspValue);
            }
        });
    }

    private applyNonceToStyles(cspValue: string): void {
        const styles = this.document.querySelectorAll('style');
        styles.forEach(style => {
            if (!style.hasAttribute('nonce')) {
                this.renderer.setAttribute(style, 'nonce', cspValue);
            }
        });
    }
}