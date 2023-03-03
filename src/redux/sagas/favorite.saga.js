import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* addFavorite(action) {
    try {
        yield axios.post('/api/favorite', action.payload);

    } catch (error) {
        console.log(error);
    }
}

function* checkPlaceId(action) {
    try {
        const result = yield axios.get(`/api/favorite/${action.payload.placeId}`);

        yield put({ type: 'SET_IS_FAVORITE', payload: result.data.exists });

    } catch (error) {
        console.log(error);
    }
}

function* favoriteSaga() {
    yield takeLatest('ADD_FAVORITE', addFavorite);
    yield takeLatest('CHECK_PLACE_ID', checkPlaceId);
}

export default favoriteSaga;