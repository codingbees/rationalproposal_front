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
    managerid:''
  },
  onLoad() {
    dd.getStorage({
      key: 'userInfo',
      success: (res) => {
        
        this.setData({ userid: res.data.jobnumber });
        this.setData({ partid: res.data.department });
        this.setData({ username: res.data.name });
        this.setData({ partname: res.data.departments });
        
        // this.setData({arrayDep : [res.data.departments]}); 获取用户所在的部门
        dd.httpRequest({
          url: app.globalData.serverUrl + '/check/getDoubleAuditList',
          data: { handler_userid: this.data.userid },
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          dataType: 'json',
          success: resp => {

            if (resp.data.DoubleAuditList.length == 0) {
              
              this.setData({ getHandleListIsEmpty: true });
            } else {
              
              this.setData({ getHandleListIsEmpty: false });
            }
            this.setData({ managerid: resp.data.userlist });
            this.setData({ listToBeChecked: resp.data.DoubleAuditList });
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
    //待审核建议是所有人都可以查看的，此处设置审核权限，只有精益专员可以点击审核
    let checkRight =  false
    
    let managerids = this.data.managerid
    for (const key in managerids) {
      if (managerids.hasOwnProperty(key)) {
        const element = managerids[key];
        
        if(this.data.userid == element.ding_user_id){
          checkRight = true
        }
      }
    }
    
    if (!checkRight) {
      dd.showToast({
        type: 'fail',
        content: '该申请正在等待精益专员审核。',
        duration: 1500,
      })
      return
    }
    dd.navigateTo({
      url: '/pages/doubleAudit/toBeDoubleAudit/toBeDoubleAudit?no=' + ev.currentTarget.dataset.rpno
    })
  },


});
