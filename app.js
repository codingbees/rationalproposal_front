App({
  onLaunch(options) {
    // console.log('App Launch', options);
    // console.log('getSystemInfoSync', dd.getSystemInfoSync());
    // console.log('SDKVersion', dd.SDKVersion);
    this.globalData.corpId = options.query.corpId;
  },
  onShow() {
    // console.log('App Show');
  },
  onHide() {
    // console.log('App Hide');
  },
  globalData: {
    //corpId:'ding66c78aa3972dabac35c2f4657eb6378f',
    //serverUrl:'http://125.124.144.5:8888/app'
    corpId:'ding1410adc97eed08c335c2f4657eb6378f',
    //绵阳
    // serverUrl:'http://192.168.110.249/app'
    serverUrl:'http://110.186.68.166:18900/app'
    //湖南
    //serverUrl:'https://hnbiqs.fulinpm.com:8125/app'
    //株洲
    //serverUrl:'https://hnbiqs.fulinpm.com:8225/app'
  }
});