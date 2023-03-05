import { combineReducers } from 'redux';

const markers = (state = [], action) => {
    switch (action.type) {
        case 'SET_MARKERS':
            return action.payload;
    }
    return state;
}

const animals = (state = [], action) => {
    switch (action.type) {
        case 'SET_ANIMALS':
            return action.payload;
    }
    return state;
}

export default combineReducers({
    markers,
    animals
});