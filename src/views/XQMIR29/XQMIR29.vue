<template>
  <xr-ef-form @ready="efFormReady" :f2-do="F2_DO" :f3-do="F3_DO" :f3-pre-do="F3_PRE_DO" :f3-cancel="F3_CANCEL"
    :f4-do="F4_DO" :f4-pre-do="F4_PRE_DO" :f4-cancel="F4_CANCEL" :f5-do="F5_DO" :f5-pre-do="F5_PRE_DO"
    :f5-cancel="F5_CANCEL" :f6-do="F6_DO" :f6-pre-do="F6_PRE_DO" :f6-cancel="F6_CANCEL" :f7-do="F7_DO"
    :f7-pre-do="F7_PRE_DO" :f7-cancel="F7_CANCEL" :f8-do="F8_DO" :f8-pre-do="F8_PRE_DO" :f8-cancel="F8_CANCEL"
    :f9-do="F9_DO" :f9-pre-do="F9_PRE_DO" :f9-cancel="F9_CANCEL" :f10-do="F10_DO" :f10-pre-do="F10_PRE_DO"
    :f10-cancel="F10_CANCEL">
    <template v-if="initializeFlag === 1">
      <er-layout :er-form-helper-prop="erFormHelper" :config-id="'LayoutGroupFilter'"></er-layout>
      <v-splitter style="height: 100%" class="default-theme">
        <v-splitter-pane size="80%">
          <xr-ef-form-base>
            <xr-ef-panel title="关系信息" padding="0 0 5px 5px">
              <template #customButtonSlot>

              </template>
              <template #contentSlot>
                <div :style="data.divDisable ? data.disableStyle : `height:100%`">
                  <er-grid @erGridReady="erGrid1Ready" :er-form-helper-prop="erFormHelper"
                    :toolbar-options="data.gridToolbar1" :config-id="'gridView1'" :options="{ enableClick: true }"
                    @focus-changed="gridView1FocusChanged" >
                  </er-grid>
                </div>
              </template>
            </xr-ef-panel>
          </xr-ef-form-base>
        </v-splitter-pane>
        <v-splitter-pane size="20%">
          <xr-ef-panel title="分析项目信息" padding="0 5px 5px 0">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <er-grid @erGridReady="erGrid1Ready" :er-form-helper-prop="erFormHelper"
                :toolbar-options="data.gridToolbar2" :config-id="'gridView2'">
              </er-grid>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
      </v-splitter>

      <xr-ef-dialog v-model:visible="xrEfDialogVisible" :width="800" :height="500" :closeable="true">
        <div style="height: 93%; overflow: hidden;">

          <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'LayoutGroupFilter2'"
            @item-button-click="layoutButtonClick">
          </er-layout>

          <xr-ef-panel title="明细信息" padding="5px">
            <template #contentSlot>
              <div style="height: 80%;overflow-y: auto;">
                <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'gridView21'">
                </er-grid>
              </div>
            </template>
          </xr-ef-panel>
        </div>

        <div style="
            margin: 0px 0px 5px 0px;
            display: flex;
            justify-content: right;
            align-items: center;
            background-color: #f5f5f5;
          ">
          <a-button style="width: 60px;
          background-color: #0078D7;color: white;border-radius: 5px;margin-right: 30px " @Click="commit">
            确定
          </a-button>
        </div>

      </xr-ef-dialog>


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
import xrEfDialog from "EFX/xrEfDialog";//引入弹框
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import dayjs from "dayjs";
export default {
  name: 'XQMIR29',
  components: { erLayout, erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
const initializeService = 'qmir_form_get';

// 变量定义
//const formName = 'XQMIR29';
const formName = ref('XQMIR29');

const erFormHelper = new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");
// 弹框是否显示
const currentRow = ref();
const xrEfDialogVisible = ref(false);
const btnIsPress = ref(false); // 按钮是否按下
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
  clickData: {},

  DATA_RESOURCE_M: "ALL",
  DATA_RESOURCE_AP: "ALL",
  DATA_RESOURCE_P: "ALL",
})

const erGrid1Ready = (params: any) => {
  data.grid1 = erFormHelper.getGrid("gridView1");
  data.grid2 = erFormHelper.getGrid("gridView2");
  console.log("params:", params);
  // 绑定自定义监听事件--编辑状态
  params.api.addEventListener("cellClicked", cellEditEvent);
};
//触发弹框
const cellEditEvent = async (e: any) => {
  currentRow.value = e.data;
  //列名为MAT_CODE且按钮按下
  if (e.column.colId === "MAT_CODE" && btnIsPress.value && mode == "F3") {//新增的时候才触发弹框
    xrEfDialogVisible.value = true;    //显示画面
    // 数据填充到LayoutGroupFilter2
    setTimeout(() => {
      erFormHelper.setControlValue('LayoutGroupFilter2', 'SAMPLE_POS_CODE', data.DATA_RESOURCE_AP + "FC");//YLFC
    }, 0);
  }
};


let mode = ""; // 当前操作的模式：主要用来区分是新增还是删除
const gridView1FocusChanged = (e: any) => {
  if (e) {
    if (e.rowChanged && e.data && mode == "F3") {
      // 判断是否是新增行
      if (e.data.isNew === true) {
        erFormHelper.setGridEditable('gridView1', true);
      } else {
        erFormHelper.setGridEditable('gridView1', false);
      }
    }
  }
  if (e.data?.get('id') === '') {
    return;
  }
  if (e.data?.get("INSPECT_PLAN_NO") === "") {
    return;
  }
  data.clickData = e.data
  queryAnalysis(e.data?.get('INSPECT_PLAN_NO'));
};

const efFormReady = (e: any) => {
  efFormInfo.value = e.formInfo;
  efFormIsReady.value = true;
  formPartition.value = efFormInfo.value.formPartition;
  console.log("🚀 ~ initializePage ~ formPartition.value:", formPartition.value);

  // 初始化低代码工具类
  initializePage();
};
// 画面相关数据初始化
const initializePage = async () => {
  const paras = efFormInfo.value;
  console.log("🚀 ~ initializePage ~ paras:", paras);
  if (paras.formParams?.form_name) formName.value = paras.formParams['form_name'];
  if (paras.formParams?.MAP_CODE) data.MAP_CODE = paras.formParams['MAP_CODE'];
  if (paras.formParams?.TYPE) data.TYPE = paras.formParams['TYPE'];
  if (paras.formParams?.DATA_RESOURCE_M) data.DATA_RESOURCE_M = paras.formParams['DATA_RESOURCE_M'];
  if (paras.formParams?.DATA_RESOURCE_AP) data.DATA_RESOURCE_AP = paras.formParams['DATA_RESOURCE_AP'];
  if (paras.formParams?.DATA_RESOURCE_P) data.DATA_RESOURCE_P = paras.formParams['DATA_RESOURCE_P'];

  const initialResult = await erFormHelper.Initialize(formPartition.value, formName.value, '', initializeService);
  console.log("🚀 156~ initializePage ~ formName.value:", formName.value);
  console.log("🚀 156~ initializePage ~ formName.value:", data.DATA_RESOURCE_M);

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
    // 回调函数获取控件信息及设置定义事件等操作
    nextTick(() => {

    });
  } else {
    erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
  }
};


/* // 单元格编辑事件
const cellEditEvent = async (e: any) => {
  if (e.column.colId === 'INSPECT_SEQ_NO') {    
    const inInfo = new EI.EIInfo();
    const block =  erFormHelper.getGridCurrentRowAsBlock('gridView1');
    const bd = new EI.EiBlock();
    bd.addColumn('QUERY_TYPE')
    bd.addRow({ QUERY_TYPE: 'I' })
    inInfo.addBlock(block, 'Table0');
    inInfo.addBlock(bd, 'Table1');
    console.log("🚀 ~ cellEditEvent ~ G188:", inInfo);
    const outInfo = await erFormHelper.callService('qmir29_inq2', inInfo, false, true, false, formPartition.value);
    console.log("🚀 ~ queryInfo ~ outInfo-G190:", outInfo)
    erFormHelper.mergeDataToGrid(outInfo.getBlock(0), 'gridView2');
    erFormHelper.setGridEditable('gridView2', true);
    erFormHelper.checkAllGridRow('gridView2');
  }

} */;

//查询表格数据
const queryInfo = async () => {

  const layoutValue: any = erFormHelper.getAllControlValue('LayoutGroupFilter');
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  layoutValue.MAP_CODE = data.MAP_CODE;
  layoutValue.DATA_RESOURCE_M = data.DATA_RESOURCE_M;
  layoutValue.DATA_RESOURCE_AP = data.DATA_RESOURCE_AP;
  layoutValue.DATA_RESOURCE_P = data.DATA_RESOURCE_P;
  block.pushData(layoutValue, true);
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir29_inq', inInfo, false, true, false, formPartition.value);
  console.log("🚀 ~ queryInfo ~ outInfo:", outInfo)
  erFormHelper.mergeDataToGrid(outInfo.getBlock(0), 'gridView1');
  erFormHelper.messageInfo(`查询完成,共查询到[${outInfo.getBlock(0).data.length}]条数据`)
  erFormHelper.setGridEditable('gridView1', false);

};

//F2查询
const F2_DO = async (e: any) => {
  // 查询最新数据
  await queryInfo();
};

//----------------------------------------------------------弹框事件-----------------------------------
//弹窗的查询
const layoutButtonClick = (e: any) => {
  queryData_grid21();
};
const queryData_grid21 = async () => {
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock("Table0");
  const layoutValue: any =
    erFormHelper.getAllControlValue("LayoutGroupFilter2");
  block.pushData(layoutValue, true);
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService(
    "qmir13_inq",
    inInfo,
    true,
    true
  );
  erFormHelper.setGridEditable("gridView21", false);
  erFormHelper.mergeDataToGrid(outInfo.blocks["Table0"], "gridView21");
};
//  弹出框“确定”事件--获取弹框画面的数据比写入gridView1
const commit = async () => {
  const bd = erFormHelper.getGridSelectRows('gridView21', true);

  console.log("erFormHelper:", bd);
  console.log("🚀 ~ ~ WORK_SEQ_NO:", bd[0].WORK_SEQ_NO);
  // 获取到弹框返回的内容之后进行赋值操作
  erFormHelper.setGridRowData("gridView1", currentRow.value, {
    INSPECT_SEQ_NO: bd[0].WORK_SEQ_NO, //ID
    MAT_CODE: bd[0].MAT_CODE,
    // PROD_UNIT_CODE: bd[0].PROD_UNIT_CODE,
    // INSPECT_TYPE: bd[0].INSPECT_TYPE,
    SAMPLE_POS_CODE: bd[0].SAMPLE_POS_CODE,
  });
  xrEfDialogVisible.value = false;//弹框关闭
};
//------------------------------------------------------------弹窗事件结束----------------------

//F3标准新增确定
const F3_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView1", (): boolean => {
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
  inInfo.addBlock(bd, 'Table0');

  const bd2 = erFormHelper.getGridSelectRowsAsBlock('gridView2');
  inInfo.addBlock(bd2, 'Table1');
  console.log("🚀 ~ G236= ~ inInfo:", inInfo);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir29_ins', inInfo, true, true);

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
  mode = ""
};
//F3标准新增维护
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
      excel: true
    });
  //新增行
  erFormHelper.addRowToGrid('gridView1', true, false);
  btnIsPress.value = true;
  mode = "F3"
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
  erFormHelper.setGridEditable('gridView1', false);
  await queryInfo();
  await queryAnalysis(e.data?.get('INSPECT_PLAN_NO'));
  mode = "";
};

//F4标准修改确认
const F4_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView1", (): boolean => {
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

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir29_upd', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 设置表格列不可编辑
    erFormHelper.setGridEditable('gridView1', false);
    // 查询最新数据
    await queryInfo();
    await queryAnalysis(e.data?.get('INSPECT_PLAN_NO'));
  } else {
    return false;
  }
};
//F4标准修改维护
const F4_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable('gridView1', true);
  btnIsPress.value = true;
  mode = ""
};
//F4标准修改取消
const F4_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView1', false);
  await queryInfo();
  await queryAnalysis(e.data?.get('INSPECT_PLAN_NO'));
};

//F5标准删除确认
const F5_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  // const bd = erFormHelper.getGridSelectRowsAsBlock("gridView1");
  const bd = erFormHelper.getGridSelectRows('gridView1', true);
  for (const b of bd) {
    if (b.PLAN_STATUS != '01') {
      erFormHelper.messageWarning('状态不为编制中，不允许删除');
      return false;
    }
  }
  //inInfo.addBlock(bd, "Table0");
  block.pushData(bd, true);
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir29_del', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
    await queryAnalysis(e.data?.get('INSPECT_PLAN_NO'));
  } else {
    return false;
  }
};
//F5标准删除维护
const F5_PRE_DO = async (e: any) => {

};
//F5标准删除取消
const F5_CANCEL = async (e: any) => {
  // 查询最新数据
  await queryInfo();
  await queryAnalysis(e.data?.get('INSPECT_PLAN_NO'));
};

//F6提交确认
const F6_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd, 'Table0');
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir29_snd', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
    await queryAnalysis(e.data?.get('INSPECT_PLAN_NO'));
  } else {
    return false;
  }
};
//F6提交维护
const F6_PRE_DO = async (e: any) => {
};
//F6提交取消
const F6_CANCEL = async (e: any) => {
  // 查询最新数据
  await queryInfo();
};

//F7撤回确认
const F7_DO = async (e: any) => {

  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd, 'Table0');
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir29_ret', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
    await queryAnalysis(e.data?.get('INSPECT_PLAN_NO'));
  } else {
    return false;
  }
};
//F7撤回维护
const F7_PRE_DO = async (e: any) => {
};
//F7撤回取消
const F7_CANCEL = async (e: any) => {
  // 查询最新数据
  await queryInfo();
};

//F8手工执行确认
const F8_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd, 'Table0');
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir29_time', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo()
  } else {
    return false;
  }
};
//F8手工执行维护
const F8_PRE_DO = async (e: any) => {

};
//F8手工执行取消
const F8_CANCEL = async (e: any) => {
  // 查询最新数据
  await queryInfo()
};

//F9补发确认
const F9_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length != 1) {
    erFormHelper.messageWarning('每次只能选择一条数据');
    return false;
  }
  const layoutValue: any = erFormHelper.getControlValue(
    'LayoutGroupFilter',
    'SAMPLE_TIME,SD_FLAG',
  );
  console.log("🚀 ~ layoutValue:", layoutValue);
  if (layoutValue.SAMPLE_TIME == null) {
    layoutValue.SAMPLE_TIME = ''
  }
  else {
    layoutValue.SAMPLE_TIME = dayjs(layoutValue.SAMPLE_TIME).format("YYYYMMDDHHmmss");
  }
  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  bd.addColumn('SAMPLE_TIME');
  bd.data[0].SAMPLE_TIME = layoutValue.SAMPLE_TIME;
  bd.addColumn('SD_FLAG');
  bd.data[0].SD_FLAG = layoutValue.SD_FLAG;
  console.log('* bd= ', bd);
  inInfo.addBlock(bd);





  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir29_bf', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    erFormHelper.setControlValue('LayoutGroupFilter', 'SD_FLAG', '0');
    erFormHelper.setControlValue('LayoutGroupFilter', 'SAMPLE_TIME', ' ');
    // 查询最新数据
    await queryInfo()

  } else {
    return false;
  }
};
//F9补发维护
const F9_PRE_DO = async (e: any) => {

};
//F9补发取消
const F9_CANCEL = async (e: any) => {
  // 查询最新数据
  erFormHelper.setControlValue('LayoutGroupFilter', 'SD_FLAG', '0');
  erFormHelper.setControlValue('LayoutGroupFilter', 'SAMPLE_TIME', ' ');
  await queryInfo()
};
//F10分析项目确认
const F10_DO = async (e: any) => {
  if (erFormHelper.getGridCheckedRows('gridView1').length != 1) {
    erFormHelper.messageWarning('请勾选一条主计划数据');
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkGridInput('gridView2')) {
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd1 = erFormHelper.getGridCheckedRowsAsBlock('gridView1');
  inInfo.addBlock(bd1, 'Table0');
  const bd2 = erFormHelper.getGridAllRowsAsBlock('gridView2');
  inInfo.addBlock(bd2, 'Table1');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir29_upd1', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');

    // 查询最新数据
    await queryInfo();
    await queryAnalysis(e.data?.get('INSPECT_PLAN_NO'));
    erFormHelper.setGridEditable('gridView', false);
  } else {
    return false;
  }
  erFormHelper.setGridToolbarVisible("gridView2", {
    addrow: false,
    copyrow: false,
    delete: false,
    cancel: false,
    excel: true,
  });
};

//F10分析项目维护
const F10_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable("gridView2", true);
  //显示新增操作工具
  erFormHelper.setGridToolbarVisible("gridView2", {
    addrow: true,
    copyrow: false,
    delete: true,
    cancel: true,
    excel: true,
  });
  mode = "";
};

//F10分析项目维护取消
const F10_CANCEL = async (e: any) => {
  // 查询最新数据
  queryInfo();
  erFormHelper.setGridToolbarVisible("gridView2", {
    addrow: false,
    copyrow: false,
    delete: false,
    cancel: false,
    excel: true,
  });
};

//查询分析项目
const queryAnalysis = async (INSPECT_PLAN_NO: string) => {
  const inInfo = new EI.EIInfo();
  const block = erFormHelper.getGridCurrentRowAsBlock('gridView1');
  block.addColumn('INSPECT_PLAN_NO')
  block.addRow({ INSPECT_PLAN_NO: INSPECT_PLAN_NO })
  const bd = new EI.EiBlock();
  bd.addColumn('QUERY_TYPE')
  bd.addRow({ QUERY_TYPE: 'Q' })
  inInfo.addBlock(block, 'Table0');
  inInfo.addBlock(bd, 'Table1');

  const outInfo = await erFormHelper.callService('qmir29_inq2', inInfo, false, true, false, formPartition.value);
  erFormHelper.mergeDataToGrid(outInfo.getBlock(0), 'gridView2');
  erFormHelper.setGridEditable('gridView2', false);
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
