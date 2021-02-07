let app = getApp()


Page({
  data: {
    getCheckItem: {},
    handlers: [],
    indexHandler: 0,
    no: '',
    img: [],
    src: 'http://110.186.68.166:18901/rationalproposal/',
    fileqty: 0,
    filename: '',
    fileupdateqty: 0,
    handler_username:'',
    handler_userid:''

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
      url: app.globalData.serverUrl + '/check/getHandleItem',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      data: { rp_no: query.no },
      dataType: 'json',
      success: res => {
        console.log(res)
        this.setData({ getCheckItem: res.data.getCheckItem });
        this.setData({ img: res.data.img });
      },
      fail: function (res) {
        dd.alert({ content: '发起失败，未知原因，请联系管理员' });
      }
    });
    dd.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({ userid: res.data.userid });
        this.setData({ partid: res.data.department });
        this.setData({ username: res.data.name });
        this.setData({ partname: res.data.departments });
      },
      fail: function (res) {
        dd.alert({ content: res.errorMessage })
      }
    });
    dd.setNavigationBar({
      title: '处理建议'
    });
  },
  selectDate() {
    dd.datePicker({
      format: 'yyyy-MM-dd',
      success: (res) => {
        this.setData({ acturalFinishDate: res.date })
      },
    });
  },
  changename(e){
    console.log('change name ')
    console.log(e)
    this.setData({
      handler_username:e.detail.value
    })
  },
  changeid(e){
    console.log('change id ')
    console.log(e)
    this.setData({

      handler_userid:e.detail.value
    })
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
  selectFile() {
    var _this = this;
    dd.chooseImage({
      sourceType: ['camera', 'album'],
      count: 9,
      success: res => {
        console.log("chooseImage res is:")
        console.log(res)
        var paths = new Array();
        for (let i = 0; i < res.filePaths.length; i++) {
          paths[i] = (res.filePaths && res.filePaths[i]) || (res.apFilePaths && res.apFilePaths[i]);
          this.data.fileupdateqty++;
          this.setData({ fileqty: this.data.fileupdateqty })
          dd.uploadFile({
            url: app.globalData.serverUrl + '/check/uploadFilehandle',
            fileType: 'image',
            fileName: 'file',
            filePath: paths[i],
            success: res => {
              let resp = JSON.parse(res.data);
              // this.setData({filename:resp.fileName});
              this.data.filename += resp.fileName;
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
  onSubmit: function (e) {
    e.detail.value.picture_after_improve = this.data.filename;
    e.detail.value.id = this.data.getCheckItem.id;
    
    var formdata = e.detail.value;
    if(formdata.handler_username==null||"" == formdata.handler_username ||formdata.handler_userid==null||"" == formdata.handler_userid){
          dd.showToast({ content: '请填写处理人信息！' })
          return false
      }
    if (formdata.desc_aft_db_audit == null || "" == formdata.desc_aft_db_audit) {
      dd.showToast({ content: '请填写改善完成情况描述！' })
      return false;
    }
    if (e.detail.value.is_difficult_aft_ck) {
      e.detail.value.is_difficult_aft_ck = 1
    } else { e.detail.value.is_difficult_aft_ck = 0 }
    
    if (e.detail.value.is_excellent_aft_ck) {
      e.detail.value.is_excellent_aft_ck = 1
    } else { e.detail.value.is_excellent_aft_ck = 0 }

    dd.httpRequest({
      url: app.globalData.serverUrl + '/check/submitDoubleAudit?rp_no=' + this.data.no,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      data: e.detail.value,
      dataType: 'json',
      success: function (res) {
        dd.showToast({
          type: 'success',
          content: "已成功提交",
          duration: 1000
        });

      },
      fail: function (res) {
        dd.alert({ content: '发起失败，未知原因，请联系管理员' });
      },
      complete: function (res) {
        dd.navigateBack({
          delta: 2
        })
      }
    });
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },

});


