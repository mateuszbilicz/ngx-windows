import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

export type NgwIconType = 'close' | 'minimize' | 'maximize' | 'restore' | 'menu';

@Component({
  selector: 'ngw-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styles: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * @class IconComponent
 * @description Window icon component - contains all basic icon types for window topbar.
 */
export class IconComponent {
  /**
   * @property type
   * @description Icon type.
   * @default 'close'
   */
  @Input() type: NgwIconType = 'close';

  constructor(private satanizer: DomSanitizer) {
  }

  /**
   * @property iconSvgHTML
   * @description Returns icon SVG content for specified icon type.
   * @returns void
   */
  get iconSvgHTML(): string {
    switch (this.type) {
      case 'minimize':
        return '<path d="M3 13H13" stroke="white" stroke-width="2"/>';
      case 'maximize':
        return '<path fill-rule="evenodd" clip-rule="evenodd" d="M6.82843 4H10.5858L9.29289 5.29289L10.7071 6.70711L12 5.41421V9.17157L14 11.1716V3V2H13H4.82843L6.82843 4ZM2 4.82843V13V14H3H11.1716L9.17157 12H5.41421L6.70711 10.7071L5.29289 9.29289L4 10.5858V6.82843L2 4.82843Z" fill="white"/>';
      case 'restore':
        return '<path d="M10 2V6H14M6 14V10H2" stroke="white" stroke-width="2"/>';
      case 'menu':
        return `<path d="M3 12H13" stroke="white" stroke-width="2"/>
<path d="M3 8H13" stroke="white" stroke-width="2"/>
<path d="M3 4H13" stroke="white" stroke-width="2"/>`;
      default: // close
        return '<path d="M3 3L13 13M13 3L3 13" stroke="white" stroke-width="2"/>';
    }
  }

  /**
   * @property iconSvg
   * @description Returns icon in sanitized SafeHtml.
   * @returns SafeHtml
   */
  get iconSvg(): SafeHtml {
    return this.satanizer.bypassSecurityTrustHtml(
      this.iconSvgHTML
    );
  }
}
