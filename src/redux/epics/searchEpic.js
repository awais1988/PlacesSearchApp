import { of, from } from "rxjs";
import {
  filter,
  switchMap,
  map,
  catchError,
  debounceTime,
  withLatestFrom,
} from "rxjs/operators";
import { combineEpics } from "redux-observable";
import { setResults } from "../slices/placesSlice";
import { setLoading, setError, clearError } from "../slices/uiSlice";

const debouncedSearchEpic = (action$, state$) =>
  action$.pipe(
    filter((action) => action.type === "places/setSearchQuery"),
    debounceTime(400),
    withLatestFrom(state$),
    filter(([action, state]) => {
      const query = action.payload;
      return query && query.length >= 2;
    }),
    switchMap(([action, state]) => {
      const query = action.payload;

      const loadingAction = setLoading(true);
      const clearErrorAction = clearError();

      return of(loadingAction, clearErrorAction).pipe(
        switchMap(() => {
          const { searchPlaces } = require("../../services/placesApi");

          return from(searchPlaces(query)).pipe(
            switchMap((suggestions) => {
              return of(setResults(suggestions), setLoading(false));
            }),
            catchError((error) => {
              console.error("Search error in epic:", error);
              return of(
                setError(error.message || "Search failed"),
                setResults([]),
                setLoading(false)
              );
            })
          );
        })
      );
    }),
    catchError((error) => {
      console.error("Epic error:", error);
      return of(setError("An unexpected error occurred"), setLoading(false));
    })
  );

export default combineEpics(debouncedSearchEpic);
