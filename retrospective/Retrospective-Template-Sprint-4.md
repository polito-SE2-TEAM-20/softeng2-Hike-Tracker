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
  - Total hours estimated: not available
  - Total hours spent: 0
  - Nr of automated unit test cases : 0/0
  - Coverage (if available): not available
- E2E testing:
  - Total hours estimated: 8h
  - Total hours spent: 8h25m
- Code review 
  - Total hours estimated: 2h
  - Total hours spent: 2h
- Technical Debt management:
  - Total hours estimated: 1h45m 
  - Total hours spent: 1h30m
  - Hours estimated for remediation by SonarQube: 2h2min
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 2h2min 
  - Hours spent on remediation: 1h30min
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
    - Frontend: 0.9% (Grade A)
    - Backend: 0.2% (Grade A)
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
    - Frontend:
      - Reliability: A
      - Security: A
      - Security Review: E, 0.0% reviewed
      - Maintainability: A, 0.9%
      - Coverage: 0.0%
      - Duplications: 1.7%
    - Backend: 
      - Reliability: A
      - Security: A
      - Security Review: A, 81.8% reviewed
      - Maintainability: A, 0.2%
      - Coverage: 83.6%
      - Duplications: 1.5%


## ASSESSMENT

- What caused your errors in estimation (if any)?
  Unexpected overlap of stories 19 and 21 caused us to exceed the estimated time a littile, but the overall error is not critical and is about 15m per person
- What lessons did you learn (both positive and negative) in this sprint?
  - Usage of documentation allows to aviod doing the same stuff in case when people are not aware of each others work.
  - Properly scheduled work allows to avoid piles of work by the end of the sprint. Since we managed to complete 60% of our tasks before the lask week, we were able to easily finish the rest in the last week, thus avoiding conflicts and lots of work.
- Which improvement goals set in the previous retrospective were you able to achieve? 
  - We decided to put more time on responsiveness of our product on the frontend, and we successfully achieved that.
  
- Which ones you were not able to achieve? Why?
  - We tried to think more about task description and try to implement exactly what stakeholders want - it was possible in all stories except the one about hike tracking - we didn't follow that the stakeholders wanted the possibility to start a hike in the past.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - More coordination with stakeholders
  - Thorough task analysis before estimation, we are still not 100% aligned with stakeholders when it comes to small details

> Propose one or two

- One thing you are proud of as a Team!!
  - Completing all the stories we've estimated
  - Developing such a sytsem that is easily manageable, extendable and flexible to new features.