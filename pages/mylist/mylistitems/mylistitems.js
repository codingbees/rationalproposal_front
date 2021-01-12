let app = getApp()


Page({
  data: {
    getCheckItem:[],
    handlers:[],
    indexHandler:0,
    no:'',
    img:[],
    src: 'http://110.186.68.166:18901/rationalproposal/',
    img2:[],
    fileqty : 0,
    filename:'',
    fileupdateqty: 0,
  },
  handlerChange(e) {
    this.setData({
      indexHandler: e.detail.value,
    });
  },
  onLoad(query) {
    this.setData({
      no: query.no,
    });
    dd.httpRequest({
      url: app.globalData.serverUrl+'/check/getListItems',
      method: 'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data: {no : query.no},
      dataType: 'json',
      success: res => {
        console.log('getCheckItem is:')
        console.log(res)
        this.setData({getCheckItem : res.data.getCheckItem});
        this.setData({img : res.data.img});
        this.setData({img2 : res.data.img2});
      },
      fail: function(res) {
        dd.alert({content: `获取数据失败：${JSON.stringify(res)}`});
      }
    });
    dd.getStorage({
      key:'userInfo',
      success:(res) => {
        this.setData({userid : res.data.userid});
        this.setData({partid : res.data.department});
        this.setData({username : res.data.name});
        this.setData({partname : res.data.departments});
      },
      fail:function(res){
        dd.alert({content:res.errorMessage})
      }
    });
    
  },
  selectDate(){
    dd.datePicker({
      format: 'yyyy-MM-dd',
      success: (res) => {
        this.setData({acturalFinishDate : res.date})
      },
    });
  },
  selectFile(){
    var _this = this;
    dd.chooseImage({
      sourceType: ['camera', 'album'],
      count: 9,
      success: res => {
        console.log("chooseImage res is:")
        console.log(res)
        var paths = new Array();
        for(let i = 0;i <res.filePaths.length;i++ ){
           paths[i] = (res.filePaths && res.filePaths[i]) || (res.apFilePaths && res.apFilePaths[i]);
           this.data.fileupdateqty++;
           this.setData({fileqty : this.data.fileupdateqty})
           dd.uploadFile({
          url: app.globalData.serverUrl+'/uploadFile',
          fileType: 'image',
          fileName: 'file',
          filePath: paths[i],
          success: res => {
            let resp =JSON.parse(res.data);
            // this.setData({filename:resp.fileName});
            this.data.filename+=resp.fileName;
            console.log("file names are:")
            console.log(this.data.filename)
          },
          fail: function (res) {
            dd.alert({ title: `上传失败：${JSON.stringify(res)}` });
          },
        });
        }
      },
    });
  },
  previewImage(e){
    console.log("e in preview is ")
    console.log(e.currentTarget.dataset.img)
    my.previewImage({
      current: 2,
      urls: [
        this.data.src+e.currentTarget.dataset.img
        
      ],
    });

  },
  toCancle(e){
    console.log('event is',e)
    dd.confirm({
  title: '撤销此建议',
  content: '您确定要撤销这条待审核的建议吗？',
  confirmButtonText: '确定要撤销',
  cancelButtonText: '点错了',
  success: (result) => {
    console.log('e is')
    console.log(e.currentTarget.dataset.x)
    console.log('result')
    console.log(result)
    if(result.confirm){
    dd.httpRequest({
      url: app.globalData.serverUrl+'/check/tocancle?rpno='+e.currentTarget.dataset.x,
      method: 'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      dataType: 'json',
      success: function(res) {
        if(res.code==200)
        dd.showToast({
          type: 'success',
          content: "已成功撤销",
          duration: 1000
        })
      },
      fail: function(res) {
        dd.alert({content: '撤销失败'+res});
      },
      complete: function(res) {
          dd.reLaunch({
            url:'/pages/mylist/mylist'
          })
        }
    });
    }
  },
});
  },
  onSubmit: function(e) {
    e.detail.value.picture_after_improve = this.data.filename;
     var formdata = e.detail.value;
    if(formdata.description_after_improve == null || "" == formdata.description_after_improve){
      dd.showToast({content:'请填写改善完成情况描述！'})
      return false;
    }
    if(formdata.actural_finish_date == null || "" == formdata.actural_finish_date){
      dd.showToast({content:'请选择完成日期！'})
      return false;
    }
    dd.httpRequest({
      url: app.globalData.serverUrl+'/check/submitHandle?no='+this.data.no,
      method: 'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data:e.detail.value,
      dataType: 'json',
      success: function(res) {
        dd.showToast({
          type: 'success',
          content: "已成功提交",
          duration: 1000
        });
      },
      fail: function(res) {
        dd.alert({content: '发起失败，未知原因，请联系管理员'});
      },
      complete: function(res) {
        if(res.data.code==200){
          dd.showToast({
          type: 'success',
          content: "已成功提交",
          duration: 1000
        });
          dd.redirectTo({
            url:'/pages/handle/handle'
          })
        }
      }
    });
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  imageError(e) {
    console.log('imageError加载错误', e.detail.errMsg);
  },
  onTap(e) {
    console.log('image 发生 tap 事件', e);
  },
  imageLoad(e) {
    console.log('image 加载成功', e);
  },
});


