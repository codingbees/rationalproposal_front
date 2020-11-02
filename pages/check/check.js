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
        console.log("userInfo is")
        console.log(res)
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
                console.log("res in getCheckList")
                console.log(resp)
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
      url: '/pages/check/toBeChecked/toBeChecked?no='+ev.index
    })
  },
  onSwitchClick() {
    this.setData({
      changeSwitch: !this.data.changeSwitch,
    });
    my.alert({
      content: 'switch changed',
    });
  },
  onCheckClick() {
    this.setData({
      changeCheckbox: !this.data.changeCheckbox,
    });
    my.alert({
      content: 'checkbox changed',
    });
  },
  onCapsuleClick() {
    my.alert({
      content: 'capsule button click',
    });
  },
  onScrollToLower() {
    this.setData({
      loadMore: 'load',
    });
    const { items5 } = this.data;
    // 加入 maxList 用于判断“假设”数据加载完毕后的情况
    if (this.data.maxList > 0) {
      const newItems = items5.concat(newitems);
      const MAXList = this.data.maxList - 1;
      this.setData({
        items5: newItems,
        maxList: MAXList,
      });
    } else {
      // 数据加载完毕之后，改变 loadMore 为 over 即可
      this.setData({
        loadMore: 'over',
      });
    }
  },
  onAlphabetClick(ev) {
    my.alert({
      content: JSON.stringify(ev.data),
    });
  },
});
