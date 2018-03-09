import { Component, Input, OnInit } from '@angular/core';
import { Item, Feedback } from './shared/services/item.service';

@Component({
  selector: 'app-feedback-item',
  templateUrl: './feedback-item.html',
  styleUrls: ['./feedback-item.css']
})
export class FeedbackItemComponent implements OnInit {
  @Input() feedback: Feedback;
  feedbackpercentage: number;

  constructor() {}

  ngOnInit(): void {
  	this.feedbackpercentage = this.feedback.rating * 20;
  }

}
