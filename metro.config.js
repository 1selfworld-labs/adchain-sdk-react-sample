const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  // 로컬 SDK 패키지를 위한 watchFolders 추가
  watchFolders: [
    path.resolve(__dirname, '../adchain-sdk-react-native'),
  ],

  resolver: {
    // SDK 패키지의 node_modules는 제외 (중복 패키지 방지)
    blockList: exclusionList([
      new RegExp(path.resolve(__dirname, '../adchain-sdk-react-native/node_modules') + '/.*'),
    ]),

    // 현재 프로젝트의 node_modules만 사용
    nodeModulesPaths: [
      path.resolve(__dirname, './node_modules'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
