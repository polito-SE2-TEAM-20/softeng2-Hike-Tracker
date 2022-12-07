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
- 8 committed vs 4 done 

- Total points committed vs. done 
- 64 points committed vs 32 done

- Nr of hours planned vs. spent (as a team)
- 72h estimated vs. 78h 45m spent

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
  - Total hours estimated: 4h45m
  - Total hours spent: 4h45m
  <!--(It's up to person to split dev and testing, so not all tasks have a corresponding testing tasks)-->
- Code review 
  - Total hours estimated: 1h
  - Total hours spent: 1h
  


## ASSESSMENT

- What caused your errors in estimation (if any)?  
  Originally we estimated tasks based on our current understanding, but during the development sometimes we came to realization that task is actually larger/requires more effort.

- What lessons did you learn (both positive and negative) in this sprint?  
  - More due-diligence before starting the sprint, asking stakeholders about all the caveats and questions we have.
  - Better distribute time of the entire sprint so we don't work 10h the last day.

- Which improvement goals set in the previous retrospective were you able to achieve?  
  - We set time for code review and achieved better quality of resulting code.
  - Smaller tasks by splitting the bigger ones into smaller tasks.
  - Wrote more tests and achieved larger code coverage.
  - Improved our team coordination and communication in terms of fe/be, be/be communication.
  
- Which ones you were not able to achieve? Why?  
  None, we achieved all of them.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.). 
  - More time for code reviewing.
  - Improve communication even more (more scrum meetings to sync better).
  - Better distribute our workload during sprint duration and avoid. inconsistency in working time between different days.
  - TECHNICAL DEBT target:
    - remove all the code smells under 15 min of effort (increase maintainability in the BE);
    - increase the test coverage up to 80% for the BE (right now 73%).
    - increase reliability of front end up to 80%.
    - write the readme file

> Propose one or two

- One thing you are proud of as a Team!!  
  - Finishing ~80% of the stories we set for this sprint.
  - Achieving better code coverage with tests.
