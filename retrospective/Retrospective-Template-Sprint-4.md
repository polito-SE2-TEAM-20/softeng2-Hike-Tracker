TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done 
  - 9 committed vs 9 done
- Total points committed vs done 
  - 44 points committed vs 44 points done
- Nr of hours planned vs spent (as a team)
  - 72h planned vs 73h 40m spent

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
|UNCATEGORIZED     |    -   |            |              |
|  #0    |    18   |    -   |  24h       |    23h 50m   |
|STORIES |         |    -   |            |              |
|  #34   |    3    |   3    |  3h 45m    |     4h 5m    |
|  #19   |    3    |   5    |  5h        |     5h 15m   |
|  #35   |    2    |   5    |  5h        |     5h       |
|  #27   |    3    |   5    |  6h        |     6h 10m   |
|  #29   |    3    |   5    |  4h 45m    |     5h 10m   |
|  #20   |    3    |   8    |  5h 30m    |     5h 50m   |
|  #21   |    3    |   5    |  6h        |     6h 5m    |
|  #22   |    3    |   3    |  6h        |     6h 10m   |
|  #23   |    3    |   5    |  6h        |     6h 15m   |


total tasks: 44
> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)
  - Hours estimated per task average: 2h 3m
  - Hours done per task average: 2h 7m
  - estimated standard deviation: 43m
  - actual standard deviation: 46m
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1
   - 0.0163

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated
  - Total hours spent
  - Nr of automated unit test cases 
  - Coverage (if available)
- E2E testing:
  - Total hours estimated
  - Total hours spent
- Code review 
  - Total hours estimated 
  - Total hours spent
- Technical Debt management:
  - Total hours estimated 
  - Total hours spent
  - Hours estimated for remediation by SonarQube
  - Hours estimated for remediation by SonarQube only for the selected and planned issues 
  - Hours spent on remediation 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
  


## ASSESSMENT

- What caused your errors in estimation (if any)?

- What lessons did you learn (both positive and negative) in this sprint?

- Which improvement goals set in the previous retrospective were you able to achieve? 
  
- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

> Propose one or two

- One thing you are proud of as a Team!!