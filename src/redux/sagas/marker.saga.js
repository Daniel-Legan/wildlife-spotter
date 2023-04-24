import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchMarkers() {
    try {
        const response = yield axios.get(`/api/marker/`);
        yield put({
            type: 'SET_MARKERS',
            payload: response.data
        });
    } catch (error) {
        console.log(error);
    }
}

function* addMarker(action) {
    try {
        yield axios.post('/api/marker', action.payload);
        yield put({ type: 'FETCH_MARKERS' });
    } catch (error) {
        console.log(error);
    }
}

function* fetchAnimals() {
    try {
        const response = yield axios.get(`/api/marker/animals`);
        yield put({
            type: 'SET_ANIMALS',
            payload: response.data
        });
    } catch (error) {
        console.log(error);
    }
}

function* deleteMarker(action) {
    try {
        yield axios.delete(`/api/marker/${action.payload.id}`);
        yield put({ type: 'FETCH_MARKERS' });
    } catch (error) {
        console.log(error);
    }
}

function* editDescription(action) {
    try {
        yield axios.put(`/api/marker/${action.payload.id}`, action.payload);
        yield put({ type: 'FETCH_MARKERS' });
    } catch (error) {
        console.log(error);
    }
}

function* markerSaga() {
    yield takeLatest('FETCH_MARKERS', fetchMarkers);
    yield takeLatest('ADD_MARKER', addMarker);
    yield takeLatest('FETCH_ANIMALS', fetchAnimals);
    yield takeLatest('DELETE_MARKER', deleteMarker);
    yield takeLatest('EDIT_DESCRIPTION', editDescription);
}

export default markerSaga;