import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FavoriteItem from './FavoriteItem';

function FavoriteList() {
    const dispatch = useDispatch();
    const favorites = useSelector((store) => store.favorite.favorites);

    useEffect(() => {
        dispatch({
            type: 'FETCH_FAVORITES'
        });
    }, []);

    return (
        <main>
            <section>
                {favorites.length >= 0 &&
                    favorites.map(item => {
                        return (
                            <FavoriteItem key={item.id} item={item} />
                        )
                    })}
            </section>
        </main>
    );
}

export default FavoriteList;