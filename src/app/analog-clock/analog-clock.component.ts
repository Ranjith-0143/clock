// analog-clock.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-analog-clock',
  templateUrl: './analog-clock.component.html',
  styleUrls: ['./analog-clock.component.css'],
})
export class AnalogClockComponent implements OnInit, OnDestroy {
  private intervalId: any;
  private context!: CanvasRenderingContext2D;

  digitalTime: string = '';
  digitalDate: string = '';

  ngOnInit(): void {
    const canvas = document.getElementById(
      'analogClockCanvas'
    ) as HTMLCanvasElement;
    this.context = canvas?.getContext('2d') || ({} as CanvasRenderingContext2D);

    this.intervalId = setInterval(() => {
      this.drawClock();
    }, 1000);

    this.drawClock(); // Initial draw
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private drawClock(): void {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    this.digitalTime = this.formatTime(hours, minutes, seconds);
    this.digitalDate = this.formatDate(now);

    this.context.clearRect(0, 0, 200, 200); // Clear the canvas

    this.drawClockFace();
    this.drawHourHand(hours, minutes);
    this.drawMinuteHand(minutes, seconds);
    this.drawSecondHand(seconds);

    this.drawDigitalTime();
    this.drawDigitalDate();
  }

  private drawDigitalTime(): void {
    this.context.font = 'bold 16px Arial';
    this.context.fillStyle = '#333';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(this.digitalTime, 100, 130);
  }

  private drawDigitalDate(): void {
    this.context.font = 'bold 12px Arial';
    this.context.fillStyle = '#333';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(this.digitalDate, 100, 150);
  }

  private formatTime(hours: number, minutes: number, seconds: number): string {
    const meridian = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    return (
      this.padZero(formattedHours) +
      ':' +
      this.padZero(minutes) +
      ':' +
      this.padZero(seconds) +
      ' ' +
      meridian
    );
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }

  private padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  private drawClockFace(): void {
    const clockRadius = 98; // Set the desired radius for the clock face

    // Draw clock face
    this.context.beginPath();
    this.context.arc(100, 100, clockRadius, 0, 2 * Math.PI);
    this.context.fillStyle = '#fff';
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.strokeStyle = '#333';
    this.context.stroke();

    // Draw clock center
    this.context.beginPath();
    this.context.arc(100, 100, 5, 0, 2 * Math.PI);
    this.context.fillStyle = '#333';
    this.context.fill();

    // Draw clock numbers
    this.context.font = 'bold 14px Arial';
    this.context.fillStyle = '#333';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';

    for (let i = 1; i <= 12; i++) {
      const angle = (i - 3) * (Math.PI / 6); // Position numbers evenly around the clock
      const x = 100 + (clockRadius - 20) * Math.cos(angle); // Adjust the position of the numbers
      const y = 100 + (clockRadius - 20) * Math.sin(angle); // Adjust the position of the numbers

      this.context.fillText(i.toString(), x, y);
    }
  }

  private drawHourHand(hours: number, minutes: number): void {
    const hourAngle = ((hours % 12) + minutes / 60) * 30; // 30 degrees per hour
    this.drawHand(hourAngle, 50, 6, '#333');
  }

  private drawMinuteHand(minutes: number, seconds: number): void {
    const minuteAngle = (minutes + seconds / 60) * 6; // 6 degrees per minute
    this.drawHand(minuteAngle, 70, 4, '#333');
  }

  private drawSecondHand(seconds: number): void {
    const secondAngle = seconds * 6; // 6 degrees per second
    this.drawHand(secondAngle, 80, 2, 'red');
  }

  private drawHand(
    angle: number,
    length: number,
    width: number,
    color: string
  ): void {
    const radianAngle = (angle - 90) * (Math.PI / 180);
    const x = 100 + length * Math.cos(radianAngle);
    const y = 100 + length * Math.sin(radianAngle);

    this.context.beginPath();
    this.context.moveTo(100, 100);
    this.context.lineTo(x, y);
    this.context.lineWidth = width;
    this.context.strokeStyle = color;
    this.context.stroke();
  }
}
