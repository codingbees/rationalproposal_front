let app = getApp()

Page({
  data: {
    tabs: [],
    jobnumber:'',
    activeTab: 0,
    typeCapsule: true,
    typeHasSubTitle: false,
    hasPlus: false,
  },
  onLoad() {
    let _this = this
    dd.getStorage({
      key: 'userInfo',
      success: function (res) {
        // dd.alert({ content: '获取成功：' + res.data.cityName });
        console.log(res.data.jobnumber)
        dd.httpRequest({
                    url: app.globalData.serverUrl+'/check/getMyList',
                    method: 'POST',
                    data: {
                        jobnumber : res.data.jobnumber
                    },
                    dataType: 'json',
                    success: (res) => {
                      console.log('success----',res);
                      console.log('getMylist res is:')
                    _this.setData({tabs : res.data});
                    },
                    fail: (res) => {
                      console.log("httpRequestFail---",res)
                      dd.alert({content: JSON.stringify(res)});
                    },
                    complete: (res) => {
                        dd.hideLoading();
                    }
                    
                });
      },
      fail: function (res) {
        dd.alert({ content: res.errorMessage });
      }
    });

  },
  onListItemClick(event){
    console.log("onListItemClick event is:")
    console.log(event)
    dd.navigateTo({
      url: '/pages/mylist/mylistitems/mylistitems?no='+event.index
    })

  },
  handleTabClick({ index, tabsName }) {
    this.setData({
      [tabsName]: index
    });
  },
  handleTabChange({ index, tabsName }) {
    this.setData({
      [tabsName]: index,
    });
  },
  handlePlusClick() {
    my.alert({
      content: 'plus clicked',
    });
  }
});
