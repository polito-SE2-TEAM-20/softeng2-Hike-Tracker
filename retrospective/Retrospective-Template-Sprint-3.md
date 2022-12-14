RETROSPECTIVE (Team 20)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done 
- 16 committed vs 15 done 

- Total points committed vs. done 
- 92 points committed vs 87 done

- Nr of hours planned vs. spent (as a team)
- 72h estimated vs. 73h 25m spent

**Remember**a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   10    |        |   11h      |   10h30m     |
| from issues                                           |
|  #2    |   2     |   3    |    25m     |   25m        |
| Stories Done                                          |
|  #8    |   1     |   8    |    1h15m   |   2h15m      |
|  #9    |   2     |   8    |    2h30m   |   4h         |
|  #33   |   1     |   8    |    2h      |   2h         |
|  #10   |   2     |   8    |    4h30m   |   4h30m      |
|  #11   |   2     |   5    |    2h30m   |   2h30m      |
|  #31   |   2     |   3    |    30m     |   30m        |
|  #32   |   4     |   5    |    5h      |   5h         |
|  #12   |   2     |   3    |    30m     |   30m        |
|  #13   |   4     |   5    |    4h      |   4h         |
|  #14   |   4     |   5    |    6h30m   |   6h40m      |
|  #30   |   3     |   3    |    6h      |   6h         |
|  #15   |   5     |   3    |    6h5m    |   6h20m      |
|  #16   |   2     |   5    |    4h15m   |   5h30m      |
|  #17   |   2     |   13   |    5h      |   5h         |
|  #18   |   2     |   5    |    5h      |   5h         |
| stories committed but not done                        |
|  #19   |   2     |   5    |    4h30m   |   2h45m      |
   
<!--90,30,60,60,45,90,15,10,60,45,90,90,75,90,60,120,120,150,60,90,15,15,120,30,60,90,15,15,60,30,60,90,150,60,120,60,150,60,150,80,120,45,150,30,135,120,150,150,150,150,150
90,30,60,60,45,60,15,10,60,45,90,90,135,135,105,120,120,150,60,90,15,15,120,30,60,90,15,15,60,30,60,90,160,60,120,60,150,60,150,80,120,60,150,30,210,120,150,150,150,150,165 -->

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)

    - hours estimated per task average: 1h 24m
    - hours spent per task average: 1h 27m
    - estimate standard deviation: 45m 
    - average standard deviation: 50m
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1
    - 0.0192

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: not available
  - Total hours spent: 0
  - Nr of automated unit test cases: 0/0 (no unit tests)
  - Coverage (if available): not available
- E2E testing:
  - Total hours estimated: 8h
  - Total hours spent: 8h30m
  <!--(It's up to person to split dev and testing, so not all tasks have a corresponding testing tasks)-->
- Code review 
  - Total hours estimated: 2h
  - Total hours spent: 2h
- Technical Debt management:
  - Total hours estimated : 4h 30m
  - Total hours spent: 4h
  - Hours estimated for remediation by SonarQube: 6h 15m
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 1h 15m
  - Hours spent on remediation: 1h 15m
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.2% (Grade A)
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
    - Reliability: A
    - Security: A
    - Security Review: A, 81.8% reviewed
    - Maintainability: A, 0.2%
    - Coverage: 84.4%
    - Deplicates: 0.2% density 


## ASSESSMENT

- What caused your errors in estimation (if any)?  
  We did story 17, 18 a bit more overcomplicated than it's supposed to be, and due to this we were unable to finish story 19.

- What lessons did you learn (both positive and negative) in this sprint? 
  - Since backend team finished their tasks earlier, frontend team were able to proceed to development with all the info provided and avoid mocking with fake requests.
  - We learned importance of proper documentation for both backend and frontend, since it allows to avoid confusion when other member of the team needs to alter some code written not by them. 
  - We understood the importance of techincal debt and how impactful it may be in the long run, affecting task duration and maintainability. 

- Which improvement goals set in the previous retrospective were you able to achieve?  
  - Increase test coverage up to 80% for backend (it's 84% now)
  - Had more time for code reviewing, which allowed us to have less errors and finish most of the stories.
  - We wrote readme file, which will allow us to maintain the project in the future more easily.
  - Removed all existing code smells under 15 min of effort on backend (up until the new tasks were merged into main branch)
  
- Which ones you were not able to achieve? Why?  
  - Decrease the number of reliability issues of front end by 80% -- not achieved, number of bugs increased by 13. It's because new code was inserted + the team was  too focused on delivering of the features and was unable to complete the debt task.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.).
  - More time on responsiveness of our product (techincal debt frontend)
  - Think more about task description and try to implement exactly what stakeholders want.

> Propose one or two

- One thing you are proud of as a Team!!  
  - Finishing ~90% of the stories we set for this sprint.
  - Working more time-safe and being able to split our work efficiently on the sprint.
