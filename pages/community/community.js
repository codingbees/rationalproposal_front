let app = getApp()


Page({
  data: {
    CommunityDataList: {},
    commentArr: [],
    commentcomten: '',
    showrCommentRpno: '',
    ProblemPic: [],
    ProposalPic: [],
    HandlePic: [],
    src: 'http://110.186.68.166:18901/rationalproposal/',
    handlers: [],
    indexHandler: 0,
    no: '',
    img: [],
    fileqty: 0,
    filename: '',
    fileupdateqty: 0,
    userid: '',
    partid: '',
    partname: '',
    username: '',
    userjobnumber: '',
    test: null
  },
  handlerChange(e) {
    this.setData({
      indexHandler: e.detail.value,
    });
  },
  onLoad(query) {
    dd.httpRequest({
      url: app.globalData.serverUrl + '/check/getCommunityDataList',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      dataType: 'json',
      success: res => {
        console.log('res from getCommunityDataList')
        console.log(res)
        this.setData({ CommunityDataList: res.data.CommunityDataList });
      },
      fail: function (res) {
        dd.alert({ content: '发起失败，未知原因，请联系管理员' });
      }
    });
    dd.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({ userid: res.data.userid });
        this.setData({ userjobnumber: res.data.jobnumber });
        this.setData({ partid: res.data.department });
        this.setData({ username: res.data.name });
        this.setData({ partname: res.data.departments });
      },
      fail: function (res) {
        dd.alert({ content: res.errorMessage })
      }
    });
  },
  showProblemPic(e) {
    console.log(e)
    if (e.currentTarget.dataset.pic == null) {
      dd.showToast({
        type: 'fail',
        content: '此处暂无图片'
      })
      return
    }
    let pic = e.currentTarget.dataset.pic
    let ProblemPic = []
    let pics = pic.split(";")
    for (const index in pics) {
      if (index < pics.length - 1) {
        ProblemPic.push(this.data.src + pics[index].substr(pics[index].lastIndexOf("_") + 1));
      }
    }
    my.previewImage({
      urls: ProblemPic,
    });
  },
  showProposalPic(e) {
    if (e.currentTarget.dataset.pic == null) {
      dd.showToast({
        type: 'fail',
        content: '此处无图片描述',
        duration: 1000,

      })
      return
    }
    let pic = e.currentTarget.dataset.pic
    let ProblemPic = []
    let pics = pic.split(";")
    for (const index in pics) {
      ProblemPic.push(this.data.src + pics[index].substr(pics[index].lastIndexOf("_") + 1));
    }
    my.previewImage({
      urls: ProblemPic,
    });
  },
  like(e) {
    let likeuserid = e.currentTarget.dataset.likeuserid
    let rpno = e.currentTarget.dataset.rpno
    let curItem = e.currentTarget.dataset.im

    if (likeuserid != null && curItem.isLike > 0) {
      let userids = likeuserid.split(",")
      for (const index in userids) {
        if (userids[index] === this.data.userjobnumber) {
          dd.showToast({
            title: "提示",//可传空
            content: "你已经点过赞了",
            duration: 1500,
          })
          return
        }
      }
    }
    dd.showToast({
      title: "提示",
      content: "点赞成功",
      duration: 1500,
    })
    let newsumlike = this.data.CommunityDataList.map(item => {
      if (item.rp_no === rpno) {
        return { ...item, sumlike: item.sumlike + 1, isLike: 1, likeuserid: this.data.userjobnumber }
      }
      return { ...item }
    })
    this.setData({
      CommunityDataList: newsumlike,
    })

    dd.httpRequest({
      url: app.globalData.serverUrl + '/check/like',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      data: { likeuserid: this.data.userjobnumber, rpno: rpno },
      dataType: 'json',
      success: res => {
        console.log(res)
      },
      fail: function (res) {
        dd.alert({ content: '点赞失败，未知原因，请联系管理员' });
      }
    });
  },
  comment(e) {
    this.setData({
      commentArr: [],
    })
    console.log('e in comment')
    console.log(e)
    let rpno = e.currentTarget.dataset.rpno
    let newconment = e.currentTarget.dataset.im.newcontent
    if (this.data.showrCommentRpno == rpno) {
      this.setData({
        showrCommentRpno: '',
      })
    } else {
      this.setData({
        showrCommentRpno: rpno,
      })
    }
    if (newconment != null) {
      let newArr = newconment.split("*&^,")
      let l = newArr.length
      let newArray = newArr.map((item) => {
        return item;
      })
      newArr[l - 1] = newArray[l - 1].split('').reverse().join('').slice(3).split('').reverse().join('')
      let newArr2 = []
      for (const key in newArr) {
        newArr2.push(newArr[key].split("$^$"))
      }
      this.setData({
        commentArr: newArr2,
      })
    }

  },

  selectDate() {
    dd.datePicker({
      format: 'yyyy-MM-dd',
      success: (res) => {
        this.setData({ acturalFinishDate: res.date })
      },
    });
  },
  previewImage(e) {
    console.log("e in preview is ")
    console.log(e.currentTarget.dataset.img)
    my.previewImage({
      current: 2,
      urls: [
        this.data.src + e.currentTarget.dataset.img
      ],
    });
  },
  onSubmit: function (e) {
    console.log('e in submit is')
    console.log(e)
    var formdata = e.detail.value;
    if (formdata.haveconments == null) {
      this.setData({
        commentArr: []
      })
    }
    if (formdata.comment == null || "" == formdata.comment) {
      dd.showToast({ type: 'fail', content: '请输入您的评论' })
      return;
    }
    let rpno = formdata.commentrpno
    let _this = this
    dd.httpRequest({
      url: app.globalData.serverUrl + '/check/submitcomment',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      data: {
        rpno: formdata.commentrpno,
        comment_content: formdata.comment,
        commentuserid: this.data.userjobnumber,
        commentusername: this.data.username,
      },
      dataType: 'json',
      success: function (res) {
        console.log("res in success")
        console.log(res)

        let newcomment = _this.data.CommunityDataList.map(item => {
          if (item.rp_no === rpno) {
            if (item.isComment == null) {
              return {
                ...item,
                sumcomment: item.sumcomment + 1,
                isComment: 1,
                newcontent: _this.data.username + res.data.maxId + "$^$" + _this.data.userjobnumber + "$^$" + _this.data.username + "$^$" + formdata.comment + "*&^"
              }
            } else {
              return {
                ...item,
                sumcomment: item.sumcomment + 1,
                isComment: 1,
                newcontent: item.newcontent + "," + res.data.maxId + "$^$" + _this.data.userjobnumber + "$^$" + _this.data.username + "$^$" + formdata.comment + "*&^"
              }
            }
          }
          return { ...item }
        })
        let comments = []
        comments[0] = res.data.maxId
        comments[1] = _this.data.userjobnumber
        comments[2] = _this.data.username
        comments[3] = formdata.comment
        if (_this.data.commentArr == null) {
          _this.setData({
            CommunityDataList: newcomment,
            commentArr: comments,
          })
        } else {
          let newcommentcomten = _this.data.commentArr.map(item => {
            return { ...item }
          })
          newcommentcomten.push(comments)
          _this.setData({
            CommunityDataList: newcomment,
            commentArr: newcommentcomten,
          })
        }

      },
      fail: function (res) {
        dd.alert({ content: '发起失败，未知原因，请联系管理员' });
      },
      complete: function (res) {
      }
    });
    this.setData({
      commentcomten: []
    })
  },
  toDeleteComment(e) {
    let _this = this
    console.log('e in toDeleteComment is')
    console.log(e)
    dd.confirm({
      title: '请确认',
      content: '您确定要删除' + "\"" + e.currentTarget.dataset.content + "\"" + '这条评论吗？',
      confirmButtonText: '确定删除',
      cancelButtonText: '不了',
      success: (result) => {
        console.log('result is:',result)
        if (result.confirm) {
          dd.httpRequest({
            url: app.globalData.serverUrl + '/check/deleteComment',
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            data: { id: e.currentTarget.dataset.id },
            dataType: 'json',
            success: res => {
              console.log('deleteComment success')
              console.log(e.currentTarget.dataset.id)
              console.log(e.currentTarget.dataset.rpnum)
              let id = e.currentTarget.dataset.id.toString()
              let newcomment = _this.data.CommunityDataList.map(item => {
                if (item.rp_no === e.currentTarget.dataset.rpnum) {
                  if (item.sumcomment == 1) {
                    return {
                      ...item,
                      sumcomment: item.sumcomment - 1,
                      isComment: 0,
                      newcontent: ''
                    }
                  } if (id == (item.newcontent.substring(0, item.newcontent.indexOf("$")))) {
                    return {
                      ...item,
                      sumcomment: item.sumcomment - 1,
                      isComment: 1,
                      newcontent: item.newcontent.replace(e.currentTarget.dataset.id + "$^$" + _this.data.userjobnumber + "$^$" + _this.data.username + "$^$" + e.currentTarget.dataset.cont + "*&^,",'')
                    }
                  } else {
                    return {
                      ...item,
                      sumcomment: item.sumcomment - 1,
                      isComment: 1,
                      newcontent: item.newcontent.replace("," + e.currentTarget.dataset.id + "$^$" + _this.data.userjobnumber + "$^$" + _this.data.username + "$^$" + e.currentTarget.dataset.cont + "*&^",'')
                    }
                  }
                }
                return { ...item }
              })


              let newCommentArry = _this.data.commentArr.filter((item) => {
                return item[0] !== e.currentTarget.dataset.id
              })
              _this.setData({
                commentArr: newCommentArry,
                CommunityDataList: newcomment
              })
            },
            fail: function (res) {
              dd.alert({ content: '删除失败，未知原因，请联系管理员' });
            }
          });

        }
      },
    });
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


