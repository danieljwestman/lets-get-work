
interface MonthTracker {
  [month: string]: number;
}

export class StatisticsTracker {
  private processedCount = 0;
  private errorCount = 0;
  private mayProcessedCount = 0;
  private juneProcessedCount = 0;
  private outputMonthTracker: MonthTracker = {};

  incrementProcessed(): void {
    this.processedCount++;
  }

  incrementError(): void {
    this.errorCount++;
  }

  incrementMayProcessed(): void {
    this.mayProcessedCount++;
  }

  incrementJuneProcessed(): void {
    this.juneProcessedCount++;
  }

  trackMonth(month: string): void {
    this.outputMonthTracker[month] = (this.outputMonthTracker[month] || 0) + 1;
  }

  getSummary() {
    return {
      processedCount: this.processedCount,
      errorCount: this.errorCount,
      mayProcessedCount: this.mayProcessedCount,
      juneProcessedCount: this.juneProcessedCount,
      outputMonthTracker: this.outputMonthTracker
    };
  }

  logSummary(): void {
    console.log('=== PROCESSING SUMMARY ===');
    console.log(`Total: ${this.processedCount} processed, ${this.errorCount} errors`);
    console.log(`MAY 2025: ${this.mayProcessedCount} events processed`);
    console.log(`JUNE 2025: ${this.juneProcessedCount} events processed`);
    console.log('Output events by month:', this.outputMonthTracker);
  }
}
