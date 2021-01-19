let app = getApp()

Page({
  data: {
    no:'',

  },
  onLoad(query) {
    console.log(query)
    this.setData({ no:query.no })

  },
  onSubmit: function(e) {
     var formdata = e.detail.value;
    if(formdata.comment == null || "" == formdata.comment){
      dd.showToast({content:'请填写中止理由！'})
      return false;
    }
    dd.httpRequest({
      url: app.globalData.serverUrl+'/check/toSuspend?rp_no='+this.data.no,
      method: 'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data:e.detail.value,
      dataType: 'json',
      success: function(res) {
        dd.showToast({
          type: 'success',
          content: "已中止",
          duration: 1000
        });
      },
      fail: function(res) {
        dd.alert({content: '操作失败，未知原因，请联系管理员'});
      },
      complete: function(res) {
        
          dd.navigateBack({
            delta: 2
          })
        
      }
    });
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
});
