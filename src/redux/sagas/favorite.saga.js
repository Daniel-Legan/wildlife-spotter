import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* addFavorite(action) {
    try {
        yield axios.post('/api/favorite', action.payload);
        
        yield put({ type: 'CHECK_PLACE_ID', payload: action.payload });

    } catch (error) {
        console.log(error);
    }
}

function* deleteFavorite(action) {
    try {
        yield axios.delete(`/api/favorite/${action.payload.placeId}`);

        yield put({ type: 'CHECK_PLACE_ID', payload: action.payload.placeId });

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

function* fetchFavorites() {
    try {
        const result = yield axios.get(`/api/favorite/`);

        yield put({ type: 'SET_FAVORITES', payload: result.data });

    } catch (error) {
        console.log(error);
    }
}

function* favoriteSaga() {
    yield takeLatest('ADD_FAVORITE', addFavorite);
    yield takeLatest('DELETE_FAVORITE', deleteFavorite);
    yield takeLatest('CHECK_PLACE_ID', checkPlaceId);
    yield takeLatest('FETCH_FAVORITES', fetchFavorites);
}

export default favoriteSaga;