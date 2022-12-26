import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from 'src/app/localization/i18n.service';

@Directive({
    standalone: true,
    selector: '[disableControl]'
})
export class DisableControlDirective {
    @Input() set onClickPhraseKey(key: string) {
        this.phraseKey = key;
    }

    @Input() set disableControl(condition: boolean) {
        if (condition) {
            this.renderer.setAttribute(this.el.nativeElement, 'readonly', 'true');
            this.renderer.setStyle(this.el.nativeElement, 'background-color', 'var(--color-gray)');
            this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed');
        }
    }

    private phraseKey?: string;

    @HostListener('document:click', ['$event']) onClicked(event: MouseEvent): void {
        if (this.el.nativeElement.contains(event.target)) {
            const warningKey: string = this.phraseKey ? this.phraseKey : 'warning.disabled';
            this.toastr.warning(
                this.i18nService.getTranslation(warningKey)
            );
        }
    }

    constructor(
        readonly el: ElementRef,
        readonly renderer: Renderer2,
        readonly toastr: ToastrService,
        readonly i18nService: I18nService
    ) { }
}