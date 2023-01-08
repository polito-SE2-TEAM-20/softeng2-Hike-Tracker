import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import SevereColdIcon from '@mui/icons-material/SevereCold';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

export const HikeWeatherByName = {
    'not_provided': {
        'id': 0,
        'image': QuestionMarkIcon
    },
    'sunny': {
        'id': 1,
        'image': WbSunnyIcon
    },
    'raining': {
        'id': 2,
        'image': UmbrellaIcon
    },
    'snowing': {
        'id': 3,
        'image': AcUnitIcon
    },
    'danger_rain': {
        'id': 4,
        'image': ThunderstormIcon
    },
    'danger_snow': {
        'id': 5,
        'image': SevereColdIcon
    },
    'danger_not_classified': {
        'id': 6,
        'image': PriorityHighIcon
    }
}

export const HikeWeatherByCode = {
    0: {
        'name': "Not provided",
        'image': QuestionMarkIcon
    },
    1: {
        'name': "Sunny",
        'image': WbSunnyIcon
    },
    2: {
        'name': "Raining",
        'image': UmbrellaIcon
    },
    3: {
        'name': "Snowing",
        'image': AcUnitIcon
    },
    4: {
        'name': "Dangerous rain",
        'image': ThunderstormIcon
    },
    5: {
        'name': "Dangerous snow",
        'image': SevereColdIcon
    },
    6: {
        'name': "Unclassified danger",
        'image': PriorityHighIcon
    }
}