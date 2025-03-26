/// <reference path="../node_modules/miniprogram-api-typings/index.d.ts" />

interface IAppOption {
  globalData: Record<string, any>;
}

App<IAppOption>({
  globalData: {},
  onLaunch() {
    console.log('App launched')
  }
}) 