TEMPLATE FOR RETROSPECTIVE (Team 20)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done 
   - 5 stories committed
   - 3 stories done
- Total points committed vs. done
  - Total points committed: 19 
  - Total points done: 11
- Nr of hours planned vs. spent (as a team)
  - Nr hours planned: 67h 45min
  - Nr hours spent: 72h 45min


**Remember**a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    9    |        |   26h      |     30h 45m  |
| _#1_   |    4    |    3   |   9h       |     7h 5m    |
| _#2_   |    4    |    3   |   11h      |     14h      |
| _#3_   |    3    |    5   |   10h      |     9h       | 
| _#4_   |    4    |    5   |  7h 45m    |     9h       |
| _#5_   |    2    |    3   |   4h       |     3h       |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
  - hours estimated per task average: 3h
  - hours spent per task average: 3h 20m
  - estimate standard deviation: 2h 29m
  - average standard deviation: 2h 31m
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1
  - estimation error ration: -0.069 
  <!-- The total task estimation ratio is negative because the number of hours spent are greater than the number of hours estimated -->
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: not available
  - Total hours spent: 0
  - Nr of automated unit test cases: 0 / 0 (no UT needed for our functions)
  - Coverage (if available)
  <!--(Hours are inside the estimated time for each task because we put it in the state of 'to verify' when it is in testing phase)-->
- E2E testing:
  - Total hours estimated: not available
  - Total hours spent
  - Number of End-to-End tests performed: 6
  <!--(Hours are inside the estimated time for each task because we put it in the state of 'to verify' when it is in testing phase)-->
- Code review 
  - Total hours estimated: not available
  - Total hours spent
  <!--(Hours are inside the estimated time for each task because we put it in the state of 'to verify' when it is in testing phase)-->

  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  We were thinking that actual time was of two weeks and estimated stories in that way but we started working on monday. We also make some errors in tracking.

- What lessons did you learn (both positive and negative) in this sprint?
  Tracking working type is fundamental to have a better idea of the work performed and we need a better intra-team communication.

- Which improvement goals set in the previous retrospective were you able to achieve? 
  We understood better VCS and some code review and learnt something about e2e tests.

- Which ones you were not able to achieve? Why?
  Unit tests, and testing in general, using YouTrack.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  In terms of team coordination we need a better experience with YouTrack and remember constantly tracking.
  Technical tasks are about how to use PostGis for GPS queries.

> Propose one or two

- One thing you are proud of as a Team!!
  Helping each other when someone is in trouble and open mind to critics and improve about them.