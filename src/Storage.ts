import { NativeModules } from 'react-native';

const LINKING_ERROR =
  `The Storage module doesn't seem to be linked. Make sure you have rebuilt the app after installing the package.`;

const Storage = NativeModules.Storage
  ? NativeModules.Storage
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export default Storage;