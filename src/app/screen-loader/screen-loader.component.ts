import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-screen-loader',
  imports: [],
  templateUrl: './screen-loader.component.html',
  styleUrl: './screen-loader.component.scss'
})
export class ScreenLoaderComponent {
  @Input()
  messages: string[] = [
    'Hang tight, superstar!',
    'Your results are being whipped up by our AI magic! This might take a little while (up to 10 minutes), but good things come to those who wait.',
    "Grab a snack, stretch your legs, or maybe do a little dance! We'll be back with your insights before you know it!",
  ];
}
