// Minimal ambient types for the (untyped) `page-flip` package — only the surface
// this project uses. See https://github.com/Nodlik/StPageFlip
declare module "page-flip" {
  export interface PageFlipSettings {
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    useMouseEvents?: boolean;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
  }

  export interface FlipEvent {
    data: number;
    object: unknown;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: PageFlipSettings);
    loadFromImages(images: string[]): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    turnToPage(page: number): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    destroy(): void;
    on(
      event: "flip" | "changeState" | "init" | "update",
      callback: (e: FlipEvent) => void
    ): void;
  }
}
