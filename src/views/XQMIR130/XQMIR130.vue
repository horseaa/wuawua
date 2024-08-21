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
              :f6-cancel="F6_CANCEL"
              :f7-do="F7_DO"
              :f7-pre-do="F7_PRE_DO"
              :f7-cancel="F7_CANCEL"
              :f8-do="F8_DO"
              :f8-pre-do="F8_PRE_DO"
              :f8-cancel="F8_CANCEL"
              :f9-do="F9_DO"
              :f9-pre-do="F9_PRE_DO"
              :f9-cancel="F9_CANCEL"
              :f10-do="F10_DO"
              :f10-pre-do="F10_PRE_DO"
              :f10-cancel="F10_CANCEL">
    <template v-if="initializeFlag === 1">
    <er-layout 
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'LayoutGroupFilter'"></er-layout>
      <v-splitter style="height: 100%" class="default-theme">
        <v-splitter-pane  size="70">
            <xr-ef-form-base>
              <xr-ef-panel title="关系信息"
                            padding="0 0 5px 5px">
                <template #customButtonSlot>

                </template>
                <template #contentSlot>
                  <div :style="data.divDisable ? data.disableStyle : `height:100%`">
                    <er-grid 
                            @erGridReady="erGrid1Ready"
                            :er-form-helper-prop="erFormHelper"
                            :toolbar-options="data.gridToolbar1"
                            :config-id="'gridView1'"
                            @focus-changed="gridView1FocusChanged"
                            :options="{enableClick:true}"
                            @click="gridView1Click">
                    </er-grid>
                  </div>
                </template>
              </xr-ef-panel>
            </xr-ef-form-base>
        </v-splitter-pane>
        <v-splitter-pane  size="30">
            <xr-ef-panel title="分析项目信息"
                          padding="0 5px 5px 0">
              <template #customButtonSlot>

              </template>
              <template #contentSlot>
                <er-grid 
                        @erGridReady="erGrid1Ready"
                        :er-form-helper-prop="erFormHelper"
                        :toolbar-options="data.gridToolbar2"
                        @focus-changed="gridView2FocusChanged"
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
import { EI } from 'EIX/ei';
import { ER } from 'ERX/Er';
import erLayout from 'ERX/ErLayout';
import erGrid from "ERX/ErGrid";
import xrEfPanel from "EFX/xrEfPanel";
import xrEfForm from "EFX/xrEfForm";
import { nextTick, onMounted, reactive, ref } from 'vue';
import { Grid } from 'ant-design-vue';

export default {
  name: 'XQMIR130',
  components: { erLayout,erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
const initializeService = 'qmir_form_get';

// 变量定义
const formName = 'XQMIR130';
const erFormHelper =new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");

//页面变量
const data:any = reactive({
  grid1:Grid,
  grid2:Grid,
  gridToolbar1:[],
  gridToolbar2:[],
  //div禁用样式
  disableStyle:{
    pointerEvents:'none',
    userSelect:'none',
    opacity:0.3,
    height:100+'%'
  },
  divDisable:false,
  clickData:{}
})

const erGrid1Ready = () => {
  data.grid1 = erFormHelper.getGrid('gridView1');
  data.grid2 = erFormHelper.getGrid('gridView2');
}
let mode = ""; // 当前操作的模式：主要用来区分是新增还是删除
const gridView1FocusChanged = (e: any) => {
  if (e) {
      if (e.rowChanged && e.data && mode== "F3") {
        // 判断是否是新增行
      if (e.data.isNew === true) {
        erFormHelper.setGridEditable('gridView1',true);
      } else {
        erFormHelper.setGridEditable('gridView1',false);
      }
    }
  }
};
const gridView2FocusChanged = (e: any) => {
  if (e) {
    if (e.rowChanged && e.data && mode== "F6") {
      // 判断是否是新增行
      if (e.data.isNew === true) {
        erFormHelper.setGridEditable('gridView2',true);
      } else {
        erFormHelper.setGridEditable('gridView2',false);
      }
    }
  }
};
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
    });
  } else {
    erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
  }
};

//查询表格数据
const queryInfo = async () => {
 // erFormHelper.queryDataByDataSource('gridView1', { filterConfigId: 'LayoutGroupFilter'});
  const layoutValue: any = erFormHelper.getAllControlValue('LayoutGroupFilter');
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.pushData(layoutValue, true);
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir13_inq', inInfo, false, true, false, formPartition.value);
  console.log("🚀 ~ queryInfo ~ outInfo:", outInfo)
  erFormHelper.mergeDataToGrid(outInfo.getBlock(0), 'gridView1');
  erFormHelper.messageInfo(`查询完成,共查询到[${outInfo.getBlock(0).data.length}]条数据`);
  erFormHelper.setGridEditable('gridView1',false);
  erFormHelper.setGridEditable('gridView2',false);
};

//F2查询
const F2_DO = async (e: any) => {
 await queryInfo();
};

//F3标准新增确定
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
  //调用后台通用保存,需传入表信息,block内容包含表名和主键
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd);
  console.log("🚀 ~ constF3_DO= ~ inInfo:", inInfo);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir13_ins', inInfo, true, true);

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
    erFormHelper.setGridEditable('gridView1',false);
    // 查询最新数据
    await queryInfo();
  }else {
    return false;
  }
};

//F3标准新增维护
const F3_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable('gridView1',true);
  //显示新增操作工具
  erFormHelper.setGridToolbarVisible('gridView1',
  {
      addrow: true,
      copyrow: true,
      delete: true,
      cancel: true,
      excel: true
    });
  //新增行
  erFormHelper.addRowToGrid('gridView1',true,false);
  mode = "F3";
};
//F3标准新增取消
const F3_CANCEL = async (e: any) => {
  erFormHelper.setGridToolbarVisible('gridView1',
  {
      addrow: false,
      copyrow: false,
      delete: false,
      cancel: false,
    });
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView1',false);
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

/*  const inInfo = new EI.EIInfo();
  //调用后台通用保存,需传入表信息,block内容包含表名和主键
  const block = new EI.EiBlock('TABLE_INFO');
  block.addColumn('TABLE_NAME');
  block.addColumn('KEY_FIELDS');
  block.addRow({TABLE_NAME: 'TQMIR13',KEY_FIELDS: 'COMPANY_CODE,WORK_SEQ_NO'});

  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');

  inInfo.addBlock(block);
  inInfo.addBlock(bd,'TQMIR13_MODIFY');*/

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1',true);
  block.pushData(bd,true);
  inInfo.addBlock(block);

  // 调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir13_upd', inInfo, true, true);

  //调用后台服务保存数据
//  const outInfo = await erFormHelper.callService('qmir_save', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 设置表格列不可编辑
    erFormHelper.setGridEditable('gridView1',false);
    // 查询最新数据
    await queryInfo();
  }else{
    return false;
  }
};
//F4标准修改维护
const F4_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable('gridView1',true);
  mode = " ";
};
//F4标准修改取消
const F4_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView1',false);
  await queryInfo();
};

//F5标准删除确认
const F5_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1', true);
  block.pushData(bd, true);
  inInfo.addBlock(block);

  // 调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir13_del', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
  }else {
    return false;
  }
  // 查询最新数据
  await queryInfo();
  await queryAnalysis(data.clickData.WORK_SEQ_NO);
};
//F5标准删除维护
const F5_PRE_DO = async (e: any) => {

};
//F5标准删除取消
const F5_CANCEL = async (e: any) => {
  await queryInfo();
};

//F6项目新增确认
const F6_DO = async (e: any) => {
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
  block.addRow({WORK_SEQ_NO:data.clickData.WORK_SEQ_NO})
  inInfo.addBlock(bd,'Table0');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir13_ins1', inInfo, true, true);

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
    erFormHelper.setGridEditable('gridView2',false);
    // 查询最新数据
    await queryAnalysis(data.clickData.WORK_SEQ_NO);
    data.divDisable = false;
  }else {
    return false;
  }
};
//F6项目新增维护
const F6_PRE_DO = async (e: any) => {
  if (data.clickData == null) {
    erFormHelper.messageWarning('请单击要操作的标准!')
    return false;
  }
  if (data.clickData.CHECK_FLAG != '1') {
    erFormHelper.messageWarning('状态已是提交状态，不可进行维护!')
    return false;
  }
  //显示新增操作工具
  erFormHelper.setGridToolbarVisible('gridView2',
  {
      addrow: true,
      copyrow: true,
      delete: true,
      cancel: true,
      excel: true
    });
  //新增行
  erFormHelper.addRowToGrid('gridView2',true,false);
  //区域禁用
  data.divDisable = true;
  //设置可编辑
  erFormHelper.setGridEditable('gridView2', true);
  mode= "F6"
};
//F6项目新增取消
const F6_CANCEL = async (e: any) => {
  erFormHelper.setGridToolbarVisible('gridView2',
  {
      addrow: false,
      copyrow: false,
      delete: false,
      cancel: false,
    });
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView2',false);
  // //取消变更
  // data.grid2.cancelChanges();
  //解除区域禁用
  data.divDisable = false

  await queryAnalysis(data.clickData.WORK_SEQ_NO);
};

//F7项目删除确认
const F7_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView2').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView2');
  const block = new EI.EiBlock('Table1');
  block.addColumn('WORK_SEQ_NO')
  block.addRow({WORK_SEQ_NO:data.clickData.WORK_SEQ_NO})
  inInfo.addBlock(bd,'Table0');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir13_del1', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryAnalysis(data.clickData.WORK_SEQ_NO);
    data.divDisable = false;
  }else {
    return false;
  }
};
//F7项目删除维护
const F7_PRE_DO = async (e: any) => {
  if (data.clickData == null) {
    erFormHelper.messageWarning('请单击要操作的标准!')
    return false;
  }
  if (data.clickData.CHECK_FLAG != '1') {
    erFormHelper.messageWarning('状态已是提交状态，不可进行维护!')
    return false;
  }
  data.divDisable = true;
};
//F7项目删除取消
const F7_CANCEL = async (e: any) => {
  data.divDisable = false;
  // 查询最新数据
  await queryAnalysis(data.clickData.WORK_SEQ_NO);
};

//F8提交确认
const F8_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd,'Table0');
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir13_snd', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo()
  }else {
    return false;
  }
};
//F8提交维护
const F8_PRE_DO = async (e: any) => {

};
//F8提交取消
const F8_CANCEL = async (e: any) => {
  // 查询最新数据
  await queryInfo();
};

//F9批准确认
const F9_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd,'Table0');
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir13_app', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
  }else {
    return false;
  }
};
//F9批准维护
const F9_PRE_DO = async (e: any) => {

};
//F9批准取消
const F9_CANCEL = async (e: any) => {
  // 查询最新数据
  await queryInfo();
};

//F10收回确认
const F10_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd,'Table0');
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir13_rcv', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
  }else {
    return false;
  }
};
//F10收回维护
const F10_PRE_DO = async (e: any) => {

};
//F10收回取消
const F10_CANCEL = async (e: any) => {
  // 查询最新数据
  await queryInfo();
};

//grid1行点击事件
const gridView1Click = async (e: any) => {
  if (e.data?.get('id') === '') {
    return;
  }
  data.clickData = e.data
  await queryAnalysis(e.data?.get('WORK_SEQ_NO'));
  mode = " ";
};

//查询分析项目
const queryAnalysis = async (workSeqNo:string) => {
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.addColumn('WORK_SEQ_NO');
  block.addRow({
    WORK_SEQ_NO: workSeqNo
  });
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir13_inq1', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['TQMIR14'], 'gridView2');
}



onMounted(() => {
  // initializePage();
});
</script>

<style lang="scss">
 .efpanel-root {
  height: 100%;
  }
</style>
