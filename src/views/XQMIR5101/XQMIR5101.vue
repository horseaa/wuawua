<template>
  <xr-ef-form @ready="efFormReady"
              :f2-do="F2_DO"
              :f3-do="F3_DO"
              :f3-pre-do="F3_PRE_DO"
              :f3-cancel="F3_CANCEL">
    <template v-if="initializeFlag === 1">
      <er-layout 
                    :er-form-helper-prop="erFormHelper"
                    :config-id="'LayoutGroupFilter'"></er-layout>
      <xr-ef-panel title="详细信息"
                  padding="0 5px 0 5px">
        <template #customButtonSlot>

        </template>
        <template #contentSlot>
          <er-grid 
                  @erGridReady="erGrid1Ready"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'gridView1'">
          </er-grid>
        </template>
      </xr-ef-panel>
    </template>
  </xr-ef-form>
</template>

<script lang="ts">
import { EI } from 'EIX/ei';
import { ER } from 'ERX/Er';
import erLayout from 'ERX/ErLayout';
import erGrid from "ERX/ErGrid";
import xrEfPanel from "EFX/xrEfPanel";
import xrEfForm from "EFX/xrEfForm";
import { nextTick, onMounted, reactive, ref } from 'vue';
import { Grid } from 'ant-design-vue';

export default {
  name: 'XQMIR5101',
  components: { erLayout,erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
const initializeService = 'qmir_form_get';

// 变量定义
const formName = 'XQMIR5101';
const erFormHelper =new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");

//页面变量
const data:any = reactive({
  grid1:Grid,
  gridToolbar1:[],
  //div禁用样式
  disableStyle:{
    pointerEvents:'none',
    userSelect:'none',
    opacity:0.3,
    height:100+'%'
  },
  divDisable:false,
  clickData:{}
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

// 画面相关数据初始化
const initializePage = async () => {
  const initialResult = await erFormHelper.Initialize(formPartition.value, formName, '', initializeService);
  if (initialResult.flag >= 0) {
    // 画面工具类初始化成功后将画面渲染条件设置为1
    initializeFlag.value = 1;

    // 回调函数获取控件信息及设置定义事件等操作
    await nextTick(() => {
      // 获取画面上的主要控件信息
 
      // 设置每页记录数为1000
      // data.grid1.options.dataSource?.pageSize(1000);
      // 设置表格列不可编辑
      // erFormHelper.setGridEditable('gridView1', false);
    });
  } else {
    erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
  }
};
//查询表格数据
const queryInfo= async () => {
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');

  const layoutValue = erFormHelper.getAllControlValue('LayoutGroupFilter')
  layoutValue.INDEX_FROM = 0
  layoutValue.RETURN_NUM = 1000
  block.pushData(layoutValue,true);

  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir51_inq', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['Table0'],'gridView1')
  erFormHelper.setGridEditable('gridView1', false);
};

//F2查询
const F2_DO = async (e: any) => {
  await queryInfo();
};
const F3_DO = async (e: any) => {};
const F3_PRE_DO = async (e: any) => {};
const F3_CANCEL = async (e: any) => {};

onMounted(() => {
  // initializePage();
});
</script>

 <style lang="scss">
 .efpanel-root {
  height: 100%;
  }
  </style>