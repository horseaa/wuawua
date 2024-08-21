<template>
  <xr-ef-form @ready="efFormReady"
              :f2-do="F2_DO">
    <template v-if="initializeFlag === 1">
    <er-layout 
                :er-form-helper-prop="erFormHelper"
                :config-id="'LayoutGroupFilter'"></er-layout>
    <xr-ef-panel title="数据区"
                 padding="0 5px 5px 5px"
                 :open-header-show="false">
      <template #customButtonSlot>

      </template>
      <template #contentSlot>
        <er-grid 
                @erGridReady="erGrid1Ready"
                :er-form-helper-prop="erFormHelper"
                :config-id="'gridView1'"
                :options="{enableClick:true}"
                >
        </er-grid>
      </template>
    </xr-ef-panel>
  </template>
  </xr-ef-form>
</template>

<script lang="ts">
import { EI } from 'EIX/ei';
import {ER} from 'ERX/Er';
import erLayout from 'ERX/ErLayout';
import erGrid from "ERX/ErGrid";
import xrEfPanel from "EFX/xrEfPanel";
import xrEfForm from "EFX/xrEfForm";
import { nextTick, onMounted, reactive, ref } from 'vue';
import { Grid } from 'ant-design-vue';

export default {
  name: 'XQMIR280',
  components: { erLayout,erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
const initializeService = 'qmir_form_get';

// 变量定义
const formName = 'XQMIR280';
const erFormHelper =new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");

//页面变量
const data: any = reactive({
  grid1: Grid,
  gridToolbar1: [],
  //div禁用样式
  disableStyle: {
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0.3,
    height: 100 + '%'
  },
  divDisable: false,
  clickData: {}
});
const erGrid1Ready = () => {
  data.grid1 = erFormHelper.getGrid('gridView1');
}

const efFormReady = (e: any) => {
  efFormInfo.value = e.formInfo;
  efFormIsReady.value = true;
  formPartition.value = efFormInfo.value.formPartition;
  // 初始化低代码工具类
  initializePage();
};

// 画面相关数据初始化--异步调用
const initializePage = async () => {
  // 调用后台服务service获取配置数据并实例化工具类--Initialize
  const initialResult = await erFormHelper.Initialize(
    formPartition.value,
    formName,
    '',
    initializeService
  );

  //判断初始化返回结果，若>=0表示正确获取初始化信息，否则报错
  if (initialResult.flag >= 0) {
    // 画面工具类初始化成功后将画面渲染条件设置为1
    initializeFlag.value = 1;

    // 回调函数获取控件信息及设置定义事件等操作
    nextTick(() => {
      // 获取画面上的主要控件信息

      // 设置表格列不可编辑
      // erFormHelper.setGridEditable('gridView1', false);
    });
  } else {
    // 在页面上侧中间显示错误信息栏
    erFormHelper.messageError(
      'ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!'
    );
  }
};

//F2查询
const F2_DO = async (e: any) => {
  await queryInfo();
};
//通过接口查询
const queryInfo = async () => {
  const layoutValue: any = erFormHelper.getAllControlValue('LayoutGroupFilter');
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  layoutValue.INDEX_FROM = 0;
  layoutValue.RETURN_NUM = 1000;
  block.pushData(layoutValue, true);
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir28_inq', inInfo, false, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.mergeDataToGrid(outInfo.blocks['Table0'], 'gridView1');
  }
  //查询之后设置grid不可编辑
  erFormHelper.setGridEditable('gridView1', false);
};

onMounted(() => {
  // initializePage();
});
</script>

 <style lang="scss">
 .efpanel-root {
  height: 100%;
  }
  </style>
