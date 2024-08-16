'use client';

import { type Reducer, useReducer } from "react";

export function useLocalState<State>(
	initialState: State,
	onChange?: (newState: State, oldState?: State) => void,
) {
	return useReducer<Reducer<State, Partial<State>>>(
		(state, newState): State => {
			const ret = newState === null ? initialState : { ...state, ...newState };
			onChange?.(ret, state);
			return ret;
		},
		initialState,
	);
}
