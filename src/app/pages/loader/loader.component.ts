import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { LoaderService } from '../../api/services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [NgIf],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  constructor(public loader: LoaderService){}
}
