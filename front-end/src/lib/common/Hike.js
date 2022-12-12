export const HikeDifficultyLevel = {
    Tourist : 0,
    Hiker : 1,
    Pro : 2,
}

export const UserHikeState = {
    ACTIVE: 1,
    FINISHED: 2,
    ALL: 3
}

export const TrackingState = {
    NOT_STARTED: 0,
    STARTED: 1,
    FINISHED: 2
}

export function getHikeDifficultyString(level) {
    switch(level) {
        case HikeDifficultyLevel.Tourist: {
            return "Tourist";
        }
        case HikeDifficultyLevel.Hiker: {
            return "Hiker";
        }
        case HikeDifficultyLevel.Pro: {
            return "Pro";
        }
       default: {
            return "";
        }
    }
}