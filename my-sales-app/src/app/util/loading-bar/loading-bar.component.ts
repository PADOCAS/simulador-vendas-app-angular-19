import {Component, Input} from '@angular/core';
import {MaterialModule} from "../../material.module";

@Component({
    selector: 'app-loading-bar',
    imports: [MaterialModule],
    templateUrl: './loading-bar.component.html',
    styleUrl: './loading-bar.component.css'
})
export class LoadingBarComponent {
  @Input() visible: Boolean = true;
}
