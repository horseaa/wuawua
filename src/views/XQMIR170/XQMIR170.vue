<template>
  <xr-ef-form @ready="efFormReady"
              :f2-do="F2_DO"
              :f3-do="F3_DO"
              :f3-pre-do="F3_PRE_DO"
              :f3-cancel="F3_CANCEL"
              :f4-do="F4_DO"
              :f4-pre-do="F4_PRE_DO"
              :f4-cancel="F4_CANCEL"
              :f5-do="F5_DO"
              :f5-pre-do="F5_PRE_DO"
              :f5-cancel="F5_CANCEL"
              :f6-do="F6_DO"
              :f6-pre-do="F6_PRE_DO"
              :f6-cancel="F6_CANCEL">
    <template v-if="initializeFlag === 1">
    <er-layout style="height: 10%;"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'LayoutGroupFilter'"></er-layout>
    <xr-ef-panel title="详细信息"
                 padding="5px">
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
import { Grid } from "ant-design-vue";

export default {
  name: 'XQMIR170',
  components: { erLayout,erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
import {nextTick, onMounted, reactive, ref} from "vue";
const initializeService = 'qmir_form_get';

// 变量定义
const formName = 'XQMIR170';
const erFormHelper =new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");

//页面变量
const data: any = reactive({
  grid1:Grid,
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
  const initialResult = await erFormHelper.Initialize(formPartition.value, formName, '', initializeService);

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
    erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
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
  block.pushData(layoutValue, true);
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir17_inq', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['TQMIR17'], 'gridView1');
  erFormHelper.setGridEditable('gridView1', false);
}

//F3分析项目新增维护
const F3_PRE_DO = async (e: any) => {
  //区域禁用
  data.divDisable = true;
  //设置可编辑
  erFormHelper.setGridEditable('gridView1', true);
  //显示新增操作工具
  erFormHelper.setGridToolbarVisible('gridView1',
  {
        addrow: true,
        copyrow: true,
        delete: true,
        cancel: true,
        excel: true,
      });
  erFormHelper.addRowToGrid('gridView1', true, false);
};
//F3分析项目新增取消
const F3_CANCEL = async (e: any) => {
  erFormHelper.setGridToolbarVisible('gridView1',
  {
        addrow: false,
        copyrow: false,
        delete: false,
        cancel: false,
      });
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView1', false);
  //取消变更
  data.grid4.cancelChanges();
  //解除区域禁用
  data.divDisable = false
};

//F3分析项目新增确认
const F3_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView1",(): boolean =>{
    return true;
  });
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }
  //检验必输项
  if (!erFormHelper.checkGridInput('gridView1')) {
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  const block = new EI.EiBlock('Table1');
  inInfo.addBlock(bd, 'Table0');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir17_ins', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.setGridToolbarVisible('gridView1',
    {
        addrow: false,
        copyrow: false,
        delete: false,
        cancel: false,
      });
    // 设置表格列不可编辑
    erFormHelper.setGridEditable('gridView1', false);
    // 查询最新数据
    await queryInfo();
    data.divDisable = false;
  } else {
    return false;
  }
};


//F4标准修改维护
const F4_PRE_DO = async (e: any) => {
  erFormHelper.setGridEditable('gridView1', true);
};
//F4标准修改取消
const F4_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView1', false);
  await queryInfo();
};
//F4标准修改确认
const F4_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView1",(): boolean =>{
    return true;
  });
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }
  //检验必输项
  if (!erFormHelper.checkGridInput('gridView1')) {
    return false;
  }
  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  const block = new EI.EiBlock('Table1');
  inInfo.addBlock(bd, 'Table0');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir17_upd', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    // 设置表格列不可编辑
    erFormHelper.setGridEditable('gridView1', false);
    // 查询最新数据
    await queryInfo();
  } else {
    return false;
  }
};

//F5项目删除维护
const F5_PRE_DO = async (e: any) => {
  data.divDisable = true;
};
//F5项目删除取消
const F5_CANCEL = async (e: any) => {
  data.divDisable = false;
};
//F5项目删除确认
const F5_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  const block = new EI.EiBlock('Table1');
  inInfo.addBlock(bd, 'Table0');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir17_del', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    // 查询最新数据
    await queryInfo();
    data.divDisable = false;
  } else {
    return false;
  }
};


//F5项目整理维护
const F6_PRE_DO = async (e: any) => {
  data.divDisable = true;
};
//F5项目整理取消
const F6_CANCEL = async (e: any) => {
  data.divDisable = false;
};
//F5项目整理确认
const F6_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  const block = new EI.EiBlock('Table1');
  inInfo.addBlock(bd, 'Table0');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir17_collate', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    // 查询最新数据
    await queryInfo();
    data.divDisable = false;
  } else {
    return false;
  }
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