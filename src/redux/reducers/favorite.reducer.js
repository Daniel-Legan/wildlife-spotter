import { combineReducers } from 'redux';

const isFavorite = (state = false, action) => {
    switch (action.type) {
        case 'SET_IS_FAVORITE':
            return action.payload;
    }
    return state;
}

const favorites = (state = null, action) => {
    switch (action.type) {
        case 'SET_FAVORITES':
            return action.payload;
    }
    return state;
}

const centerFavorite = (state = null, action) => {
    switch (action.type) {
        case 'SET_CENTER_FAVORITE':
            return action.payload;
    }
    return state;
}

export default combineReducers({
    isFavorite,
    favorites,
    centerFavorite
});