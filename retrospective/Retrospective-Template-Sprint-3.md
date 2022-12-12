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
| _#0_   |   8     |        |   12h30m   |   14h30m     |
| from issues                                           |
|  #1    |   2     |   3    |    2h 15m  |   2h 15m     |
|  #2    |   3     |   3    |     7h     |   8h         |
|  #3    |   3     |   5    |     5h15m  |   5h 10m     |
| Stories Done                                          |
|  #4    |   2     |   5    |     4h     |   4h 20m     |
|  #5    |   2     |   3    |     5h     |   11h 30m    |
|  #6    |   3     |   5    |  6h 30m    |   11h        |
|  #7    |   2     |   8    |     4h     |   4h 15m     |
| stories committed but not done                        |
|  #8    |   6     |   8    |     10h    |   9h 45m     |
|  #9    |   3     |   8    |     4h     |   2h         |
|  #33   |   4     |   8    |    7h30m   |   6h         |
|  #10   |   2     |   8    |    4h30m   |   0h         |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)

    - hours estimated per task average: 2h 20m
    - hours spent per task average: 2h 40m
    - estimate standard deviation: 54m 
    - average standard deviation: 1h 38m
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1
    - 0.0155

  
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
