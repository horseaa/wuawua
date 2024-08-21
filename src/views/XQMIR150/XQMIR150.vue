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
              :f7-do="F7_DO"
              :f7-pre-do="F7_PRE_DO"
              :f7-cancel="F7_CANCEL"
              :f8-do="F8_DO"
              :f8-pre-do="F8_PRE_DO"
              :f8-cancel="F8_CANCEL"
              :f9-do="F9_DO"
              :f9-pre-do="F9_PRE_DO"
              :f9-cancel="F9_CANCEL"
              :f11-do="F11_DO"
              :f11-pre-do="F11_PRE_DO"
              :f11-cancel="F11_CANCEL"
              :f12-do="F12_DO"
              :f12-pre-do="F12_PRE_DO"
              :f12-cancel="F12_CANCEL">
    <template v-if="initializeFlag === 1">
    <er-layout 
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'LayoutGroupFilter'"></er-layout>
    <v-splitter style="height: 100%" class="default-theme">
      <v-splitter-pane>
          <xr-ef-panel title="预警规则"
                      padding="0 0 0 0">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <div :style="data.divDisable ? data.disableStyle : `height:100%`">
                <er-grid 
                        @erGridReady="erGrid1Ready"
                        :er-form-helper-prop="erFormHelper"
                        :toolbar-options="data.gridToolbar1"
                        :config-id="'gridView1'"
                        :options="{enableClick:true}"
                        @click="gridView1Click">
                </er-grid>
              </div>
            </template>
          </xr-ef-panel>
      </v-splitter-pane>
      <v-splitter-pane>
          <xr-ef-panel title="分析项目"
                      padding="0 0 0 0">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <er-grid 
                      @erGridReady="erGrid1Ready"
                      :er-form-helper-prop="erFormHelper"
                      :toolbar-options="data.gridToolbar2"
                      :config-id="'gridView2'">
              </er-grid>
            </template>
          </xr-ef-panel>
      </v-splitter-pane>
    </v-splitter>
  </template>
  </xr-ef-form>
</template>

<script lang="ts">
import {nextTick, onMounted, reactive, ref} from "vue";
// import {CMUtil} from "@/utils/CMUtil";
import {ER} from "ERX/Er";
// import {dayjs} from "element-plus";
import {EI} from 'EIX/ei';
import erLayout from 'ERX/ErLayout';
import erGrid from "ERX/ErGrid";
import xrEfPanel from "EFX/xrEfPanel";
import xrEfForm from "EFX/xrEfForm";
import { Grid } from "ant-design-vue";
import dayjs, { Dayjs } from "dayjs";

export default {
  name: 'XQMIR150',
  components: { erLayout,erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
const initializeService = 'qmir_form_get';

// 变量定义
const formName = 'XQMIR150';
const erFormHelper =new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");

//页面变量
const data: any = reactive({
  grid1: Grid,
  grid2: Grid,
  gridToolbar1: [],
  gridToolbar2: [],
  //div禁用样式
  disableStyle: {
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0.3,
    height: 100 + '%'
  },
  divDisable: false,
  clickData: {}
})
const erGrid1Ready = () => {
  data.grid1 = erFormHelper.getGrid('gridView1');
  data.grid2 = erFormHelper.getGrid('gridView2');
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
    erFormHelper.setGridToolbarVisible('gridView1', {
        addrow: false,
        copyrow: false,
        delete: false,
        cancel: false,
        excel: true
      });
    erFormHelper.setGridToolbarVisible('gridView2', {
        addrow: false,
        copyrow: false,
        delete: false,
        cancel: false,
        excel: true
      });

    // 回调函数获取控件信息及设置定义事件等操作
    nextTick(() => {
      // 获取画面上的主要控件信息

      // 设置每页记录数为1000
      // data.grid1.options.dataSource?.pageSize(1000);
      // data.grid2.options.dataSource?.pageSize(1000);
      // 设置表格列不可编辑
      // erFormHelper.setGridEditable('gridView1', false);
      // erFormHelper.setGridEditable('gridView2', false);
    });
  } else {
    erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
  }
};


//查询表格数据
const queryInfo = async () => {
  const layoutValue = erFormHelper.getAllControlValue('LayoutGroupFilter')
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.pushData(layoutValue, true);
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir15_inq', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['TQMIR15'], 'gridView1')
  erFormHelper.setGridEditable('gridView1', false);
  erFormHelper.setGridEditable('gridView2', false);
};

//F2查询
const F2_DO = async (e: any) => {
  await queryInfo();
};

//F3规则新增维护
const F3_PRE_DO = async (e: any) => {
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
  //新增行
  erFormHelper.addRowToGrid('gridView1', true, false);
};
//F3规则新增取消
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
  await queryInfo();
};


//F3规则新增确定
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
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1', true, false);
  for (const b of bd) {
    if (b.EFFECT_DATE) {
      b.EFFECT_DATE = dayjs(b.EFFECT_DATE).format('YYYYMMDD')
    }
  }
  block.pushData(bd, true);
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir15_ins', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
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
  } else {
    return false;
  }
};


//F4规则修改维护
const F4_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable('gridView1', true);
};
//F4规则修改取消
const F4_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView1', false);
  await queryInfo();
};
//F4规则修改确认
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
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1', true);
  for (const b of bd) {
    if (b.CHECK_FLAG != 'N') {
      erFormHelper.messageWarning('状态不为编制中，不允许修改');
      return false;
    }
    for (const b of bd) {
      if (b.EFFECT_DATE) {
        b.EFFECT_DATE = dayjs(b.EFFECT_DATE).format('YYYYMMDD')
      }
    }
  }
  block.pushData(bd, true);
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir15_upd', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 设置表格列不可编辑
    erFormHelper.setGridEditable('gridView1', false);
    // 查询最新数据
    await queryInfo();
  } else {
    return false;
  }
};

//F5规则删除维护
const F5_PRE_DO = async (e: any) => {

};
//F5规则删除取消
const F5_CANCEL = async (e: any) => {
  await queryInfo();
};
//F5规则删除确认
const F5_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1', true, false);
  block.pushData(bd, true);
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir15_del', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
  } else {
    return false;
  }
};


//grid1行点击事件
const gridView1Click = async (e: any) => {
  if (e.data?.get('id') === '') {
    return;
  }
  data.clickData = e.data
  await queryAnalysis(e.data?.get('WORK_SEQ_NO'));
};

//查询分析项目
const queryAnalysis = async (workSeqNo: string) => {
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.addColumn('WORK_SEQ_NO');
  block.addRow({
    WORK_SEQ_NO: workSeqNo
  });
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir15_inq1', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['Table0'], 'gridView2');
}

//F7项目新增维护
const F7_PRE_DO = async (e: any) => {
  //区域禁用
  data.divDisable = true;
  //设置可编辑
  erFormHelper.setGridEditable('gridView2', true);
  //显示新增操作工具
  erFormHelper.setGridToolbarVisible('gridView2',
  {
        addrow: true,
        copyrow: true,
        delete: true,
        cancel: true,
        excel: true,
      });
  //新增行
  erFormHelper.addRowToGrid('gridView2', true, false);

};
//F7项目新增取消
const F7_CANCEL = async (e: any) => {
  erFormHelper.setGridToolbarVisible('gridView2',
  {
        addrow: false,
        copyrow: false,
        delete: false,
        cancel: false,
      });
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView2', false);
  //取消变更
  //data.grid2.cancelChanges();
  //解除区域禁用
  data.divDisable = false
  await queryAnalysis(data.clickData.WORK_SEQ_NO);
};

//F7项目新增确定
const F7_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView2",(): boolean =>{
    return true;
  });
  if (erFormHelper.getGridSelectRows('gridView2').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkGridInput('gridView2')) {
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView2');
  const block = new EI.EiBlock('Table1');
  block.addColumn('WORK_SEQ_NO')
  block.addRow({WORK_SEQ_NO: data.clickData.WORK_SEQ_NO})
  inInfo.addBlock(bd, 'Table0');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir15_ins1', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    erFormHelper.setGridToolbarVisible('gridView2',
    {
        addrow: false,
        copyrow: false,
        delete: false,
        cancel: false,
      });
    // 设置表格列不可编辑
    erFormHelper.setGridEditable('gridView2', false);
    //解除区域禁用
    data.divDisable = false;
    // 查询最新数据
    await queryAnalysis(data.clickData.WORK_SEQ_NO);
  } else {
    return false;
  }
};

//F8项目修改维护
const F8_PRE_DO = async (e: any) => {
  //区域禁用
  data.divDisable = true;
  //设置可编辑
  erFormHelper.setGridEditable('gridView2', true);
};
//F8项目修改取消
const F8_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView2', false);
  //解除区域禁用
  data.divDisable = false
  await queryAnalysis(data.clickData.WORK_SEQ_NO);
};
//F8项目修改确认
const F8_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView2",(): boolean =>{
    return true;
  });
  if (erFormHelper.getGridSelectRows('gridView2').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkGridInput('gridView2')) {
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView2');
  const block = new EI.EiBlock('Table1');
  block.addColumn('WORK_SEQ_NO')
  block.addRow({WORK_SEQ_NO: data.clickData.WORK_SEQ_NO})
  inInfo.addBlock(bd, 'Table0');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir15_upd1', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 设置表格列不可编辑
    erFormHelper.setGridEditable('gridView2', false);
    //解除区域禁用
    data.divDisable = false;
    // 查询最新数据
    await queryAnalysis(data.clickData.WORK_SEQ_NO);
  } else {
    return false;
  }
};

//F9项目删除维护
const F9_PRE_DO = async (e: any) => {
  data.divDisable = true;
};
//F9项目删除取消
const F9_CANCEL = async (e: any) => {
  data.divDisable = false;
};
//F9项目删除确认
const F9_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView2').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView2');
  const block = new EI.EiBlock('Table1');
  block.addColumn('WORK_SEQ_NO')
  block.addRow({WORK_SEQ_NO: data.clickData.WORK_SEQ_NO})
  inInfo.addBlock(bd, 'Table0');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir15_del1', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryAnalysis(data.clickData.WORK_SEQ_NO);
    data.divDisable = false;
  } else {
    return false;
  }
};

//F11提交维护
const F11_PRE_DO = async (e: any) => {

};
//F11提交取消
const F11_CANCEL = async (e: any) => {
  erFormHelper.messageWarning('操作已取消')
  // 查询最新数据
  await queryInfo();
};
//F11提交确认
const F11_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1', true);
  for (const b of bd) {
    if (b.CHECK_FLAG != 'N') {
      erFormHelper.messageWarning('该记录已生效，无需再次提交');
      return false;
    }
    if (b.EFFECT_DATE) {
      b.EFFECT_DATE = dayjs(b.EFFECT_DATE).format('YYYYMMDD')
    }
  }
  block.pushData(bd, true);
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir15_snd', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
  } else {
    return false;
  }
};
//F12收回维护
const F12_PRE_DO = async (e: any) => {
};
//F12收回取消
const F12_CANCEL = async (e: any) => {
  erFormHelper.messageWarning('操作已取消')
  // 查询最新数据
  await queryInfo();
};
//F12收回确认
const F12_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1', true);
  for (const b of bd) {
    if (b.EFFECT_DATE) {
      b.EFFECT_DATE = dayjs(b.EFFECT_DATE).format('YYYYMMDD')
    }
  }
  block.pushData(bd, true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir15_rcv', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
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