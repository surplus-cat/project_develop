<template>
  <div>
    <oneCommon />
    <div class="ProviderBox">
      <div class="ChartBox">
        <h3 class="title">总接单趋势</h3>
        <div class="vesselBoxer">
          <div class="vessel">
            <echart ref="chart" type="trends" :style="{ visibility: isWhether ? 'visible' : 'hidden' }" />
            <div class="nodata" v-show="!isWhether"></div>
          </div>
        </div>
      </div>
      <div class="tableBox">
        <div class="titleBox">
          <h3 class="title">xxx月xx日供应商接单明细</h3>
          <el-input class="el_input" v-model="productName" placeholder="产品名称" />
        </div>

        <lb-table
          class="btable"
          ref="baseTable"
          :data="tableData"
          :column="colConfigs">
        </lb-table>
      </div>

      <chart-pop
        ref="ChartPop"
        :dialog-visible="dialogVisible"
        :chart-obj="ChartObj"
        @close="close">
      </chart-pop>
    </div>
  </div>
</template>

<script>
import oneCommon from './components/oneCommon';
import echart from '@/components/echart';
import chartPop from './popout/chartPop';
import LbTable from '@/components/lb-table/lb-table';
import { func } from '@/util';
const debounce = func.debounce;

export default {
  data () {
    return {
      productName: '',
      isWhether: true,
      colConfigs: [
        {
          prop: 'productName',
          label: '产品名称',
          width: '160px',
          render: (h, scope) => {
            return (
              scope.row.productName.length > 8
                ? <div class="innerCase">
                  <span class="rank">{ scope.$index + 1 }</span>
                  <el-tooltip content={scope.row.productName} placement="top-start" effect="light">
                    <p class="productName">{ scope.row.productName }</p>
                  </el-tooltip>
                </div> : (
                  <div class="innerCase">
                    <span class="rank">{ scope.$index + 1 }</span>
                    <p class="productName">{ scope.row.productName }</p>
                  </div>
                )
            )
          }
        },
        {
          prop: 'gmv',
          label: 'GMV',
          sortable: true,
          sortMethod: (a, b) => {
            return this.sortMethod(a, b, 'gmv');
          }
        },
        {
          prop: 'gmvChain',
          label: 'GMV占比',
        },
        { prop: 'saleAmount',
          label: '接单量',
          width: '140px',
          sortable: true,
          sortMethod: (a, b) => {
            return this.sortMethod(a, b, 'saleAmount');
          },
          formatter: this.formatter
        },
        { prop: 'saleAmountChain', label: '接单量占比' },
        { label: '接单趋势',
          render: (event, row) => {
            return <i class="dj-bi- dj-bi-histogram" on-click={() => this.open() } />
          }
        },
      ],
      tableData: [
        {
          productName: '东宋二号',
          gmv: "￥111,183.11",
          gmvChain: '71%',
          saleAmount: "1,221,831.00",
          saleAmountChain: '71%'
        },
        {
          productName: '东宋三号(双面玖龙)特供版',
          gmv: "￥110,183.00",
          gmvChain: '71%',
          saleAmount: "132,331.10",
          saleAmountChain: '71%'
        },
        {
          productName: '东丽2号',
          gmv: "￥954,103.11",
          gmvChain: '61%',
          saleAmount: "218,331.00",
          saleAmountChain: '71%'
        },
        {
          productName: '特2号',
          gmv: "￥11,183.11",
          gmvChain: '41%',
          saleAmount: "1,223,831.00",
          saleAmountChain: '81%'
        },
        {
          productName: '东丽2号',
          gmv: "￥954,103.11",
          gmvChain: '31%',
          saleAmount: "218,331.00",
          saleAmountChain: '90%'
        },
        {
          productName: '特2号',
          gmv: "￥11,183.11",
          gmvChain: '21%',
          saleAmount: "1,223,831.00",
          saleAmountChain: '56%'
        }
      ],
      ChartObj: {},
      dialogVisible: false
    };
  },
  components: {
    echart,
    chartPop,
    LbTable,
    oneCommon
  },
  computed: {},
  mounted() {
    this.draw();
  },
  methods: {
    formatter(row, column) {
      return row.saleAmount + 'm²';
    },
    sortMethod(a, b, field) {
      const val1 = a[field].replace(/,/g, '');
      const val2 = b[field].replace(/,/g, '');
      return val1 - val2
    },
    close() {
      this.dialogVisible = false;
    },
    open() {
      this.ChartObj.title = "纸板团购接单趋势";
      let data = [
        {
          date: '3-21',
          saleAmount: 287,
          saleAmountChain: "2.4",
          GMV: 131,
          GMVChain: '-1.5',
        },
        {
          date: '3-22',
          saleAmount: 187,
          saleAmountChain: "2",
          GMV: 136,
          GMVChain: '-12.8',
        },
        {
          date: '3-23',
          saleAmount: 147,
          saleAmountChain: "12",
          GMV: 126,
          GMVChain: '-11',
        },
        {
          date: '3-24',
          saleAmount: 87,
          saleAmountChain: "12",
          GMV: 226,
          GMVChain: '-10',
        },
        {
          date: '3-25',
          saleAmount: 107,
          saleAmountChain: "12",
          GMV: 246,
          GMVChain: '-18',
        },
        {
          date: '3-26',
          saleAmount: 227,
          saleAmountChain: "2.2",
          GMV: 46,
          GMVChain: '12',
        },
        {
          date: '3-27',
          saleAmount: 127,
          saleAmountChain: "3",
          GMV: 16,
          GMVChain: '-12',
        }
      ];
      this.ChartObj.type = "trends";
      this.dialogVisible = true;

      // setTimeout(() => {
      //   this.$refs.ChartPop.$refs.echart.draw();
      // }, 0);
      // this.$refs.ChartPop.$refs.echart.draw();

      this.$nextTick(() => {
        this.$refs.ChartPop.$refs.echart.option.dataset.source = data;
        this.$refs.ChartPop.$refs.echart.reDraw();
      });

      // this.$refs.ChartPop.$refs.echart.option.dataset.source = data;
      // this.$refs.ChartPop.$refs.echart.reDraw();
    },
    draw () {
      let data = [
        {
          date: '3-21',
          saleAmount: 287,
          saleAmountChain: "2.4",
          GMV: 131,
          hiddenVal: 10,
          GMVChain: '-1.5',
        },
        {
          date: '3-22',
          saleAmount: 187,
          saleAmountChain: "2",
          GMV: 136,
          hiddenVal: 10,
          GMVChain: '-12.8',
        },
        {
          date: '3-23',
          saleAmount: 147,
          saleAmountChain: "12",
          GMV: 126,
          hiddenVal: 10,
          GMVChain: '-11',
        },
        {
          date: '3-24',
          saleAmount: 87,
          saleAmountChain: "12",
          GMV: 226,
          hiddenVal: 10,
          GMVChain: '-10',
        },
        {
          date: '3-25',
          saleAmount: 107,
          saleAmountChain: "12",
          GMV: 246,
          hiddenVal: 10,
          GMVChain: '-18',
        },
        {
          date: '3-26',
          saleAmount: 227,
          saleAmountChain: "2.2",
          GMV: 46,
          hiddenVal: 10,
          GMVChain: '12',
        },
        {
          date: '3-27',
          saleAmount: 127,
          saleAmountChain: "3",
          GMV: 16,
          hiddenVal: 10,
          GMVChain: '-12',
        }
      ];
      // setTimeout(() => {
      //   this.$refs.chart.option.dataset.source = data;
      //   this.$refs.chart.draw();
      // }, 0);
      this.$nextTick(() => {
        this.$refs.chart.option.dataset.source = data;
        this.$refs.chart.reDraw();

        this.$refs.chart.myChart.on('mouseover', 'series', (event) => {
          debounce(() => {
            this.print(event);
          }, 1000)
        })
      });
      // this.$refs.chart.option.dataset.source = data;
      // this.$refs.chart.reDraw();
    },
    print(event) {
      console.log(event, +new Date());
    }
  }
};
</script>
<style lang="less" scoped>
@import './common';

.ProviderBox {
  display: flex;

  .ChartBox {
    width: 1024px;
    display: flex;
    flex-direction: column;
    background-color: rgba(8,21,42,1);
    border-radius: 4px;
    position: relative;
    //width: 100%;
    height: 640px;

    .title {
      font-size: 18px;
      line-height: 18px;
      font-weight: 100;
      color: #fff;
      text-align: left;
      padding: 36px 0 24px 24px;
    }
  }

  .vesselBoxer {
    flex: 1;
    position: relative;
    //height: calc(~"100% - 77px");
  }

  .vessel {
    width: 100%;
    //width: 1024px;
    height: 100%;
    position: relative;
    .nodata {
      height: 100%;
      //background-image: url("../assets/images/noData.png");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100px 100px;
    }
  }

  .tableBox {
    flex: 1;
    height:640px;
    background-color: rgba(8,21,42,1);
    border-radius:4px;
    margin-left:16px;

    .titleBox {
      padding: 36px 24px 24px;
      text-align: left;
      display: flex;
      justify-content: space-between;
    }

    .title {
      line-height: 38px;
      font-size: 18px;
      font-weight: 100;
      color: #fff;
    }

    .el_input {
      width: 180px;

      /deep/ .el-input__inner {
        height: 38px;
        line-height: 38px;

      }
    }

    /deep/.el-table {
      width: 100%;

      tr {
        background-color: rgba(8,21,42,1);

        &:nth-child(1) .rank {
          background-color: rgba(250,173,20,1);
        }

        &:nth-child(2) .rank {
          background-color: rgba(255,255,255,0.45);
        }

        &:nth-child(3) .rank {
          background-color: rgba(197,139,67,1)
        }
      }

      th {
        background-color: rgba(255,255,255,0.08);
      }

    }

    /deep/.innerCase {
      display: flex;

      .rank {
        width: 18px;
        height: 18px;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        border-radius: 100%;
        display: block;
        margin-right: 20px;
        color: #fff;
        background-color: rgba(255,255,255,0.12);
      }

      .productName {
        width: 90px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.dj-bi-histogram {
  color: #80F5FF
}
</style>
