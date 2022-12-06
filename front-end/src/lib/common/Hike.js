export const HikeDifficultyLevel = {
    Tourist : 0,
    Hiker : 1,
    Pro : 2,
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