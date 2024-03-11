import { Reader } from '../reader.model';
import * as ReadersActions from './reader.actions';

export interface State {
  readers: Reader[];
}

const initialState: State = {
  readers: [],
};

export function readerReducer(
  state = initialState,
  action: ReadersActions.ReadersActions
) {
  switch (action.type) {
    case ReadersActions.SET_READERS:
      return {
        ...state,
        readers: [...action.payload],
      };
    case ReadersActions.ADD_READER:
      return {
        ...state,
        readers: [...state.readers, action.payload],
      };
    case ReadersActions.UPDATE_READER:
      const updatedReader = {
        ...state.readers[action.payload.index],
        ...action.payload.newReader,
      };

      const updatedReaders = [...state.readers];
      updatedReaders[action.payload.index] = updatedReader;

      return {
        ...state,
        readers: updatedReaders,
      };
    case ReadersActions.DELETE_READER:
      return {
        ...state,
        readers: state.readers.filter((reader, index) => {
          return index != action.payload;
        }),
      };
    default:
      return state;
  }
}
