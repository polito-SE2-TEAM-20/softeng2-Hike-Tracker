TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done 
- Total points committed vs. done 
- Nr of hours planned vs. spent (as a team)

**Remember**a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |         |       |            |              |
| n      |         |        |            |              |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1

  
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

> Propose one or two

- One thing you are proud of as a Team!!  
  - Finishing ~80% of the stories we set for this sprint.
  - Achieving better code coverage with tests.
