import storage from 'redux-persist/lib/storage';
import noopStorage from './noopStorage';

const isServer = typeof window === 'undefined';

const persistConfig = {
  key: 'root',
  storage: isServer ? noopStorage : storage,
  whitelist: ['auth']
};

export default persistConfig;
