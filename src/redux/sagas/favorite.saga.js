import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* addFavorite(action) {
    try {
        yield axios.post('/api/favorite', action.payload)

    } catch (error) {
        console.log(error);
    }
}

function* favoriteSaga() {
    yield takeLatest('ADD_FAVORITE', addFavorite);
}

export default favoriteSaga;