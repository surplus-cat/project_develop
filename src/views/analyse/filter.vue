<template>
  <div class="fullContent">
    <div class="wrapper">
      <div class="eventPost">
        <div>
          <span class="sign" @click="cut"></span>
          <span class="name">事件配置</span>
        </div>
        <div>
          <el-button size="mini">刷新</el-button>
          <el-button size="mini" :disabled="!isClick" type="primary">保存</el-button>
        </div>

      </div>
      <div v-show="showState">
        <div class="flexBox"
          @mouseover="showToggleIcon = true"
          @mouseout="showToggleIcon = false">
          <div class="commonLine" v-show="showType">
            <el-select v-model="affair" size="small">
              <el-option
                v-for="item in affairs"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span>的</span>
            <putDown />
          </div>
          <div class="customLine" v-show="!showType">
            <div>
              <el-input v-model="name" placeholder="请输入自定义事件名称" size="mini" />
            </div>
            <span>显示</span>
            <div class="expression-input master">
              <div class="mask"></div>
              <div class="expression-unit">
                <ul data-method="focus" @click="focalize($event)" ref="unit">
                  <li
                    v-for="(item, idx) in expressList"
                    :key="idx"
                    @click="handover($event, item, idx)"
                    :ref="count(idx)"
                  >
                    <span
                      :class="{
                        tag: item.name !== '.' && !operators.includes(item.name),
                        placeholder:
                          item.name === '.' || operators.includes(item.name)
                      }"
                      >{{ item.name }}</span
                    >
                    <input
                      type="text"
                      :value="item.name"
                      v-if="item.name === '.' || operators.includes(item.name)"
                      @focus="focus($event)"
                    />
                  </li>
                  <li data-input="true" data-type="none">
                    <span class="placeholder" v-text="inputValue"></span>
                    <input
                      type="text"
                      @input="feed($event)"
                      @keyup.delete="rollback($event)"
                      v-model="inputValue"
                      ref="node"
                    />
                  </li>
                </ul>
              </div>
              <div class="expression-menu" v-show="mainVisible" :style="styles">
                <div class="overflow-wrapper">
                  <ul class="expression-menu-list">
                    <li
                      v-for="item in attrs"
                      :key="item.id"
                      @click="pickMain(item.name)"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="expression-menu" v-show="minorVisible" :style="styles">
                <div class="overflow-wrapper">
                  <ul class="expression-menu-list">
                    <li
                      v-for="item in affairs"
                      :key="item.id"
                      @click="pick(item.name)"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <span class="toggleIcon" v-show="showToggleIcon" @click="showType = !showType"></span>
        </div>

        <div class="flexContent">
          <div
            v-for="(ele, idx) in obk.arr"
            class="item"
            :key="idx"
            @mouseover="ele.isShowDel = true"
            @mouseout="ele.isShowDel = false"
          >
            按
            <dropCombo :zIndex="1500" :ele="ele" :idx="idx" :source="obk.arr" @unfold="unfold" @elect="elect" :options1="options1" />
            查看

            <span class="add" @click="append" v-if="idx === obk.arr.length - 1"
              >+添加属性</span
            >
            <i
              class="el-icon-delete icon"
              @click="omit(idx)"
              v-show="ele.isShowDel"
            ></i>
          </div>
        </div>

        <div class="filter-group-control">
          <span class="add" @click="add" v-if="obj.arr.length === 0"
            >+添加筛选</span
          >
          <div
            id="filter-group-relation"
            v-show="obj.arr.length > 1"
            class="filter-group-relation"
          >
            <div class="relation-topline"></div>
            <button
              data-method="relation"
              data-relation="and"
              class="buttons"
              @click="toggle"
              type="button"
            >
              {{ aliasname[obj.type] }}
            </button>
            <div class="relation-bottomline"></div>
          </div>
          <div
            v-for="(ele, idx) in obj.arr"
            class="item"
            :key="idx"
            @mouseover="ele.isShowDel = true"
            @mouseout="ele.isShowDel = false">
            <dropCombo :ele="ele" :idx="idx" :source="obj.arr" @unfold="unfold" @elect="elect" :options1="options1" />
            <el-select  v-model="ele.value2" class="alSelect">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <!-- 有三种情况，中间条件为 包含和不包含时 第三个为下拉单选，还有一种是输入框  -->
            <div
              class="boxer"
              @click.stop="open(idx)"
              :style="{ 'z-index': 1000 - idx }"
            >
              <span
                v-for="(elem, index) in ele.elems"
                class="label-info"
                :key="index"
              >
                {{ elem.name }}
                <span data-role="remove" @click="remove(index, idx)"></span>
              </span>
              <div class="tipbox">
                <input
                  @input="check($event, idx)"
                  :id="forId('input', idx)"
                  @keyup.enter="submit($event, idx)"
                  @keyup.delete="backspace($event, idx)"
                  @blur="submit($event, idx)"
                />

                <ul v-show="ele.state3 && tips.length > 0 && tips_cp.length > 0">
                  <li
                    v-for="(tip, index) in tips_cp"
                    :key="index"
                    @click.stop="join(tip, idx)">
                    {{ tip.name }}
                  </li>
                </ul>
              </div>
            </div>
            <!-- 第{{ idx + 1 }}排 -->
            <!--<el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="unlock(idx)"
          ></el-button>-->
            <span class="add" @click="add" v-if="idx === obj.arr.length - 1"
              >+添加筛选</span
            >
            <i
              class="el-icon-delete icon"
              @click="del(idx)"
              v-show="ele.isShowDel"
            ></i>
          </div>
        </div>
      </div>
      <!--<div class="custom-border border-color">边框宽度1px</div>
    <div class="scale-border">
      <div class="content">边框宽度0.5px</div>
      <div class="border border-color"></div>
    </div>-->
    </div>
    <chart />

    <pop
      v-if="dialogVisible"
      @close="close"
      @save="save"
      :dialogVisible="dialogVisible"
      :meanObj="meanObj"
      :idx="idx"
    ></pop>
  </div>
</template>

<script>
import chart from "./chart";
import pop from "../../components/pop";
import dropCombo from "./dropCombo";
import dropDown from "./dropDown";
import putDown from "./putDown";
/*
*
  待解决问题:
    1、删除的时候删了符号后也会把属性值给删了  已完成
    2、事件和属性的切换功能未实现，难点在于弹框的定位 定位已完成
    3、事件还有筛选功能  目前需求砍掉
    4、() 和常数 目前不支持
*/

// 打印表达式  this.expressList.map(v => v.name).join("")

export default {
  data() {
    return {
      affair: '',
      affairs: [
        { name: "总次数", value: 0 },
        { name: "用户数", value: 1 },
        { name: "人均次数", value: 2 },
        { name: "屏幕宽度", value: 3 },
        { name: "屏幕高度", value: 4 },
        { name: "App 状态", value: 5 },
        { name: "Distinct ID", value: 6 },
        { name: "IP", value: 7 },
        { name: "SDK 类型", value: 8 },
        { name: "前向地址", value: 9 },
        { name: "国家", value: 10 },
        { name: "应用版本", value: 11 },
        { name: "操作系统", value: 12 },
        { name: "操作系统版本", value: 13 },
        { name: "是否 WIFI", value: 14 },
        { name: "是否首日访问", value: 15 },
        { name: "用户 ID", value: 16 },
        { name: "省份", value: 17 },
        { name: "城市", value: 18 },
        { name: "网络类型", value: 19 },
        { name: "设备 ID", value: 20 },
        { name: "设备制造商", value: 21 },
        { name: "设备型号", value: 22 },
        { name: "运营商", value: 23 },
        { name: "页面名称", value: 24 },
        { name: "页面地址", value: 25 },
        { name: "页面标题", value: 26 },
        { name: "appName", value: 27 },
        { name: "平台类型", value: 28 }
      ],
      attrs: [
        { name: "任意事件", value: 0 },
        { name: "App 元素点击", value: 1 },
        { name: "App 启动", value: 2 },
        { name: "App 浏览页面", value: 3 },
        { name: "App 被动启动", value: 4 },
        { name: "App 状态", value: 5 },
        { name: "App 退出", value: 6 },
        { name: "AppCrashed", value: 7 },
        { name: "AppInstall", value: 8 },
        { name: "前向地址", value: 9 },
        { name: "国家", value: 10 },
        { name: "应用版本", value: 11 },
        { name: "操作系统", value: 12 },
        { name: "操作系统版本", value: 13 },
        { name: "是否 WIFI", value: 14 },
        { name: "是否首日访问", value: 15 },
        { name: "用户 ID", value: 16 },
        { name: "省份", value: 17 },
        { name: "城市", value: 18 },
        { name: "网络类型", value: 19 },
        { name: "设备 ID", value: 20 },
        { name: "设备制造商", value: 21 },
        { name: "设备型号", value: 22 },
        { name: "运营商", value: 23 },
        { name: "页面名称", value: 24 },
        { name: "页面地址", value: 25 },
        { name: "页面标题", value: 26 },
        { name: "appName", value: 27 },
        { name: "平台类型", value: 28 }
      ],
      tips: [
        { name: "浙江", value: "zhejiang" },
        { name: "云南", value: "yunnan" },
        { name: "福建", value: "fujian" },
        { name: "山东", value: "shandong" },
        { name: "山西", value: "shanxi" },
        { name: "江苏", value: "jiangsu" }
      ],
      tips_cp: [],
      options1_cp: [],
      showType: true,
      showToggleIcon: false,
      options1: [
        {
          label: "元素内容",
          value: "content"
        },
        {
          label: "元素位置",
          value: "location"
        },
        {
          label: "元素类型",
          value: "type"
        },
        {
          label: "国家",
          value: "country"
        },
        {
          label: "屏幕宽度",
          value: "width"
        }
      ],
      options2: [
        {
          label: "等于",
          value: "equal"
        },
        {
          label: "不等于",
          value: "unequal"
        },
        {
          label: "包含",
          value: "container"
        },
        {
          label: "不包含",
          value: "uncontainer"
        },
        {
          label: "有值",
          value: "hvalue"
        },
        {
          label: "没值",
          value: "nvalue"
        },
        {
          label: "为空",
          value: "empty"
        },
        {
          label: "不为空",
          value: "nempty"
        },
        {
          label: "正则匹配",
          value: "reg"
        },
        {
          label: "正则不匹配",
          value: "nreg"
        }
      ],
      options3: [],
      obk: {
        arr: [
          {
            name: 1,
            value1: {
              value: "content",
              label: "元素内容"
            },
            state1: false,
            value2: "equal",
            state3: false,
            elems: [],
            backState: false
          }
        ]
      },
      obj: {
        type: "&",
        arr: []
      },
      aliasname: {
        "&": "且",
        "|": "或"
      },
      dialogVisible: false,
      meanObj: [],
      idx: 0,
      name: "",
      mainVisible: false,
      minorVisible: false,
      inputValue: "",
      expressList: [],
      operators: ["+", "-", "*", "/"],
      styles: {
        left: "",
        top: ""
      },
      checked: {},
      index: 0,
      showState: true,
    };
  },
  computed: {
    isClick() {
      return false;
    }
  },
  components: {
    chart,
    pop,
    dropCombo,
    dropDown,
    putDown
  },
  mounted() {
    document.addEventListener("click", this.shutup);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.shutup);
  },
  methods: {
    cut() {
      this.showState = !this.showState;
    },
    count(index) {
      return `node_${index}`;
    },
    focus(event) {
      event.target.focus();
      event.stopPropagation();
      this.mainVisible = false;
      this.minorVisible = false;
    },
    unlock(idx) {
      this.idx = idx;
      this.meanObj = this.obj.arr[idx].elems;
      this.dialogVisible = true;
    },
    feed(event) {
      // if (this.inputValue === '') {
      //   this.mainVisible = false;
      //   this.minorVisible = false;
      // }
      // console.log(event);
      if (this.inputValue === ".") {
        this.expressList.push({ name: `${this.inputValue}` });
        this.inputValue = "";
        this.minorVisible = true;
      }
      if (
        this.operators.includes(this.inputValue) &&
        this.expressList.slice(-1)[0].name !== "."
      ) {
        this.expressList.push({ name: `${this.inputValue}` });
        this.inputValue = "";
        this.mainVisible = true;
      }

      if (this.inputValue === "") {
        if (this.expressList.slice(-1)[0].name === ".") {
          this.minorVisible = true;
        }

        if (this.operators.includes(this.expressList.slice(-1)[0].name)) {
          this.mainVisible = true;
        }
      }
    },
    getStyle(element, attr) {
      if (element.currentStyle) {
        return element.currentStyle[attr];
      } else {
        return getComputedStyle(element, false)[attr];
      }
    },
    // 计算弹框位置
    calcPos(point) {
      let pos1 = this.$refs.unit.getBoundingClientRect();
      let pos2 = this.$refs.node.getBoundingClientRect();
      // console.log(this.$refs.unit.getBoundingClientRect())
      // console.log(this.$refs.node.getBoundingClientRect())
      // console.log(Number(pos2.x) - Number(pos1.x));
      if (point) {
        pos2 = point.getBoundingClientRect();
      }
      this.styles.left = Number(pos2.x) - Number(pos1.x) + "px";
      this.styles.top = Number(pos2.y) - Number(pos1.y) + 32 + "px";
    },
    focalize(event) {
      this.calcPos();
      this.checked = {};
      event.stopPropagation();
      // console.log(this.$refs.unit.querySelectorAll('li')[this.$refs.unit.querySelectorAll('li').length - 1].querySelectorAll('input')[0]);
      this.$refs.unit
        .querySelectorAll("li")
        [this.$refs.unit.querySelectorAll("li").length - 1].querySelectorAll(
          "input"
        )[0]
        .focus();
      if (this.expressList.length === 0) {
        this.mainVisible = true;
      } else {
        if (this.expressList.slice(-1)[0].name === ".") {
          this.minorVisible = true;
        }
        if (
          this.expressList.slice(-1)[0].name !== "." &&
          this.operators.includes(this.inputValue)
        ) {
          this.mainVisible = true;
        }
        if (this.operators.includes(this.expressList.slice(-1)[0].name)) {
          this.mainVisible = true;
        }
      }
    },
    pickMain(name) {
      if (Object.keys(this.checked).length > 0) {
        if (this.expressList.some(v => v.name === this.checked.name)) {
          this.expressList[this.index].name = name;
          this.checked = {};
          this.index = 0;
        }
        return false;
      }
      // if (this.expressList.length > 0) {
      //   this.expressList.push({ name: `${this.inputValue}` });
      //   this.inputValue = '';
      // }
      this.expressList.push({ name: `"${name}"`, isProperty: false });
      this.expressList.push({ name: `.` });
      this.mainVisible = false;
      this.minorVisible = true;
    },
    pick(name) {
      if (Object.keys(this.checked).length > 0) {
        if (this.expressList.some(v => v.name === this.checked.name)) {
          this.expressList[this.index].name = name;
          this.checked = {};
          this.index = 0;
        }
        return false;
      }
      if (
        this.expressList.slice(-1)[0].name !== "." &&
        this.inputValue === "."
      ) {
        this.expressList.push({ name: `.` });
        this.inputValue = "";
      }
      this.expressList.push({ name: `"${name}"`, isProperty: true });
      this.minorVisible = false;
    },
    handover(event, item, index) {
      if (Object.keys(item).includes("isProperty")) {
        this.calcPos(this.$refs[`node_${index}`][0]);
        this.checked = item;
        this.index = index;
        if (item.isProperty) {
          this.minorVisible = true;
          this.mainVisible = false;
        } else {
          this.mainVisible = true;
          this.minorVisible = false;
        }
      }

      event.stopPropagation();
    },
    rollback(event) {
      this.mainVisible = false;
      this.minorVisible = false;
      // console.log(this.inputValue);
      if (this.inputValue === "") {
        this.expressList.pop();
        if (this.expressList.length === 0) {
          this.mainVisible = true;
        }

        if (this.expressList.slice(-1)[0].name === ".") {
          this.minorVisible = true;
        }
      }
      if (this.expressList.length > 0) {
        if (this.expressList.slice(-1)[0].name === ".") {
          this.minorVisible = true;
        }
        if (this.operators.includes(this.expressList.slice(-1)[0].name)) {
          this.mainVisible = true;
        }
      }
      this.calcPos();
    },
    close() {
      this.dialogVisible = false;
    },
    save(arr, idx) {
      this.dialogVisible = false;
      this.obj.arr[idx].elems = arr.slice(0);
    },
    forId(name, index) {
      return `${name}_${index}`;
    },
    add() {
      let idx = this.obj.arr.length;
      let newobj = {
        name: 1,
        value1: {
          value: "content",
          label: "元素内容"
        },
        state1: false,
        value2: "equal",
        state3: false,
        elems: [],
        backState: false,
        isShowDel: false
      };
      newobj.name = idx + 1;
      newobj.state1 = false;
      newobj.state3 = false;
      newobj.elems = [];
      newobj.backState = false;
      this.obj.arr.push(newobj);
    },
    del(idx) {
      this.obj.arr.splice(idx, 1);
    },
    append() {
      let idx = this.obj.arr.length;
      let newobj = {
        name: 1,
        value1: {
          value: "content",
          label: "元素内容"
        },
        state1: false,
        value2: "equal",
        state3: false,
        elems: [],
        backState: false,
        isShowDel: false
      };
      newobj.name = idx + 1;
      newobj.state1 = false;
      newobj.state3 = false;
      newobj.elems = [];
      newobj.backState = false;
      this.obk.arr.push(newobj);
    },
    omit(idx) {
      this.obk.arr.splice(idx, 1);
    },
    toggle() {
      this.obj.type = this.obj.type === "&" ? "|" : "&";
    },
    filt(e) {
      // e.data 表示当前输入的内容
      if (e.data === null && e.target.value === "") {
        this.options1_cp = this.options1.slice(0);
      } else {
        let arr = this.options1.slice(0);
        this.options1_cp = arr.filter(v => v.label.includes(e.data));
      }
    },
    // 键盘回退事件
    backspace(e, idx) {
      if (!e.target.value && this.obj.arr[idx].backState) {
        this.obj.arr[idx].elems.pop();
      }
      this.calc(idx);
    },
    join(item, idx) {
      // console.log(item, idx);
      let arr = this.tips.slice(0);
      if (!this.obj.arr[idx].elems.some(v => v.name === item.name)) {
        this.obj.arr[idx].elems.push(item);
        document.getElementById(`input_${idx}`).value = "";
      }
      this.calc(idx);
    },
    check(e, idx) {
      let arr = this.tips.slice(0);
      let arrcp = arr.reduce((t, v) => {
        if (!this.obj.arr[idx].elems.find(k => k.name === v.name)) {
          t.push(v);
        }
        return t;
      }, []);
      if (e.data) {
        this.tips_cp = arrcp.filter(v =>
          v.name.includes(e.data.toLocaleUpperCase())
        );
        if (document.getElementById(`input_${idx}`).value === "") {
          this.obj.arr[idx].backState = true;
        } else {
          this.obj.arr[idx].backState = false;
        }
      }
    },
    submit(event, idx) {
      // console.log(event.target.value, idx);
      let value = event.target.value;
      if (
        !this.obj.arr[idx].elems.some(v => v.name === value) &&
        event.target.value
      ) {
        this.obj.arr[idx].elems.push({
          name: `${value}`,
          value: `${value}`
        });
        document.getElementById(`input_${idx}`).value = "";
        this.calc(idx);
      }
    },
    remove(index, idx) {
      this.obj.arr[idx].elems.splice(index, 1);
      this.obj.arr[idx].state3 = true;
      document.getElementById(`input_${idx}`).focus();
      this.calc(idx);
    },
    calc(idx) {
      let arr = this.tips.slice(0);
      this.tips_cp = arr.reduce((t, v) => {
        if (!this.obj.arr[idx].elems.find(k => k.name === v.name)) {
          t.push(v);
        }
        return t;
      }, []);
      document.getElementById(`input_${idx}`).focus();
      // 输入框为空时加状态
      if (document.getElementById(`input_${idx}`).value === "") {
        this.obj.arr[idx].backState = true;
      } else {
        this.obj.arr[idx].backState = false;
      }
    },
    open(idx) {
      this.calc(idx);
      this.obj.arr.forEach(v => {
        v.state3 = false;
      });
      this.obj.arr[idx].state3 = true;
    },
    unfold(source, idx) {
      source.forEach(v => {
        v.state1 = false;
      });
      source[idx].state1 = true;
    },
    elect(source, item, idx) {
      source[idx].value1.label = item.label;
      source[idx].value1.value = item.value;
      source[idx].state1 = false;
    },
    shutup() {
      this.obj.arr.forEach(v => {
        v.state1 = false;
        v.state3 = false;
      });
      this.obk.arr.forEach(v => {
        v.state1 = false;
        v.state3 = false;
      });
      this.mainVisible = false;
      this.minorVisible = false;
      this.checked = {};
    }
  }
};
</script>
<style lang="less" scoped>
@import "./filter";
</style>
