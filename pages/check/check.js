let app = getApp()
Page({
  data: {
    listToBeChecked: [],
    checkValues: {},
    changeCheckbox: true,
    changeSwitch: true,
    getCheckListIsEmpty: false,
    userid:'',
    partid:'',
    partname:'',
    username:'',
  },
  onLoad() {
    dd.getStorage({
      key:'userInfo',
      success:(res) => {

        this.setData({userid : res.data.jobnumber});
        this.setData({partid : res.data.department});
        this.setData({username : res.data.name});
        this.setData({partname : res.data.departments});
        // this.setData({arrayDep : [res.data.departments]}); 获取用户所在的部门
          dd.httpRequest({
              url: app.globalData.serverUrl + '/check/getCheckList',
              data: {userid:res.data.jobnumber},
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
              dataType: 'json',
              success: resp => {

                if(resp.data.arraytoBeChecked.length == 0){
                  this.setData({ getCheckListIsEmpty: true });
                }else{
                  this.setData({ getCheckListIsEmpty: false });
                }
                this.setData({ listToBeChecked: resp.data.arraytoBeChecked });
              },
              fail: function (res) {
                dd.alert({ content: 'check/getCheckList发起失败，未知原因，请联系管理员' });
              }
            });
      },
      fail:function(res){
        dd.alert({content:res.errorMessage})
      }
    });
    
  },
  onItemClick(ev) {
    console.log("ev is:")
    console.log(ev);
    dd.navigateTo({
      url: '/pages/check/toBeChecked/toBeChecked?no='+ev.currentTarget.dataset.rpno
    })
  },

});
