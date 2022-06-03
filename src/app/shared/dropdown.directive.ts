import { Directive, ElementRef, HostBinding, HostListener } from "@angular/core";

@Directive({
  selector: "[appDropdown]"
})
export class DropdownDirective {

  @HostBinding('class.open') isOpen: boolean = false;

  constructor(private elRef: ElementRef) {}

  // Clicking outside of the dropdown closes it
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }

  // Clicking on the dropdown button
  // @HostListener("click") toggleOpen() {
  //   this.isOpen = !this.isOpen;
  // }
}
