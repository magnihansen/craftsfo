import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable()
class RendererService {
    private renderer: Renderer2;

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }
}