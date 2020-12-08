let app = getApp()
Page({
  data: {
    listToBeChecked: [],
    checkValues: {},
    changeCheckbox: true,
    changeSwitch: true,
    getHandleListIsEmpty: false,
    userid: '',
    partid: '',
    partname: '',
    username: '',
  },
  onLoad() {
    dd.getStorage({
      key: 'userInfo',
      success: (res) => {
        console.log("userInfo is")
        console.log(res)
        this.setData({ userid: res.data.jobnumber });
        this.setData({ partid: res.data.department });
        this.setData({ username: res.data.name });
        this.setData({ partname: res.data.departments });
        // this.setData({arrayDep : [res.data.departments]}); 获取用户所在的部门
        dd.httpRequest({
          url: app.globalData.serverUrl + '/check/getExcellentList',
          data: { handler_userid: this.data.userid },
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          dataType: 'json',
          success: resp => {
            console.log("res from getExcellentList is ")
            console.log(resp)
            if (resp.data.ExcellentList.length == 0) {
              console.log("resp from getExcellentList is 0")
              this.setData({ getHandleListIsEmpty: true });
            } else {
              console.log("resp from getExcellentList is not 0")
              this.setData({ getHandleListIsEmpty: false });
            }
            this.setData({ listToBeChecked: resp.data.ExcellentList });
          },
          fail: function (resp) {
            dd.alert({ content: '获取待处理清单失败，请联系管理员' });
          }
        });
      },
      fail: function (res) {
        dd.alert({ content: res.errorMessage })
      }
    });

  },
  onItemClick(ev) {
    console.log("ev is:")
    console.log(ev.currentTarget.dataset.rpno);
    if (this.data.userid != 'FL00026763' && this.data.userid != 'FL00000178' ) {
      dd.showToast({
        type: 'fail',
        content: '该申请正在等待精益专员何雯审核。',
        duration: 2500,
      })
      return
    }
    dd.navigateTo({
      url: '/pages/doubleAudit/toBeDoubleAudit/toBeDoubleAudit?no=' + ev.currentTarget.dataset.rpno
    })
  },


});
