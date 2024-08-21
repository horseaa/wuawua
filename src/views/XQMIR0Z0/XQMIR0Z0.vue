<template>
  <xr-ef-form 
            @ready="efFormReady"
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
            :f8-cancel="F8_CANCEL">
    <template v-if="initializeFlag === 1">
    <er-layout 
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'LayoutGroupFilter'"></er-layout>
    <!-- <xr-ef-panel title="查询条件"
      padding="5px">
      <template #contentSlot>
        <div id="XQMIR0Z0Query"></div>
      </template>
    </xr-ef-panel> -->
    <v-splitter style="height: 100%" class="default-theme">
      <v-splitter-pane>
          <xr-ef-panel title="画面信息"
                      padding="0 0 5px 5px">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <er-grid    @erGridReady="erGrid1Ready"
                          :er-form-helper-prop="erFormHelper"
                          :config-id="'gridView1'"
                          :options="{enableClick:true}"
                          @click="gridView1Click">
              </er-grid>
            </template>
          </xr-ef-panel>
      </v-splitter-pane>
      <v-splitter-pane>
          <xr-ef-panel title="画面显示的分析项目"
                      padding="0 0 5px 0">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <er-grid    @erGridReady="erGrid2Ready"
                          :er-form-helper-prop="erFormHelper"
                          :toolbar-options="data.gridToolbar2"
                          :config-id="'gridView2'"
                          @focus-changed="gridView2FocusChanged">
              </er-grid>
            </template>
          </xr-ef-panel>
      </v-splitter-pane>
      <v-splitter-pane>
          <xr-ef-panel title="画面显示的判定项目"
                      padding="0 5px 5px 0">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <er-grid 
                      :er-form-helper-prop="erFormHelper"
                      :toolbar-options="data.gridToolbar3"
                      :config-id="'gridView3'"
                      @focus-changed="gridView3FocusChanged">
              </er-grid>
            </template>
          </xr-ef-panel>
      </v-splitter-pane>
    </v-splitter>
  </template>
  </xr-ef-form>
</template>


<script lang="ts">
import {
    computed,
    defineComponent,
    onMounted,
    reactive,
    ref,
    watch,
    toRaw,
    nextTick
  } from 'vue';
import { EI } from 'EIX/ei';
import { ER } from 'ERX/Er';
import erLayout from 'ERX/ErLayout';
import erGrid from "ERX/ErGrid";
import xrEfPanel from "EFX/xrEfPanel";
import xrEfForm from "EFX/xrEfForm";
import { Grid } from '@ag-grid-community/core';

export default {
  name: 'XQMIR0Z0',
  components: { erLayout,erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
// const formParams = efFormInfo.value.getFormParams();
// const formPartition = formParams.formPartition;
const initializeService = 'qmir_form_get';
// const initializeService = 'qmir_form_get';

// 变量定义
const formName = 'XQMIR0Z0';
const erFormHelper =new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");

//页面变量
const data:any = reactive({
  grid1:Grid,
  grid2:Grid,
  grid3:Grid,
  gridToolbar1:[],
  gridToolbar2:[],
  gridToolbar3:[],
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
}

const erGrid2Ready = () => {
  data.grid2 = erFormHelper.getGrid('gridView2');
}
let mode = ""; // 当前操作的模式：主要用来区分是新增还是删除
const gridView3FocusChanged = (e: any) => {
  if (e) {
    if (e.rowChanged && e.data && mode== "F6") {
      // 判断是否是新增行
      if (e.data.isNew === true) {
        erFormHelper.setGridEditable('gridView3',true);
      } else {
        erFormHelper.setGridEditable('gridView3',false);
      }
    }
  }
};
const gridView2FocusChanged = (e: any) => {
  if (e) {
    if (e.rowChanged && e.data && mode== "F3") {
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

// 画面相关数据初始化--异步调用
const initializePage = async () => {
  // 调用后台服务service获取配置数据并实例化工具类--Initialize
  const initialResult = await erFormHelper.Initialize(formPartition.value, formName, '', initializeService);

  //判断初始化返回结果，若>=0表示正确获取初始化信息，否则报错
  if (initialResult.flag >= 0) {
    // 画面工具类初始化成功后将画面渲染条件设置为1
    initializeFlag.value = 1;
    erFormHelper.setGridToolbarVisible('gridView2', {
        addrow: false,
        copyrow: false,
        delete: false,
        cancel: false,
        excel: true
      });
    erFormHelper.setGridToolbarVisible('gridView3', {
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
    // 在页面上侧中间显示错误信息栏
    erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
  }
};


//F2查询
const F2_DO = async (e: any) => {
  await queryMapcode(erFormHelper.getControlValue("LayoutGroupFilter", "MAP_CODE"));
};
//查询画面代码gridview1
const queryMapcode = async (mapCode:string) => {
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.addColumn('INDEX_FROM');
  block.addColumn('RETURN_NUM');
  block.addColumn('MAP_CODE');
  block.addRow({
    INDEX_FROM: 0,
    RETURN_NUM: 2,
    MAP_CODE: mapCode,
  });
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir0z_inq', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['IRQ8'], 'gridView1');
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView1',false);
  erFormHelper.setGridEditable('gridView2',false);
  erFormHelper.setGridEditable('gridView3',false);
}
//grid1行点击事件
const gridView1Click = async (e: any) => {
  if (e.data?.get('id') === '') {
    return;
  }
  data.clickData = e.data
  await queryAnalysis(e.data?.get('MAP_CODE'));
};
//查询分析项目
const queryAnalysis = async (mapCode:string) => {
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.addColumn('INDEX_FROM');
  block.addColumn('RETURN_NUM');
  block.addColumn('MAP_CODE');
  block.addRow({
    INDEX_FROM: 0,
    RETURN_NUM: 1000,
    MAP_CODE: mapCode
  });
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir0z_inq1', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['Table0'], 'gridView2');
  erFormHelper.mergeDataToGrid(outInfo.blocks['Table2'], 'gridView3');
}


//F3分析项目新增维护
const F3_PRE_DO = async (e: any) => {
  //区域禁用
  data.divDisable = true;
  //显示新增操作工具
  erFormHelper.setGridToolbarVisible('gridView2', {
        addrow: true,
        copyrow: true,
        delete: true,
        cancel: true,
        excel: true,
      });
  //新增行
  erFormHelper.addRowToGrid('gridView2',true,false);
  //设置可编辑
  erFormHelper.setGridEditable('gridView2',true);
  mode = "F3";
};
//F3分析项目新增取消
const F3_CANCEL = async (e: any) => {
  erFormHelper.setGridToolbarVisible('gridView2', {
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
  data.divDisable = false
  // 查询最新数据
  await queryAnalysis(data.clickData.MAP_CODE);
};

//F3分析项目新增确认
const F3_DO = async (e: any) => {
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
  block.addColumn('MAP_CODE')
  block.addRow({MAP_CODE:data.clickData.MAP_CODE})
  inInfo.addBlock(bd,'Table0');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir0z_ins', inInfo, true, true);

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
    await queryAnalysis(data.clickData.MAP_CODE);
    data.divDisable = false;
  }else {
    return false;
  }
};


//F4标准修改维护
const F4_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable('gridView2',true);
  mode = " ";
};
//F4标准修改取消
const F4_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView2',false);
  await queryAnalysis(data.clickData.MAP_CODE);
};


//F4标准修改确认
const F4_DO = async (e: any) => {
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
  block.addColumn('MAP_CODE')
  block.addRow({MAP_CODE:data.clickData.MAP_CODE})
  inInfo.addBlock(bd,'Table0');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir0z_upd', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    // 设置表格列不可编辑
    erFormHelper.setGridEditable('gridView2',false);
    // 查询最新数据
    await queryAnalysis(data.clickData.MAP_CODE);
  }else{
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
  // 查询最新数据
  await queryAnalysis(data.clickData.MAP_CODE);
};
//F5项目删除确认
const F5_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView2').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView2');
  const block = new EI.EiBlock('Table1');
  block.addColumn('MAP_CODE')
  block.addRow({MAP_CODE:data.clickData.MAP_CODE})
  inInfo.addBlock(bd,'Table0');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir0z_del', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    // 查询最新数据
    await queryAnalysis(data.clickData.MAP_CODE);
    data.divDisable = false;
  }else {
    return false;
  }
};



//F6判定类别新增维护
const F6_PRE_DO = async (e: any) => {
  //区域禁用
  data.divDisable = true;
  //设置可编辑
  erFormHelper.setGridEditable('gridView3',true);
  //显示新增操作工具
  erFormHelper.setGridToolbarVisible('gridView3',
      {
        addrow: true,
        copyrow: true,
        delete: true,
        cancel: true,
        excel: true
      });
  //新增行
  erFormHelper.addRowToGrid('gridView3',true,false);
  mode = "F6";
};
//F6判定类别新增取消
const F6_CANCEL = async (e: any) => {
  erFormHelper.setGridToolbarVisible('gridView3',
      {
        addrow: false,
        copyrow: false,
        delete: false,
        cancel: false,
      });
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView3',false);
  //取消变更
  //data.grid3.cancelChanges();
  //解除区域禁用
  data.divDisable = false;
  await queryAnalysis(data.clickData.MAP_CODE);
};

//F6判定类别新增确认
const F6_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView3",(): boolean =>{
    return true;
  });
  if (erFormHelper.getGridSelectRows('gridView3').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkGridInput('gridView3')) {
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView3');
  const block = new EI.EiBlock('Table1');
  block.addColumn('MAP_CODE')
  block.addRow({MAP_CODE:data.clickData.MAP_CODE})
  inInfo.addBlock(bd,'Table2');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir0z_ins1', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.setGridToolbarVisible('gridView3',
        {
          addrow: false,
          copyrow: false,
          delete: false,
          cancel: false,
        });
    // 设置表格列不可编辑
    erFormHelper.setGridEditable('gridView3',false);
    // 查询最新数据
    await queryAnalysis(data.clickData.MAP_CODE);
    data.divDisable = false;
  }else {
    return false;
  }
};

//F7判定类别修改维护
const F7_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable('gridView3',true);
  mode = " ";
};
//F7判定类别修改取消
const F7_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView3',false);
  await queryAnalysis(data.clickData.MAP_CODE);
};


//F7判定类别修改确认
const F7_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView3",(): boolean =>{
    return true;
  });
  if (erFormHelper.getGridSelectRows('gridView3').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkGridInput('gridView3')) {
    return false;
  }
  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView3');
  const block = new EI.EiBlock('Table1');
  block.addColumn('MAP_CODE')
  block.addRow({MAP_CODE:data.clickData.MAP_CODE})
  inInfo.addBlock(bd,'Table2');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir0z_upd1', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    // 设置表格列不可编辑
    erFormHelper.setGridEditable('gridView3',false);
    // 查询最新数据
    await queryAnalysis(data.clickData.MAP_CODE);
  }else{
    return false;
  }
};

//F8判定类别删除维护
const F8_PRE_DO = async (e: any) => {
  data.divDisable = true;
};
//F8判定类别删除取消
const F8_CANCEL = async (e: any) => {
  data.divDisable = false;
  await queryAnalysis(data.clickData.MAP_CODE);
};
//F8判定类别删除确认
const F8_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView3').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView3');
  const block = new EI.EiBlock('Table1');
  block.addColumn('MAP_CODE')
  block.addRow({MAP_CODE:data.clickData.MAP_CODE})
  inInfo.addBlock(bd,'Table2');
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir0z_del1', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    // 查询最新数据
    await queryAnalysis(data.clickData.MAP_CODE);
    data.divDisable = false;
  }else {
    return false;
  }
};

/*//grid1焦点行事件
const gridView2FocusChanged = async (e: any) => {
  // 禁用修改非新增行
  forbidChangeExistedRows(e);
};

// 非新增行不可编辑
const forbidChangeExistedRows = (e: any) => {
  if (e.data && e.colDefEditable && !e.data.isNew) {
    e.column.colDef.editable = false;
  }
};*/



onMounted(() => {
  // initializePage();
});
</script>

 <style lang="scss">
 .efpanel-root {
  height: 100%;
  }
  </style>