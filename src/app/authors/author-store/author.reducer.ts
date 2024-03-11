import { Author } from '../author.model';
import * as AuthorsActions from './author.actions';

export interface State {
  authors: Author[];
}

const initialState: State = {
  authors: [],
};

export function authorReducer(
  state = initialState,
  action: AuthorsActions.AuthorsActions
) {
  switch (action.type) {
    case AuthorsActions.SET_AUTHORS:
      return {
        ...state,
        authors: [...action.payload],
      };
    case AuthorsActions.ADD_AUTHOR:
      return {
        ...state,
        authors: [...state.authors, action.payload],
      };
    case AuthorsActions.UPDATE_AUTHOR:
      const updatedAuthor = {
        ...state.authors[action.payload.index],
        ...action.payload.newAuthor,
      };

      const updatedAuthors = [...state.authors];
      updatedAuthors[action.payload.index] = updatedAuthor;

      return {
        ...state,
        authors: updatedAuthors,
      };
    case AuthorsActions.DELETE_AUTHOR:
      return {
        ...state,
        authors: state.authors.filter((author, index) => {
          return index != action.payload;
        }),
      };
    default:
      return state;
  }
}
