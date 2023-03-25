import { combineReducers } from 'redux';

const isFavorite = (state = false, action) => {
    switch (action.type) {
        case 'SET_IS_FAVORITE':
            return action.payload;
    }
    return state;
}

const favorites = (state = {}, action) => {
    switch (action.type) {
        case 'SET_FAVORITES':
            return action.payload;
    }
    return state;
}

export default combineReducers({
    isFavorite,
    favorites
});