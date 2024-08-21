<template>
  <xr-ef-form @ready="efFormReady"
              :f2-do="F2_DO"
              :f3-cancel="F3_CANCEL"
              :f3-do="F3_DO"
              :f3-pre-do="F3_PRE_DO"
              :f4-cancel="F4_CANCEL"
              :f4-do="F4_DO"
              :f4-pre-do="F4_PRE_DO"
              :f5-cancel="F5_CANCEL"
              :f5-do="F5_DO"
              :f5-pre-do="F5_PRE_DO"
              :f7-cancel="F7_CANCEL"
              :f7-do="F7_DO"
              :f7-pre-do="F7_PRE_DO"
              :f8-cancel="F8_CANCEL"
              :f8-do="F8_DO"
              :f8-pre-do="F8_PRE_DO"
              :f9-cancel="F9_CANCEL"
              :f9-do="F9_DO"
              :f9-pre-do="F9_PRE_DO">
    <template v-if="initializeFlag === 1">
    <er-layout 
              :config-id="'LayoutGroupFilter'"
              :er-form-helper-prop="erFormHelper">
            </er-layout>
    <v-splitter style="height: 100%" class="default-theme">
      <v-splitter-pane>
          <xr-ef-panel padding="0 0 0 0"
                      title="衍生项目信息">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <div :style="data.divDisable1 ? data.disableStyle : `height:100%`">
              <er-grid 
                      :config-id="'gridView1'"
                      @erGridReady="erGrid1Ready"
                      :er-form-helper-prop="erFormHelper"
                      :toolbar-options="data.gridToolbar1"
                      :options="{enableClick:true}"
                      @click="gridView1Click">
              </er-grid>
              </div>
            </template>
          </xr-ef-panel>
      </v-splitter-pane>
      <v-splitter-pane>
          <xr-ef-panel padding="0 0 0 0"
                      title="衍生算法">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <er-grid 
                      :config-id="'gridView2'"
                      @erGridReady="erGrid1Ready"
                      :er-form-helper-prop="erFormHelper"
                      :toolbar-options="data.gridToolbar2">
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
import { EI } from 'EIX/ei';
import { ER } from 'ERX/Er';
import erLayout from 'ERX/ErLayout';
import erGrid from "ERX/ErGrid";
import xrEfPanel from "EFX/xrEfPanel";
import xrEfForm from "EFX/xrEfForm";
import { Grid } from "ant-design-vue";

export default {
  name: 'XQMIR040',
  components: { erLayout,erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
const initializeService = 'qmir_form_get';

// 变量定义
const formName = 'XQMIR040';
const erFormHelper =new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");

//页面变量
const data:any = reactive({
  grid1:Grid,
  grid2:Grid,
  gridToolbar1:[],//增删改按钮
  gridToolbar2:[],
  //div禁用样式
  disableStyle:{
    pointerEvents:'none',
    userSelect:'none',
    opacity:0.3,
    height:100+'%'
  },
  divDisable1:false,//区域禁用
  clickData:{}
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
  // 调用后台服务service获取配置数据并实例化工具类--Initialize
  const initialResult = await erFormHelper.Initialize(formPartition.value, formName, '', initializeService);
  //判断初始化返回结果，若>=0表示正确获取初始化信息，否则报错
  if (initialResult.flag >= 0) {
    // 画面工具类初始化成功后将画面渲染条件设置为1
    initializeFlag.value = 1;
    //设置增删改小按钮属性
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

      // 设置表格列不可编辑
      // erFormHelper.setGridEditable('gridView1',false);
      // erFormHelper.setGridEditable('gridView2',false);
    });
  } else {
    erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
  }
};

//F2查询
const F2_DO = async (e: any) => {
  await queryMatCode(erFormHelper.getControlValue("LayoutGroupFilter", "MAT_CODE"));
};
//调接口查询gridview1
const queryMatCode = async (matCode:string) => {
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.addColumn('INDEX_FROM');
  block.addColumn('RETURN_NUM');
  block.addColumn('MAT_CODE');
  block.addRow({
    INDEX_FROM: 0,
    RETURN_NUM: 1000,
    MAT_CODE: matCode,
  });
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir04_inq', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['TQMIR04'], 'gridView1');
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView1',false);
  erFormHelper.setGridEditable('gridView2',false);
}

//F3分析项目新增维护
const F3_PRE_DO = async (e: any) => {
  //区域禁用
  data.divDisable = true;
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
  //设置可编辑
  erFormHelper.setGridEditable('gridView1',true);
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
  erFormHelper.setGridEditable('gridView1',false);
  //取消变更
  //data.grid1.cancelChanges();
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
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1',true,false);
  block.pushData(bd,true);
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir04_ins', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
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
    await queryMatCode(erFormHelper.getControlValue("LayoutGroupFilter", "MAT_CODE"));
    data.divDisable = false;
  }else {
    return false;
  }
};

//F4标准修改维护
const F4_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable('gridView1',true);
};
//F4标准修改取消
const F4_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView1',false);
  await queryMatCode(erFormHelper.getControlValue("LayoutGroupFilter", "MAT_CODE"));
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
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1',true,false);
  block.pushData(bd,true);
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir04_upd', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
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
    await queryMatCode(erFormHelper.getControlValue("LayoutGroupFilter", "MAT_CODE"));
    data.divDisable = false;
  }else {
    return false;
  }
};

//F5标准删除维护
const F5_PRE_DO = async (e: any) => {

};
//F5标准删除取消
const F5_CANCEL = async (e: any) => {
  await queryMatCode(erFormHelper.getControlValue("LayoutGroupFilter", "MAT_CODE"));
};
//F5标准删除确认
const F5_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1',true,false);
  block.pushData(bd,true);
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir04_del', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
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
    await queryMatCode(erFormHelper.getControlValue("LayoutGroupFilter", "MAT_CODE"));
    data.divDisable = false;
  }else {
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
//查询衍生算法
const queryAnalysis = async (workSeqNo:string) => {
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.addColumn('WORK_SEQ_NO');
  block.addRow({WORK_SEQ_NO: workSeqNo});
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir04_inq1', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['TQMIR05'], 'gridView2');
}




//F7判定类别新增维护
const F7_PRE_DO = async (e: any) => {
  //区域1禁用
  data.divDisable1 = true
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
  //设置可编辑
  erFormHelper.setGridEditable('gridView2',true);
};
//F7判定类别新增取消
const F7_CANCEL = async (e: any) => {
  erFormHelper.setGridToolbarVisible('gridView2',
  {
      addrow: false,
      copyrow: false,
      delete: false,
      cancel: false,
    });
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView2',false);
  //取消变更
  //data.grid2.cancelChanges();
  //解除区域禁用
  data.divDisable1 = false
};

//F7判定类别新增确认
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
  block.addRow({WORK_SEQ_NO:data.clickData.WORK_SEQ_NO})
  inInfo.addBlock(bd,'Table2');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir04_copy', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
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
    data.divDisable1 = false;
  }else {
    return false;
  }
};


//F8项目修改维护
const F8_PRE_DO = async (e: any) => {
  //区域1禁用
  data.divDisable1 = true
  //设置可编辑
  erFormHelper.setGridEditable('gridView2',true);
};
//F8项目修改取消
const F8_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView2',false);
  await queryAnalysis(data.clickData.WORK_SEQ_NO);
  data.divDisable1 = false;
};


//F8修改确认
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
  block.addRow({WORK_SEQ_NO:data.clickData.WORK_SEQ_NO})
  inInfo.addBlock(bd,'Table2');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir04_upd1', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    // 设置表格列不可编辑
    erFormHelper.setGridEditable('gridView2',false);
    // 查询最新数据
    await queryAnalysis(data.clickData.WORK_SEQ_NO);
    data.divDisable1 = false;
  }else{
    return false;
  }
};

//F9删除维护
const F9_PRE_DO = async (e: any) => {
  data.divDisable1 = true;
};
//F9删除取消
const F9_CANCEL = async (e: any) => {
  data.divDisable1 = false;
};
//F9判定类别删除确认
const F9_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView2').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView2');
  const block = new EI.EiBlock('Table1');
  block.addColumn('WORK_SEQ_NO')
  block.addRow({WORK_SEQ_NO:data.clickData.WORK_SEQ_NO})
  inInfo.addBlock(bd,'Table2');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir04_del1', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    // 查询最新数据
    await queryAnalysis(data.clickData.WORK_SEQ_NO);
    data.divDisable1 = false;
  }else {
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