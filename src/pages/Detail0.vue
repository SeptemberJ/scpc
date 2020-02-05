<template>
  <div class="ScpcDetail">
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
        label="生产类型"
        width="120">
        <template slot-scope="scope">
          <span>{{scope.row.topLine ? scope.row['生产类型'] : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="产线"
        width="120">
        <template slot-scope="scope">
          <span>{{scope.row.topLine ? scope.row['产线'] : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="日期"
        width="120">
        <template slot-scope="scope">
          <span>{{scope.row.topLine ? scope.row['日期'] : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        property="ftype"
        label="工单号"
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
        label="单位"
        width="80">
        <template slot-scope="scope">
          <span>{{scope.row.topLine ? scope.row['单位'] : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(Week, idxW) in week" :key="idxW"
        :label="Week == '1' ? '星期一' : (Week == '2' ? '星期二' : (Week == '3' ? '星期三' : (Week == '4' ? '星期四' : (Week == '5' ? '星期五' : (Week == '6' ? '星期六' : ('星期日'))))))"
        :width="hours.length * 40">
        <template slot-scope="scope">
          <div v-if="scope.row.topLine" style="display:flex;">
            <div v-for="(item, idx) in hours" :key="idx" class="Item">{{item}}</div>
          </div>
          <div v-else style="display:flex;">
            <div class="dayData">
              <div class="outer"></div>
              <div class="plant">
                  <div v-for="(item, idx) in scope.row.formatHours[idxW]" :key="idx" v-if="item.outer" style="color: #000;text-align: center;" class="innerItem bgTransparent"></div>
                  <span v-for="(item, idx) in scope.row.formatHours[idxW]" :key="idx" v-if="!item.outer" style="color: #000;text-align: center;" class="innerItem bgBlue borderLeft"></span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="dayData" v-for="(step, stepIdx) in showdatalist" :key="stepIdx">
      <div class="outer"></div>
      <div class="plant">
          <div v-for="(item, idx) in step.showdata" :key="idx" v-if="item.outer" style="color: #000;text-align: center;" class="innerItem bgTransparent"></div>
          <span v-for="(item, idx) in step.showdata" :key="idx" v-if="!item.outer && item.type != 100" style="color: #000;text-align: center;" class="innerItem bgBlue borderLeft"></span>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'ScpcDetail',
  data () {
    return {
      hours: [],
      week: [],
      originData: [
        {
          '生产类型': '紧急',
          '产线': '洗衣粉生产线',
          '日期': '2019-12-13',
          '工单号': 'work001',
          '产品名称': '洗衣粉',
          '单位': '袋',
          hoursData: []
        },
        {
          '生产类型': '',
          '产线': '',
          '日期': '',
          '工单号': '配料',
          '产品名称': '',
          '单位': '',
          hoursData: [
            {FSDate: '2019-12-17 08:00:00', FEDate: '2019-12-17 17:00:00'},
            {FSDate: '2019-12-17 08:00:00', FEDate: '2019-12-17 12:00:00'},
            {FSDate: '2019-12-17 13:00:00', FEDate: '2019-12-17 17:00:00'}
          ]
        },
        {
          '生产类型': '',
          '产线': '',
          '日期': '',
          '工单号': '灌装',
          '产品名称': '',
          '单位': '',
          hoursData: [
            {FSDate: '2019-12-17 11:00:00', FEDate: '2019-12-17 12:00:00'},
            {FSDate: '2019-12-17 13:00:00', FEDate: '2019-12-17 14:00:00'},
            {FSDate: '2019-12-17 15:00:00', FEDate: '2019-12-17 17:00:00'}
          ]
        }
      ],
      ListData: []
    }
  },
  created () {
    this.formatData()
  },
  methods: {
    cellStyle ({row, column, rowIndex, columnIndex}) {
      if (columnIndex <= 6) {
        return 'cellHasPad'
      }
    },
    async formatData () {
      let resolveIno = await this.getData()
      let classeedData = resolveIno.classeedData
      let minHour = Math.min(...resolveIno.allHour)
      let maxHour = Math.max(...resolveIno.allHour)
      // console.log('分组后数据', resolveIno)
      // console.log(minHour)
      // console.log(maxHour)
      for (let i = minHour; i <= maxHour; i++) {
        this.hours.push(Number(i))
      }
      this.week = [...new Set(resolveIno.allWeek)]
      classeedData.map((classItem, classIdx) => {
        // 插入订单信息行
        classItem.unshift({
          formatHours: [],
          hoursData: [],
          topLine: true,
          '产品名称': classItem[0]['产品名称'],
          '产线': classItem[0]['产线'],
          '单位': classItem[0]['单位'],
          '工单号': classItem[0]['工单号'],
          ftype: classItem[0]['工单号'],
          '日期': classItem[0]['日期'],
          '生产类型': classItem[0]['生产类型']
        })
        // 工序数据重组
        classItem.map((item, idx) => {
          item.formatHours = []
          if (item.weekInfo) {
            item.weekInfo.map((itemW, idxW) => {
              item.formatHours[idxW] = []
              let startHour = (itemW.hours.split('-'))[0]
              let endHour = (itemW.hours.split('-'))[1]
              this.hours.map((Hour) => {
                if (Hour < startHour) {
                  item.formatHours[idxW].push({outer: true})
                } else if (Hour >= startHour && Hour <= endHour) {
                  item.formatHours[idxW].push({hour: Hour})
                }
              })
            })
          }
          this.ListData.push(item)
        })
      })
      console.log('classeedData', classeedData)
    },
    getData () {
      return new Promise((resolve, reject) => {
        var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
        tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
        tmpData += '<soap:Body> '
        tmpData += '<JA_LIST xmlns="http://tempuri.org/">'
        tmpData += '<FSQL><![CDATA[ exec [z_schedule_result]]]></FSQL>'
        tmpData += '</JA_LIST>'
        tmpData += '</soap:Body>'
        tmpData += '</soap:Envelope>'

        this.Send.post('JA_LIST', tmpData
        ).then(res => {
          let xmlData = this.$x2js.xml2js(res.data)
          let Result = xmlData.Envelope.Body.JA_LISTResponse.JA_LISTResult
          let Info = JSON.parse(Result)
          let weekRangeDefault = [] // 总体跨越的星期
          let weekIndexArr = []
          let dayS = this.ransformWeek(Info[0]['开始'])
          let dayE = this.ransformWeek(Info[0]['结束'])
          for (let j = dayS; j <= dayE; j++) {
            weekIndexArr.push(j)
            weekRangeDefault.push({
              week: j,
              hours: ''
            })
          }
          console.log('Info', Info)
          // debugger
          // let AllWeek = []
          let AllHour = []
          let len = Info.length
          let count = len / 4 // 订单为单位的切割数
          let classeedData = new Array(count)
          for (let i = 0; i < count; i++) {
            classeedData[i] = []
          }
          Info.map((item, idx) => {
            item.weekInfo = weekRangeDefault.slice(0)
            let week = item.value.split(',') // 天切分
            week.map(stringItem => {
              let tempArr = stringItem.split(':') // 星期和小时切分
              let hoursArr = tempArr[1].split('-') // 小时切分
              let weekIndex = this.ransformWeek(tempArr[0]) // 星期转换为对应数字
              // AllWeek.push(weekIndex)
              for (let i = hoursArr[0]; i <= hoursArr[1]; i++) {
                AllHour.push(Number(i))
              }
              item.weekInfo[weekIndexArr.indexOf(weekIndex)] = {
                week: weekIndex,
                hours: stringItem.slice(4)
              }
            })
            // 按订单合并工序
            let Index = parseInt(idx / 4)
            classeedData[Index].unshift(item)
          })
          resolve({classeedData: classeedData, allWeek: weekIndexArr, allHour: AllHour})
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
  justify-content: center;
  align-content: center;
  border-right: 1px solid #ccc;
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
