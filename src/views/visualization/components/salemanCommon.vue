<template>
  <div class="filtro_box">
    <div class="tabsBar">
      <span class="tabs"
        v-for="(item, index) in tabs"
        @click="toggle('tab', item.value)"
        :class="{ 'active': tab === item.value }"
        :key="index">{{ item.name }}</span>
    </div>
    <div class="condition_gather">
      <div class="dimension">
        <ul>
          <li v-show="tab === 'manager'">
            <span class="name">目标维度</span>
            <span class="option"
              v-for="(item, index) in targets"
              @click="toggle('target', item.value)"
              :class="{'active': target === item.value }"
              :key="index">{{ item.name }}</span>
          </li>
          <li v-show="tab === 'order'">
            <span class="name">客户来源</span>
            <span class="option"
              @click="toggle('source', item.value)"
              v-for="(item, index) in sources"
              :class="{'active': source === item.value }"
              :key="index">{{ item.name }}</span>
          </li>
          <li>
            <span class="name">时间维度</span>
            <span class="option"
              v-for="(item, index) in times"
              @click="toggle('time', item.value)"
              :class="{'active': time === item.value }"
              :key="index">{{ item.name }}</span>
          </li>
          <!-- 业务员管理是时间点，业务员订单是时间段 -->
          <li v-show="tab === 'manager'">
            <span class="name">时间段</span>
            <el-date-picker
              v-show="time === 'day'"
              v-model="timeing"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <el-date-picker
              v-show="time === 'month'"
              v-model="timeing"
              type="month"
              placeholder="选择日期">
            </el-date-picker>
          </li>
          <li v-show="tab === 'order'">
            <span class="name">时间段</span>
            <el-date-picker
              v-show="time === 'day'"
              v-model="timezones"
              type="daterange"
              placeholder="选择日期">
            </el-date-picker>
            <week-picker
              v-show="time === 'week'"
              class="timer"
              v-model="timezones"
              start-placeholder="开始周"
              end-placeholder="结束周"
              type="weekrange"
              placeholder="选择周"
              :picker-options="{'firstDayOfWeek': 1}">
            </week-picker>
            <el-date-picker
              v-show="time === 'month'"
              v-model="timezones"
              type="monthrange"
              placeholder="选择日期">
            </el-date-picker>
          </li>
          <li>
            <p class="reset">重置</p>
          </li>
        </ul>
      </div>

      <div class="Last_update">
        <span class="clock">数据更新于 <span class="nowTime">{{ nowTime }}</span></span>
        <span class="refreshBtn">刷新 <i class="dj-bi- dj-bi-refresh dj-bi-histogram" /></span>
      </div>
    </div>
  </div>
</template>

<script>
import WeekPicker from 'packages/date-picker/index.js';

export default {
  data () {
    return {
      nowTime: +new Date(),
      time: 'day',
      target: 'gmv',
      source: 'groupon',
      timezones: '',
      timeing: '',
      tab: 'manager',
      tabs: [
        {
          name: '业务员管理',
          value: 'manager'
        },
        {
          name: '业务员订单',
          value: 'order'
        }
      ],
      times: [
        {
          name: '日',
          value: 'day'
        },
        {
          name: '月',
          value: 'month'
        },
      ],
      targets: [
        {
          name: 'GMV',
          value: 'gmv'
        },
        {
          name: '接单量',
          value: 'saleAmount'
        }
      ],
      sources: [
        {
          name: '值班团购',
          value: 'groupon'
        },
        {
          name: '积分商城',
          value: 'integral'
        }
      ]
    };
  },
  components: {
    WeekPicker
  },
  computed: {},
  methods: {
    toggle (property, value) {
      this[property] = value;

      if (property === 'tab') {
        this.$emit('handover', this.tab);
        if (this.tab === 'manager') {
          this.times = [
            {
              name: '日',
              value: 'day'
            },
            {
              name: '月',
              value: 'month'
            },
          ]
        } else {
          this.times = [
            {
              name: '日',
              value: 'day'
            },
            {
              name: '周',
              value: 'week'
            },
            {
              name: '月',
              value: 'month'
            },
          ]
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import './default';

.timer {
  width: 400px
}
</style>
