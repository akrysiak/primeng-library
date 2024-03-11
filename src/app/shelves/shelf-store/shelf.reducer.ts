import { Shelf } from '../shelf.model';
import * as ShelvesActions from './shelf.actions';

export interface State {
  shelves: Shelf[];
}

const initialState: State = {
  shelves: [],
};

export function shelfReducer(
  state = initialState,
  action: ShelvesActions.ShelvesActions
) {
  switch (action.type) {
    case ShelvesActions.SET_SHELVES:
      return {
        ...state,
        shelves: [...action.payload],
      };
    case ShelvesActions.ADD_SHELF:
      return {
        ...state,
        shelves: [...state.shelves, action.payload],
      };
    case ShelvesActions.UPDATE_SHELF:
      const updatedShelf = {
        ...state.shelves[action.payload.index],
        ...action.payload.newShelf,
      };

      const updatedShelves = [...state.shelves];
      updatedShelves[action.payload.index] = updatedShelf;

      return {
        ...state,
        shelves: updatedShelves,
      };
    case ShelvesActions.DELETE_SHELF:
      return {
        ...state,
        shelves: state.shelves.filter((shelf, index) => {
          return shelf.id != action.payload;
        }),
      };
    default:
      return state;
  }
}
