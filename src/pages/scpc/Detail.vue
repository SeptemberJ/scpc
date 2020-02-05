<template>
  <div class="ScpcDetail">
    <el-button type="primary" size="small" @click="toChoose" style="float:right;margin-right:20px;margin-bottom:20px;">选择订单</el-button>
    <el-table id="gttTable" :cell-class-name="cellStyle"
      ref="singleTable"
      border
      :data="ListData"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        property="线别"
        label="线别"
        width="120">
      </el-table-column>
      <el-table-column
        property="零件名称"
        label="零件名称"
        width="120">
      </el-table-column>
      <el-table-column
        property="零件规格"
        label="零件规格"
        width="120">
      </el-table-column>
      <el-table-column
        property="单位"
        label="单位"
        width="120">
      </el-table-column>
      <el-table-column
        property="工单号"
        label="工单号"
        width="120">
      </el-table-column>
      <!-- <el-table-column
        label="工单号"
        width="120">
        <template slot-scope="scope">
          <span>{{scope.row.topLine ? scope.row['工单号'] : ''}}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        property="订单日期"
        label="订单日期"
        width="160">
      </el-table-column>
      <el-table-column
        property="订单号"
        label="订单号"
        width="120">
      </el-table-column>
      <el-table-column
        label="产品名称"
        width="150">
        <template slot-scope="scope">
          <span>{{scope.row.topLine ? scope.row['产品名称'] : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        property="产品工单号"
        label="产品工单号"
        width="120">
      </el-table-column>
      <el-table-column
        property="产品规格"
        label="产品规格"
        width="120">
      </el-table-column>
      <el-table-column
        property="产品工单号"
        label="产品工单号"
        width="120">
      </el-table-column>
      <el-table-column
        property="零件毛需求数量"
        label="零件毛需求数量"
        width="120">
      </el-table-column>
      <el-table-column
        property="可用库存"
        label="可用库存"
        width="120">
      </el-table-column>
      <el-table-column
        property="零件净需求数量"
        label="零件净需求数量"
        width="120">
      </el-table-column>
      <el-table-column
        property="可生产数量"
        label="可生产数量"
        width="120">
      </el-table-column>
      <el-table-column
        property="本次计划数量"
        label="本次计划数量"
        width="120">
      </el-table-column>
      <el-table-column
        label="单位产能"
        width="120">
        <template slot-scope="scope">
          <span>{{scope.row['计划工作时间']}}<i v-if="scope.row['线别']" class="el-icon-edit" style="cursor:pointer;float:right;margin-right:5px;margin-top:5px;" @click="editCN(scope.$index, scope.row)"></i></span>
        </template>
      </el-table-column>
      <el-table-column
        label="需求人数"
        width="120">
        <template slot-scope="scope">
          <span>{{scope.row['需求人数']}}<i v-if="scope.row['线别']" class="el-icon-edit" style="cursor:pointer;float:right;margin-right:5px;margin-top:5px;" @click="editRS(scope.$index, scope.row)"></i></span>
        </template>
      </el-table-column>
      <el-table-column
        property="process"
        label="产线"
        width="120">
      </el-table-column>
      <el-table-column
        label="时间"
        :width="hours.length * 40">
        <!-- <template slot="header">
          <div style="display:flex;">
            <div v-for="(item, idx) in hours" :key="idx" class="Item">{{item}}</div>
          </div>
        </template> -->
        <template slot-scope="scope">
          <div v-if="scope.row.topLine" style="display:flex;">
            <div v-for="(item, idx) in hours" :key="idx" class="Item">{{item}}</div>
          </div>
          <div style="display:flex;">
            <div class="dayData">
              <div class="outer"></div>
              <div class="plant">
                <span v-for="(item, idx) in scope.row.formatHours" :key="idx" style="color: #000;text-align: center;" :class="[item.outer ? 'innerItem bgTransparent' : 'innerItem bgBlue']"></span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 选择订单框 -->
    <el-dialog
      title="选择订单"
      :visible.sync="dialogVisibleOrderList"
      width="90%">
      <el-table
        ref="multipleTable"
        :data="chooseOrderList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="changeChoosedOrder">
        <el-table-column
          type="selection"
          width="60">
        </el-table-column>
        <el-table-column
          property="交货日期"
          label="交货日期"
          width="100">
        </el-table-column>
        <el-table-column
          property="物料名称"
          label="物料名称">
        </el-table-column>
        <el-table-column
          property="物料代码"
          label="物料代码"
          width="120">
        </el-table-column>
        <el-table-column
          property="数量"
          label="数量"
          width="120">
        </el-table-column>
        <el-table-column
          property="单位"
          label="单位"
          width="80">
        </el-table-column>
        <el-table-column
          property="客户名称"
          label="客户名称">
        </el-table-column>
        <el-table-column
          property="单据日期"
          label="单据日期"
          width="100">
        </el-table-column>
        <el-table-column
          property="单据编号"
          label="单据编号"
          width="120">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small"  @click="dialogVisibleOrderList = false">取 消</el-button>
        <el-button type="primary" size="small" @click="analysis">分析</el-button>
      </span>
    </el-dialog>
    <!-- 修改列 -->
    <el-dialog
      :title="editType == 0 ? '修改单位产能' : '修改需求人数'"
      :visible.sync="dialogVisibleEdit"
      width="450px">
      <el-input v-if="editType == 0" v-model="curCN" placeholder="请输入单位产能"></el-input>
      <el-input v-if="editType == 1" v-model="curRS" placeholder="请输入需求人数"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="small"  @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" size="small" @click="saveEdit">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ScpcDetail',
  data () {
    return {
      dialogVisibleOrderList: false,
      dialogVisibleEdit: false,
      chooseOrderList: [],
      choosedOrder: [],
      hours: [],
      week: [],
      // originData: [
      //   {
      //     '生产类型': '紧急',
      //     '产线': '洗衣粉生产线',
      //     '日期': '2019-12-13',
      //     '工单号': 'work001',
      //     '产品名称': '洗衣粉',
      //     '单位': '袋',
      //     hoursData: []
      //   },
      //   {
      //     '生产类型': '',
      //     '产线': '',
      //     '日期': '',
      //     '工单号': '配料',
      //     '产品名称': '',
      //     '单位': '',
      //     hoursData: [
      //       {FSDate: '2019-12-17 08:00:00', FEDate: '2019-12-17 17:00:00'},
      //       {FSDate: '2019-12-17 08:00:00', FEDate: '2019-12-17 12:00:00'},
      //       {FSDate: '2019-12-17 13:00:00', FEDate: '2019-12-17 17:00:00'}
      //     ]
      //   },
      //   {
      //     '生产类型': '',
      //     '产线': '',
      //     '日期': '',
      //     '工单号': '灌装',
      //     '产品名称': '',
      //     '单位': '',
      //     hoursData: [
      //       {FSDate: '2019-12-17 11:00:00', FEDate: '2019-12-17 12:00:00'},
      //       {FSDate: '2019-12-17 13:00:00', FEDate: '2019-12-17 14:00:00'},
      //       {FSDate: '2019-12-17 15:00:00', FEDate: '2019-12-17 17:00:00'}
      //     ]
      //   }
      // ],
      ListData: [],
      curCN: '',
      curRS: '',
      editLine: {}, // 修改行信息
      editType: 0 // 0-产能 1-人数
    }
  },
  created () {
    for (let i = 1; i <= 36; i++) {
      this.hours.push(Number(i))
    }
    // this.formatData()
  },
  methods: {
    cellStyle ({row, column, rowIndex, columnIndex}) {
      if (columnIndex <= 19) {
        return 'cellHasPad'
      }
    },
    toChoose () {
      this.dialogVisibleOrderList = true
      this.getOrderList()
    },
    changeChoosedOrder (value) {
      this.choosedOrder = value
    },
    analysis () {
      if (this.choosedOrder.length === 0) {
        this.$message({
          message: '请至少选择一条要分析的订单!',
          type: 'warning'
        })
        return false
      }
      let DATA = {
        items: this.choosedOrder.map(item => {
          return {
            FInterID: item.FInterID,
            FEntryID: item.FEntryID
          }
        })
      }
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<SEOrder xmlns="http://tempuri.org/">'
      tmpData += '<FJSON>' + JSON.stringify(DATA) + '</FJSON>'
      tmpData += '</SEOrder >'
      tmpData += '</soap:Body>'
      tmpData += '</soap:Envelope>'

      this.Send.post('SEOrder ', tmpData
      ).then(res => {
        let xmlData = this.$x2js.xml2js(res.data)
        let Result = xmlData.Envelope.Body.SEOrderResponse.SEOrderResult
        let Info = JSON.parse(Result)
        if (Info[0].code === '1') {
          this.formatData()
          this.dialogVisibleOrderList = false
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    editCN (idx, row) {
      this.dialogVisibleEdit = true
      this.editType = 0
      this.curCN = row['计划工作时间']
      this.editLine = row
    },
    editRS (idx, row) {
      this.dialogVisibleEdit = true
      this.editType = 1
      this.curRS = row['需求人数']
      this.editLine = row
    },
    saveEdit () {
      if (this.editType === 0 && !this.curCN) {
        this.$message({
          message: '请输入新的单位产能!',
          type: 'warning'
        })
        return false
      }
      if (this.editType === 1 && !this.curRS) {
        this.$message({
          message: '请输入新的需求人数!',
          type: 'warning'
        })
        return false
      }
      let DATA = {
        items: [{
          FBillNO: this.editLine.FBillNO,
          FItemID: this.editLine.FItemID,
          process: this.editLine['工单号'],
          FProductionline: this.editLine['线别'],
          single_capacity: this.editType === 0 ? this.curCN : this.editLine['计划工作时间'],
          number: this.editType === 0 ? this.editLine['需求人数'] : this.curRS
        }]
      }
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<Update xmlns="http://tempuri.org/">'
      tmpData += '<FJSON>' + JSON.stringify(DATA) + '</FJSON>'
      tmpData += '</Update>'
      tmpData += '</soap:Body>'
      tmpData += '</soap:Envelope>'

      this.Send.post('Update', tmpData
      ).then(res => {
        let xmlData = this.$x2js.xml2js(res.data)
        let Result = xmlData.Envelope.Body.UpdateResponse.UpdateResult
        let Info = JSON.parse(Result)
        if (Info[0].code === '1') {
          this.dialogVisibleEdit = false
          this.editLine = {}
          this.editType = ''
          this.curCN = ''
          this.curRS = ''
          this.$message({
            message: '修改成功!',
            type: 'success'
          })
          this.formatData()
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    getOrderList () {
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<JA_LIST xmlns="http://tempuri.org/">'
      tmpData += '<FSQL><![CDATA[select * from Z_Seorder_List]]></FSQL>'
      tmpData += '</JA_LIST>'
      tmpData += '</soap:Body>'
      tmpData += '</soap:Envelope>'

      this.Send.post('JA_LIST', tmpData
      ).then(res => {
        let xmlData = this.$x2js.xml2js(res.data)
        let Result = xmlData.Envelope.Body.JA_LISTResponse.JA_LISTResult
        let Info = JSON.parse(Result)
        this.chooseOrderList = Info
      }).catch((error) => {
        console.log(error)
      })
    },
    async formatData () {
      let resolveIno = await this.getData()
      console.log(resolveIno)
      resolveIno.map(item => {
        item.formatHours = []
        if (!item.topLine) {
          this.hours.map(hour => {
            let Index = item.hours.indexOf(hour)
            if (Index === -1) {
              item.formatHours.push({outer: true})
            } else {
              item.formatHours.push({outer: false})
            }
          })
        }
      })
      this.ListData = resolveIno
    },
    getData () {
      return new Promise((resolve, reject) => {
        var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
        tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
        tmpData += '<soap:Body> '
        tmpData += '<JA_LIST xmlns="http://tempuri.org/">'
        tmpData += '<FSQL><![CDATA[exec [Z_Schedule]]]></FSQL>'
        tmpData += '</JA_LIST>'
        tmpData += '</soap:Body>'
        tmpData += '</soap:Envelope>'

        this.Send.post('JA_LIST', tmpData
        ).then(res => {
          let xmlData = this.$x2js.xml2js(res.data)
          let Result = xmlData.Envelope.Body.JA_LISTResponse.JA_LISTResult
          let Info = JSON.parse(Result)
          console.log(Info)
          Info.map(item => {
            if (item['工单号'] === '') {
              item.topLine = true
              item.value = ''
            }
            // item.topLine = false
            // item.value = ''
            item.hours = []
            let hoursArr = item.value.split(',') // 小时切分
            item.hoursData = hoursArr
            if (item.hoursData.length > 0) {
              // item.hourRange = []
              item.hoursData.map(hour => {
                let startHour = Number((hour.split('-'))[0])
                let endHour = Number((hour.split('-'))[1])
                // item.hourRange.push({start: startHour, end: endHour})
                for (let i = startHour; i < endHour; i++) {
                  item.hours.push(Number(i))
                }
              })
            }
            return item
          })
          resolve(Info)
        }).catch((error) => {
          console.log(error)
        })
      })
    },
    ransformWeek (weekStr) {
      switch (weekStr) {
        case '星期一':
          return 1
        case '星期二':
          return 2
        case '星期三':
          return 3
        case '星期四':
          return 4
        case '星期五':
          return 5
        case '星期六':
          return 6
        case '星期日':
          return 7
      }
    }
  }
}
</script>

<style scoped>
.ScpcDetail{
  padding: 20px 0;
}
/* .borderLeft:first-of-type{
  border-top-left-radius: 7.5px;
  border-bottom-left-radius: 7.5px;
}
.borderLeft:last-of-type{
  border-top-right-radius: 7.5px;
  border-bottom-right-radius: 7.5px;
} */
.outer{
  width: 100%;
  position: absolute;
}
 .plant{
  overflow: hidden;
  display: flex;
}
.outer{
  width: 100%;
  position: absolute;
}
.inner{
  height: 15px;
  overflow: hidden;
  position: absolute;
  top: 12.5px;
}
.Item{
  width: 40px;
  display: flex;
  /* justify-content: center; */
  align-content: center;
  /* border-right: 1px solid #ccc; */
}
.Item:last-of-type{
  border-right: 0px solid #ccc;
}
.innerItem{
  width: 40px;
  height: 15px;
  display: inline-block;
  margin-left: -0.01px;
}
.innerItem span{
  width: 100%;
  height: 100%;
  display: inline-block;
  text-align: center;
}
.bgRedDark{
  background: #d71345;
}
.bgRedLight{
  background: #c76968;
}
.bgBlue{
  background: #4e72b8;
}
.bgGreen{
  background: #7fb80e;
}
.bgTransparent{
  background: transparent !important;
}
/* .transparent{
  filter:alpha(opacity: 50);
  opacity: 0.5;
  -moz-opacity: 0.5;
  -khtml-opacity: 0.5;
} */
</style>
