// import React, { useContext, useReducer } from 'react';
// import axios from 'axios';
// interface RoomState {
//   other_user_id: string;
//   user_id: string;
//   room_id: string;
//   name: string;
//   room_user_id: string;
// }

// type RoomAction = { type: 'SET_ROOM_AND_USER'; payload: { user_id: string, room_id: string; name: string, other_user_id: string, room_user_id: string} };

// interface RoomContextType {
//   state: RoomState;
//   dispatch: React.Dispatch<RoomAction>;
// }

// const RoomContext = React.createContext<RoomContextType>({
//   state: { user_id: '', room_id: '', name: '', other_user_id: '',   room_user_id: '' },
//   dispatch: () => { },
// });

// export const useRoom = () => {
//   return useContext(RoomContext);
// };

// interface Props {
//   children: React.ReactNode;
// }

// const roomReducer = (state: RoomState, action: RoomAction) => {
//   switch (action.type) {
//     case 'SET_ROOM_AND_USER':
//       return {
//         ...state,
//         user_id: action.payload.user_id,
//         room_id: action.payload.room_id,
//         name: action.payload.name,
//         other_user_id: action.payload.other_user_id,
//         room_user_id: action.payload.room_user_id,
//       };
//     default:
//       return state;
//   }
// };

// export const RoomProvider = ({ children }: Props) => {
//   const [state, dispatch] = useReducer(roomReducer, { user_id: '', room_id: '', name: '', other_user_id: '',   room_user_id: '' });

//   const value = {
//     state,
//     dispatch,
//   };

//   return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
// };

import React, { useContext, useState } from 'react';
import axios from 'axios';

interface RoomState {
  other_user_id: string;
  user_id: string;
  room_id: string;
  room_name: string;
  name: string;
  room_user_id: string;
}

interface RoomContextType {
  state: RoomState;
  setState: React.Dispatch<React.SetStateAction<RoomState>>;
}

const RoomContext = React.createContext<RoomContextType>({
  state: { user_id: '', room_id: '', name: '', other_user_id: '', room_user_id: '', room_name: '' },
  setState: () => {},
});

export const useRoom = () => {
  return useContext(RoomContext);
};

interface Props {
  children: React.ReactNode;
}

export const RoomProvider = ({ children }: Props) => {
  const [state, setState] = useState<RoomState>({
    user_id: '',
    room_id: '',
    room_name: '',
    name: '',
    other_user_id: '',
    room_user_id: '',
  });

  const value = {
    state,
    setState,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

