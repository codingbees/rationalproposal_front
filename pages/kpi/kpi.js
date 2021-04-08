let app = getApp()

Page({
  onLoad() {
    let curDate = new Date()
    let curYear = curDate.getFullYear()
    let curMonth = curDate.getMonth() + 1

    if (curMonth == 1) {
      this.setData({
        checkYear: curYear - 1,
        checkMonth: 12,
      })
    } else if (curMonth < 11 && curMonth > 1) {
      this.setData({
        checkYear: curYear,
        checkMonth: '0' + (curMonth - 1),
      })
    } else {
      this.setData({
        checkYear: curYear,
        checkMonth: (curMonth - 1),
      })
    }
    let checkDate = this.data.checkYear + '-' + this.data.checkMonth
    // console.log(checkDate)
    this.getMonthlyList(checkDate)
    this.getKpiTarget(checkDate)
    // this.getAwardList(checkDate)
  },
  data: {
    totalList: [],
    toView: 'section',
    scrollTop: 100,
    checkYear: '',
    checkMonth: '',
    originList: [],
    totalListAward: [],
    kpi_target: '',
    thismonth: '',
    monthyList: [],
    yearly_close_rate_target: 90,
    check_rate_target: 0,
    average_target: 0.1,
    yearlyList: []

  },
  datePicker() {
    let _this = this
    my.datePicker({
      format: 'yyyy-MM',
      startDate: '2021-1-1',
      success: (res) => {
        let selDate = res.date
        let selYear = selDate.split('-')[0]
        let selMonth = selDate.split('-')[1]
        
        const select = new Date(selDate+'-01')
        const now = new Date();
        if (select > now) {
          dd.alert({
            title:'提示',
            content:''+selYear+'年'+selMonth+"月份还没有数据",
            buttonText: '我知道了',
          })
          return
        } 


        if (_this.year != parseInt(selYear) && _this.lastMonth != parseInt(selMonth)) {
          this.setData({
            checkYear: selYear,
            checkMonth: selMonth
          })
          let checkDate = this.data.checkYear + '-' + this.data.checkMonth
          this.getMonthlyList(checkDate)
          // this.getYearlyList(checkDate)
        }
      },
    });
  },

  getKpiTarget(checkDate) {
    let year = checkDate.split("-")[0];
    dd.httpRequest({
      url: app.globalData.serverUrl + '/check/getKPITargetByYear',
      method: 'POST',
      dataType: 'json',
      data: { year },
      success: res => {

        this.setData({
          yearly_close_rate_target: res.data.kpiList[0].yearly_close_rate_target,
          average_target: res.data.kpiList[0].average_target,
          check_rate_target: res.data.kpiList[0].check_rate_target
        })
      },
      fail: res => {

      }
    })
  },
  getMonthlyList(checkDate) {
    dd.showLoading({
      title: '加载中...'
    });
    let _this = this
    dd.httpRequest({
      url: app.globalData.serverUrl + '/check/getMonthKpi',
      method: 'POST',
      dataType: 'json',
      data: { checkDate },
      success: (res) => {

        // this.setData({
        //   kpi_target:res.data.kpi_target[0].target+'%'
        // })

        //先计算月度数据
        let [...list] = res.data.monthyList
        let workshop_data_month = list.map(item => {
          return {
            ...item,
            average: (item.month_accept / item.staff_qty).toFixed(2),
            close_rate: item.year_total_accept != 0 ? (100 * item.month_closed / item.year_total_accept).toFixed(2) : 100.00,
            check_rate: item.month_total != 0 ? (100 * item.month_checked / item.month_total).toFixed(2) : 100.00
          }
        })

        let [...monthyDepartsList] = res.data.monthyDepartsList

        let department_data = monthyDepartsList.map(item => {

          let month_accept = workshop_data_month.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.month_accept
          }, 0)

          let month_checked = workshop_data_month.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.month_checked
          }, 0)
          let month_total = workshop_data_month.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.month_total
          }, 0)
          let staff_qty = workshop_data_month.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.staff_qty
          }, 0)

          let year_total_accept = workshop_data_month.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.year_total_accept
          }, 0)
          let month_closed = workshop_data_month.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.month_closed
          }, 0)
          let month_unclosed = workshop_data_month.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.month_unclosed
          }, 0)

          return {
            ...item,
            month_total,
            month_accept,
            month_checked,
            month_closed,
            month_unclosed,
            staff_qty,
            year_total_accept,
            average: (month_accept / staff_qty).toFixed(2),
            close_rate: year_total_accept != 0 ? (100 * month_closed / year_total_accept).toFixed(2) : 100.00,
            check_rate: month_total != 0 ? (100 * month_checked / month_total).toFixed(2) : 100.00
          }
        });

        // console.log('department_data')
        // console.log(department_data)
        //计算全公司月度数据
        let company = [{ productionLine: '全公司', id: 0 }]
        let company_data = company.map(item => {
          let month_accept = department_data.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.month_accept
          }, 0)

          let month_checked = department_data.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.month_checked
          }, 0)
          let month_total = department_data.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.month_total
          }, 0)
          let staff_qty = department_data.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.staff_qty
          }, 0)

          let year_total_accept = department_data.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.year_total_accept
          }, 0)
          let month_closed = department_data.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.month_closed
          }, 0)
          let month_unclosed = department_data.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.month_unclosed
          }, 0)


          return {
            ...item,
            month_total,
            month_accept,
            month_checked,
            month_closed,
            month_unclosed,
            staff_qty,
            year_total_accept,
            average: (month_accept / staff_qty).toFixed(2),
            close_rate: year_total_accept != 0 ? (100 * month_closed / year_total_accept).toFixed(2) : 100.00,
            check_rate: month_total != 0 ? (100 * month_checked / month_total).toFixed(2) : 100.00
          }
        })


        let monthyList = [...company_data, ...department_data, ...workshop_data_month]

        // console.log('monthyList')
        // console.log(monthyList)
        this.setData({ monthyList: monthyList });

        //计算年度数据
        let [...list1] = res.data.yearlyList
        let workshop_data_year = list1.map(item => {
          return {
            ...item,
            average: (item.year_total_accept / item.year_total_staff_qty).toFixed(2),
            close_rate: item.year_total_accept != 0 ? (100 * item.year_total_closed / item.year_total_accept).toFixed(2) : 100.00,
            check_rate: item.year_total != 0 ? (100 * item.year_total_checked / item.year_total).toFixed(2) : 100.00
          }
        })
        let [...yearDpartsList] = res.data.monthyDepartsList

        let department_data_year = yearDpartsList.map(item => {

          let year_total_staff_qty = workshop_data_year.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.year_total_staff_qty
          }, 0)

          let year_total_accept = workshop_data_year.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.year_total_accept
          }, 0)
          let year_total_closed = workshop_data_year.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.year_total_closed
          }, 0)

          let year_total_checked = workshop_data_year.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.year_total_checked
          }, 0)
          let year_total = workshop_data_year.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.year_total
          }, 0)

          return {
            ...item,
            year_total_accept,
            year_total_staff_qty,
            year_total_closed,
            year_total_checked,
            year_total,
            average: (year_total_accept / year_total_staff_qty).toFixed(2),
            close_rate: year_total_accept != 0 ? (100 * year_total_closed / year_total_accept).toFixed(2) : 100.00,
            check_rate: year_total != 0 ? (100 * year_total_checked / year_total).toFixed(2) : 100.00
          }
        });
        // console.log('department_data_year list')
        // console.log(department_data_year)
        let compay_data_year = company.map(item => {

          let year_total_staff_qty = department_data_year.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.year_total_staff_qty
          }, 0)

          let year_total_accept = department_data_year.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.year_total_accept
          }, 0)
          let year_total_closed = department_data_year.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.year_total_closed
          }, 0)

          let year_total_checked = department_data_year.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.year_total_checked
          }, 0)
          let year_total = department_data_year.filter(element => {
            return element.pid == item.id
          }).reduce((pre, cur) => {
            return pre + cur.year_total
          }, 0)

          return {
            ...item,
            year_total_accept,
            year_total_staff_qty,
            year_total_closed,
            year_total_checked,
            year_total,
            average: (year_total_accept / year_total_staff_qty).toFixed(2),
            close_rate: year_total_accept != 0 ? (100 * year_total_closed / year_total_accept).toFixed(2) : 100.00,
            check_rate: year_total != 0 ? (100 * year_total_checked / year_total).toFixed(2) : 100.00
          }
        });

        let new_year_list = [...compay_data_year, ...department_data_year, ...workshop_data_year]
        this.setData({
          yearlyList: new_year_list
        })
        // console.log('year list')
        // console.log(new_year_list)
      },
      fail: (res) => {
        console.log("httpRequestFail---", res)
        dd.alert({ content: JSON.stringify(res) });
      },
      complete: (res) => {
        dd.hideLoading();
      }
    });
  },
  //获取激励记录
  getAwardList(checkDate) {
    dd.httpRequest({
      url: app.globalData.serverUrl + '/sixs/getAwardList',
      method: 'POST',
      dataType: 'json',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      data: { checkDate },
      success: (res) => {
        // console.log("res from getAwardList")
        // console.log(res.data)
        let [...list] = res.data.totalListAward
        let workshop_data_month = list.map(item => {
          return {
            ...item,
            average: (item.month_accept / item.staff_qty).toFixed(2),
            close_rate: (item.year_total_closed / item.year_total_accept).toFixed(2)
          }
        })
        // console.log(workshop_data_month)
        this.setData({
          totalListAward: workshop_data_month
        })
      },
      fail: (res) => {
        console.log("httpRequestFail---", res)
        dd.alert({ content: JSON.stringify(res) });
      },
      complete: (res) => {
        dd.hideLoading();
      }
    });
  }


});