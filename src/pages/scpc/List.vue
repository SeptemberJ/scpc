<template>
  <div class="List">
    <el-row>
      <el-col :span="24" class="TextAlignR">
        <el-button type="primary" @click="getListAll">选择工单</el-button>
        <el-button type="warning" @click="saveDataChange">产能分析</el-button>
        <el-button type="success">插单分析</el-button>
      </el-col>
      <el-col :span="24" class="TextAlignR">
        <el-table
          ref="choosedTable"
          :data="choosedData"
          style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            property="生产类型"
            label="生产类型"
            width="120">
          </el-table-column>
          <el-table-column
            property="产线"
            label="产线"
            width="120">
          </el-table-column>
          <el-table-column
            property="日期"
            label="日期"
            width="120">
          </el-table-column>
          <el-table-column
            property="工单号"
            label="工单号"
            width="120">
          </el-table-column>
          <el-table-column
            property="产品名称"
            label="产品名称">
          </el-table-column>
          <el-table-column
            property="单位"
            label="单位"
            width="80">
          </el-table-column>
          <el-table-column
            property="数量"
            label="数量"
            width="120">
          </el-table-column>
          <el-table-column
            property="交期"
            label="交期"
            width="120">
            <template slot-scope="scope">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="scope.row['交期']"
                type="date">
              </el-date-picker>
            </template>
          </el-table-column>
          <!-- <el-table-column
            fixed="right"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button @click="xd(scope.$index, tableData)" type="text" size="small">下达</el-button>
              <el-button @click="xd(scope.$index, tableData)" type="text" size="small">预警</el-button>
              <el-button @click="xd(scope.$index, tableData)" type="text" size="small">工程变更</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="工单列表" :visible.sync="listDialogVisible" width="90%" center :close-on-click-modal="false">
      <el-table
        ref="singleTable"
        height="400"
        :data="listData"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          type="selection"
          width="60">
        </el-table-column>
        <el-table-column
          property="生产类型"
          label="生产类型"
          width="120">
        </el-table-column>
        <el-table-column
          property="产线"
          label="产线"
          width="120">
        </el-table-column>
        <el-table-column
          property="日期"
          label="日期"
          width="120">
        </el-table-column>
        <el-table-column
          property="工单号"
          label="工单号"
          width="120">
        </el-table-column>
        <el-table-column
          property="产品名称"
          label="产品名称">
        </el-table-column>
        <el-table-column
          property="单位"
          label="单位"
          width="80">
        </el-table-column>
        <el-table-column
          property="数量"
          label="数量"
          width="120">
        </el-table-column>
        <el-table-column
          property="交期"
          label="交期"
          width="120">
        </el-table-column>
        <!-- <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="xd(scope.$index, tableData)" type="text" size="small">下达</el-button>
            <el-button @click="xd(scope.$index, tableData)" type="text" size="small">预警</el-button>
            <el-button @click="xd(scope.$index, tableData)" type="text" size="small">工程变更</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="listDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureChoosed">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      listDialogVisible: false,
      choosedData: [],
      listData: [],
      selectData: []
    }
  },
  methods: {
    handleCurrentChange () {},
    handleSelectionChange (val) {
      this.selectData = val
    },
    editProcess (row) {
    },
    sureChoosed () {
      this.listDialogVisible = false
      this.choosedData = this.selectData
    },
    saveDataChange () {
      let Data = {
        'items': this.choosedData.map(item => {
          item.FBillNO = item['工单号']
          item.FDate = item['交期']
          return item
        })
      }
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<Schedule xmlns="http://tempuri.org/">'
      tmpData += '<FJSON>' + JSON.stringify(Data) + '</FJSON>'
      tmpData += '</Schedule>'
      tmpData += '</soap:Body>'
      tmpData += '</soap:Envelope>'

      this.Send.post('Schedule', tmpData
      ).then(res => {
        let xmlData = this.$x2js.xml2js(res.data)
        let Result = xmlData.Envelope.Body.ScheduleResponse.ScheduleResult
        let Info = JSON.parse(Result)
        if (Info.code === '1') {
          this.$message({
            message: '修改成功!',
            type: 'success'
          })
        } else {
          this.$message({
            message: '保存失败!',
            type: 'error'
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    getListAll () {
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<JA_LIST xmlns="http://tempuri.org/">'
      tmpData += "<FSQL><![CDATA[select d.fname 生产类型,'test' 产线,convert(varchar(50),a.FDate,23) 日期,c.FBillNo 工单号,e.fname 产品名称,f.fname 单位,c.FAuxQty 数量,convert(varchar(50),b.FDate,23) 交期 from SEOrder a inner join SEOrderEntry b on a.finterid=b.finterid inner join icmo c on b.finterid=c.FOrderInterID and b.FEntryID=c.FSourceEntryID left join t_SubMessage d on d.finterid=a.FHeadSelfS0155 left join t_icitem e on e.fitemid=b.FItemID left join t_MeasureUnit f on f.fitemid=e.FUnitID where c.FStatus=5 and a.FCancellation=0 and isnull(a.FCheckerID,0)>0 order by b.FDate]]></FSQL>"
      tmpData += '</JA_LIST>'
      tmpData += '</soap:Body>'
      tmpData += '</soap:Envelope>'

      this.Send.post('JA_LIST', tmpData
      ).then(res => {
        let xmlData = this.$x2js.xml2js(res.data)
        let Result = xmlData.Envelope.Body.JA_LISTResponse.JA_LISTResult
        let Info = JSON.parse(Result)
        this.listData = Info
        this.listDialogVisible = true
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
.List{
  padding: 15px;
}
</style>
