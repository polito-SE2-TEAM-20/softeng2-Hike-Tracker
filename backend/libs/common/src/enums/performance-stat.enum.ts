export enum PerformanceStat {
  /**
   * total nr of hikes finished
   */
  totalHikesFinished = 'totalHikesFinished',
  /**
   * total nr of kms walked
   */
  totalKmsWalked = 'totalKmsWalked',
  /**
   * highest altitude reached
   */
  highestAltitudeReached = 'highestAltitudeReached',
  /**
   * highest altitude range done
   */
  largestAltitudeRange = 'largestAltitudeRange',
  /**
   * longest (km) hike completed
   */
  longestHikeDistanceKms = 'longestHikeDistanceKms',
  /**
   * longest (hours) hike completed
   */
  longestHikeTimeHours = 'longestHikeTimeHours',
  /**
   * shortest (km) hike completed
   */
  shortestHikeDistanceKms = 'shortestHikeDistanceKms',
  /**
   * shortest (hours) hike completed
   */
  shortestHikeTimeHours = 'shortestHikeTimeHours',
  /**
   * average pace (min/km)
   */
  averagePace = 'averagePace',
  /**
   * fastest paced hike (min/km)
   */
  fastestPace = 'fastestPace',
  /**
   * average vertical ascent speed (m/hour) \
   * vertical ascent speed is computed only on the ascending segments
   */
  averageVerticalAscentSpeed = 'averageVerticalAscentSpeed',
}
