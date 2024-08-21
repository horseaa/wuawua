<template>
  <xr-ef-form @ready="efFormReady" :f2-do="F2_DO" :f3-do="F3_DO" :f3-pre-do="F3_PRE_DO" :f3-cancel="F3_CANCEL"
    :f4-do="F4_DO" :f4-pre-do="F4_PRE_DO" :f4-cancel="F4_CANCEL" :f5-do="F5_DO" :f5-pre-do="F5_PRE_DO"
    :f5-cancel="F5_CANCEL" :f6-do="F6_DO" :f6-pre-do="F6_PRE_DO" :f6-cancel="F6_CANCEL" :f7-do="F7_DO"
    :f7-pre-do="F7_PRE_DO" :f7-cancel="F7_CANCEL" :f8-do="F8_DO" :f8-pre-do="F8_PRE_DO" :f8-cancel="F8_CANCEL"
    :f9-do="F9_DO" :f9-pre-do="F9_PRE_DO" :f9-cancel="F9_CANCEL" 
    :f10-do="F10_DO" :f10-pre-do="F10_PRE_DO"
    :f10-cancel="F10_CANCEL" :f11-do="f11_do" :f11-pre-do="F11_PRE_DO" :f11-cancel="F11_CANCEL">
    <template v-if="initializeFlag === 1">
      <er-layout :er-form-helper-prop="erFormHelper" :config-id="'LayoutGroupFilter'"></er-layout>
      <v-splitter style="height: 100%" class="default-theme">
        <v-splitter-pane size="80">
          <xr-ef-form-base>
            <xr-ef-panel title="检验委托数据" padding="0 0 5px 5px">
              <template #customButtonSlot></template>
              <template #contentSlot>
                <er-grid @erGridReady="erGrid1Ready" @focus-changed="gridView1FocusChanged"
                  :er-form-helper-prop="erFormHelper" :toolbar-options="data.gridToolbar1" :config-id="'gridView1'"
                  :options="{ enableClick: true }">
                </er-grid>
              </template>
            </xr-ef-panel>
          </xr-ef-form-base>
        </v-splitter-pane>
        <v-splitter-pane>
          <xr-ef-panel title="要求检验的分析项目" padding="0 5px 5px 0">
            <template #customButtonSlot></template>
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
import { EI } from "EIX/ei";
import { ER } from "ERX/Er";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";
import xrEfPanel from "EFX/xrEfPanel";
import xrEfForm from "EFX/xrEfForm";
import { nextTick, onMounted, reactive, ref } from "vue";
import { Grid } from "ant-design-vue";
import XQMIR13POP from "../XQMIR13POP/XQMIR13POP.vue";
import xrEfDialog from "EFX/xrEfDialog";//引入弹框
import ErPopFree from "ERX/ErPopFree";
import ErPopQuery from "ERX/ErPopQuery";
import { PopFreeReturnInfo, PopQueryReturnInfo } from "ERX/er-type";

// 在业务画面 ts 部分引入并进行初始化
import eBFR from "EBFR/eBFR";// 首先在 EFX 中里面引入 EBFR 工具。
export default {
  name: "XQMIR271",
  components: { erLayout, erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 变量定义
// 获取画面的分区信息及设置画面初始化service

const initializeService = "qmir_form_get";
const formName = ref("XQMIR270");

const formPartition = ref("");
const erFormHelper = new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);

// 弹框是否显示
const currentRow = ref();
const xrEfDialogVisible = ref(false);
const btnIsPress = ref(false); // 按钮是否按下



//页面变量
const data: any = reactive({
  grid1: Grid,
  grid2: Grid,
  gridToolbar1: [],
  clickData: {},
  DATA_RESOURCE_M: "ALL",
  DATA_RESOURCE_AP: "ALL",
  DATA_RESOURCE_P: "ALL",
});

let mode = ""; // 当前操作的模式：主要用来区分是新增还是删除

//eady事件xr-ef-form初始化完成
const efFormReady = (e: any) => {
  efFormInfo.value = e.formInfo;
  efFormIsReady.value = true;
  formPartition.value = efFormInfo.value.formPartition;
  // 初始化低代码工具类
  initializePage();
};
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
      erFormHelper.setControlValue('LayoutGroupFilter2', 'SAMPLE_POS_CODE', data.DATA_RESOURCE_AP+"FC");//YLFC
    }, 0);
  }
};


// 画面相关数据初始化
const initializePage = async () => {
  const paras = efFormInfo.value;
  console.log("🚀 ~ initializePage ~ paras:", paras);
  //获取模板画面参数
  if (paras.formParams?.form_name)
    formName.value = paras.formParams["form_name"];//画面代码
  if (paras.formParams?.DATA_RESOURCE_M)
    data.DATA_RESOURCE_M = paras.formParams["DATA_RESOURCE_M"];//物料类别
  if (paras.formParams?.DATA_RESOURCE_AP)
    data.DATA_RESOURCE_AP = paras.formParams["DATA_RESOURCE_AP"];//取样地点
  if (paras.formParams?.DATA_RESOURCE_P)
    data.DATA_RESOURCE_P = paras.formParams["DATA_RESOURCE_P"];//生产单元

  const initialResult = await erFormHelper.Initialize(
    formPartition.value,
    formName.value,
    "",
    initializeService
  );
  console.log("🚀 156~ initializePage ~ formName.value:", formName.value);
  if (initialResult.flag >= 0) {
    // 画面工具类初始化成功后将画面渲染条件设置为1
    initializeFlag.value = 1;

    erFormHelper.setGridToolbarVisible("gridView1", {
      addrow: false,
      copyrow: false,
      delete: false,
      cancel: false,
      excel: true,
    });

    // 回调函数获取控件信息及设置定义事件等操作
    nextTick(() => {
    });
  } else {
    erFormHelper.messageError(
      "ErFormHelper initialize faild, error msg is [" + initialResult.msg + "]!"
    );
  }
};

//查询--获取模板传入参数
const queryInfo = async () => {
  const layoutValue: any = erFormHelper.getAllControlValue("LayoutGroupFilter");
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock("Table0");
  layoutValue.INDEX_FROM = 0;
  layoutValue.RETURN_NUM = 1000;
  layoutValue.DATA_RESOURCE_M = data.DATA_RESOURCE_M;
  layoutValue.DATA_RESOURCE_AP = data.DATA_RESOURCE_AP;
  layoutValue.DATA_RESOURCE_P = data.DATA_RESOURCE_P;
  block.pushData(layoutValue, true);
  inInfo.addBlock(block);

  const outInfo = await erFormHelper.callService(
    "qmir27a_inq",
    inInfo,
    true,
    true
  );
  erFormHelper.mergeDataToGrid(outInfo.getBlock(0), "gridView1");
  erFormHelper.messageInfo(
    `查询完成,共查询到[${outInfo.getBlock(0).data.length}]条数据`
  );
  erFormHelper.setGridEditable("gridView1", false);
  erFormHelper.setGridEditable("gridView2", false);
};

const F2_DO = async (e: any) => {
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
    BACK1: bd[0].WORK_SEQ_NO, //ID
    MAT_CODE: bd[0].MAT_CODE,
   // PROD_UNIT_CODE: bd[0].PROD_UNIT_CODE,
    INSPECT_TYPE: bd[0].INSPECT_TYPE,
    SAMPLE_POS_CODE: bd[0].SAMPLE_POS_CODE,
  });
  xrEfDialogVisible.value = false;//弹框关闭
};
//------------------------------------------------------------弹窗事件结束----------------------
//F3新增确定
const F3_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView1", (): boolean => {
    return true;
  });
  if (erFormHelper.getGridSelectRows("gridView1").length === 0) {
    erFormHelper.messageWarning("至少选择一条数据");
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkGridInput("gridView1")) {
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock("gridView1");
  inInfo.addBlock(bd, "Table0");

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
    "qmir27_ins",
    inInfo,
    true,
    true
  );

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess("操作成功");
    erFormHelper.setGridToolbarVisible("gridView1", {
      addrow: false,
      copyrow: false,
      delete: false,
      cancel: false,
    });
    // 设置表格列不可编辑
    erFormHelper.setGridEditable("gridView1", false);
    // 查询最新数据
    queryInfo();
  } else {
    return false;
  }
};
//F3新增维护
const F3_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable("gridView1", true);
  //显示新增操作工具
  erFormHelper.setGridToolbarVisible("gridView1", {
    addrow: true,
    copyrow: true,
    delete: true,
    cancel: true,
    excel: true,
  });
  //新增行
  erFormHelper.addRowToGrid("gridView1", true, false);
  mode = "F3";
  btnIsPress.value = true;
};
//F3新增取消
const F3_CANCEL = async (e: any) => {
  erFormHelper.setGridToolbarVisible("gridView1", {
    addrow: false,
    copyrow: false,
    delete: false,
    cancel: false,
  });
  // 设置表格列不可编辑
  erFormHelper.setGridEditable("gridView1", false);
  queryInfo();
    mode = "";
};

//F4修改确认
const F4_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView1", (): boolean => {
    return true;
  });

  if (erFormHelper.getGridSelectRows("gridView1").length === 0) {
    erFormHelper.messageWarning("至少选择一条数据");
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkGridInput("gridView1")) {
    return false;
  }

  const inInfo = new EI.EIInfo();
 // const bd = erFormHelper.getGridSelectRowsAsBlock("gridView1");
  //inInfo.addBlock(bd, "Table0");
  const block = new EI.EiBlock('Table0');
  // const bd = erFormHelper.getGridSelectRowsAsBlock("gridView1");
  const bd = erFormHelper.getGridSelectRows('gridView1', true);
  for (const b of bd) {
    if (b.DATA_STATUS != '00') {
      erFormHelper.messageWarning('状态不为编制中，不允许修改');
      return false;
    }
  }
  //inInfo.addBlock(bd, "Table0");
  block.pushData(bd, true);
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
    "qmir27_upd",
    inInfo,
    true,
    true
  );

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess("操作成功");
    erFormHelper.setGridEditable("gridView1", false);
    // 查询最新数据
    queryInfo();
  } else {
    return false;
  }
};
//F4修改维护
const F4_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable("gridView1", true);
  btnIsPress.value = true; //
  mode = "";
};
//F4修改取消
const F4_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable("gridView1", false);
  queryInfo();
};

//F5删除确认
const F5_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows("gridView1").length === 0) {
    erFormHelper.messageWarning("至少选择一条数据");
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
 // const bd = erFormHelper.getGridSelectRowsAsBlock("gridView1");
  const bd = erFormHelper.getGridSelectRows('gridView1', true);
  for (const b of bd) {
    if (b.DATA_STATUS != '00'){
      erFormHelper.messageWarning('状态不为编制中，不允许删除');
      return false;
    }
  }
  //inInfo.addBlock(bd, "Table0");
  block.pushData(bd,true);
  inInfo.addBlock(block);
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
    "qmir27_del",
    inInfo,
    true,
    true
  );

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess("操作成功");
    // 查询最新数据
    queryInfo();
  } else {
    return false;
  }
};
//F5删除维护
const F5_PRE_DO = async (e: any) => {
};
//F5删除取消
const F5_CANCEL = async (e: any) => {
  queryInfo();
};

//F6试样委托确认
const F6_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows("gridView1").length === 0) {
    erFormHelper.messageWarning("至少选择一条数据");
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock("gridView1");
  inInfo.addBlock(bd, "Table0");

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
    "qmir27_entr",
    inInfo,
    true,
    true
  );

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess("操作成功");
    // 查询最新数据
    queryInfo();
  } else {
    return false;
  }
};
//F6试样委托维护
const F6_PRE_DO = async (e: any) => {
};
//F6试样委托取消
const F6_CANCEL = async (e: any) => {
  // 查询最新数据
  queryInfo();
};
//F7分析项目确认
const F7_DO = async (e: any) => {
  if (erFormHelper.getGridCheckedRows('gridView1').length === 0) {
    erFormHelper.messageWarning('请先勾选一条检验委托数据');
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
  const outInfo = await erFormHelper.callService('qmir27_upd1', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');

    // 查询最新数据
    await queryInfo();
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

//F7分析项目维护
const F7_PRE_DO = async (e: any) => {
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

//F7分析项目维护取消
const F7_CANCEL = async (e: any) => {
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
//F9项目增确认
const F9_DO = async (e: any) => {
  if (erFormHelper.getGridCheckedRows('gridView1').length === 0) {
    erFormHelper.messageWarning('请先勾选一条检验委托数据');
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkGridInput('gridView2')) {
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView2');
  const block = new EI.EiBlock('Table1');
  block.addColumn('INSPECT_BATCH_NO')
  block.addRow({ INSPECT_BATCH_NO: data.clickData.INSPECT_BATCH_NO })
  inInfo.addBlock(bd, 'Table0');
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir27_ins1', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');

    // 查询最新数据
    await queryInfo();
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

//F9项目增维护
const F9_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable("gridView2", true);
  //新增行
  erFormHelper.addRowToGrid('gridView2', true, false);
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

//F9项目增取消
const F9_CANCEL = async (e: any) => {
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

//F10项目删确认
const F10_DO = async (e: any) => {
  if (erFormHelper.getGridCheckedRows('gridView1').length === 0) {
    erFormHelper.messageWarning('请先勾选一条检验委托数据');
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkGridInput('gridView2')) {
    return false;
  }
  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView2');
  const block = new EI.EiBlock('Table1');
  block.addColumn('INSPECT_BATCH_NO')
  block.addRow({ INSPECT_BATCH_NO: data.clickData.INSPECT_BATCH_NO })
  inInfo.addBlock(bd, 'Table0');
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir27_del1', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');

    // 查询最新数据
    await queryInfo();
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

//F10项目删维护
const F10_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable("gridView2", true);
  //显示新增操作工具
  erFormHelper.setGridToolbarVisible("gridView2", {
    addrow: false,
    copyrow: false,
    delete: false,
    cancel: false,
    excel: true,
  });
  mode = "";
};

//F10项目删取消
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
//F8收回确认
const F8_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows("gridView1").length === 0) {
    erFormHelper.messageWarning("至少选择一条数据");
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock("gridView1");
  inInfo.addBlock(bd, "Table0");

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
    "qmir27_back",
    inInfo,
    true,
    true
  );

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess("操作成功");
    // 查询最新数据
    queryInfo();
  } else {
    return false;
  }
};
//F8收回维护
const F8_PRE_DO = async (e: any) => {
};
//F8收回取消
const F8_CANCEL = async (e: any) => {
  // 查询最新数据
  queryInfo();
};



const f11_do = async (e: any) => {
  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRows("gridView1");
  for (let b of bd) {
    console.log("🚀 ~ constf11_do= ~ b.SAMPLE_ENTR_NO:", b.SAMPLE_ENTR_NO);
    const myMap = new Map();
    myMap.set("SAMPLE_ENTR_NO", b.SAMPLE_ENTR_NO);
    eBFR.CallReportPDFFromMap("WHWT", myMap);
  }
};

const F11_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable("gridView1", true);

  console.log("514F11_PRE_DO");
};

const F11_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable("gridView1", false);
  queryInfo();
};

//grid1行点击事件
const gridView1FocusChanged = async (e: any) => {
  // 禁用修改非新增行
  if (e) {
    if (e.rowChanged && e.data && mode == "F3") {
      // 判断是否是新增行
      if (e.data.isNew === true) {
        erFormHelper.setGridEditable("gridView1", true);
      } else {
        erFormHelper.setGridEditable("gridView1", false);
      }
    }
  }

  console.log("🚀 ~ gridView1Click ~ e:", e.data);
  if (e.data?.get("id") === "") {
    return;
  }
  if (e.data?.get("SAMPLE_ENTR_NO") === "") {
    return;
  }
  data.clickData = e.data;
  await queryAnalysis(e.data?.get("SAMPLE_ENTR_NO"));
};

//查询分析项目
const queryAnalysis = async (workSeqNo: string) => {
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock("Table0");
  block.addColumn("SAMPLE_ENTR_NO");
  block.addRow({
    SAMPLE_ENTR_NO: workSeqNo,
  });
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService(
    "qmir27_inq2",
    inInfo,
    false,
    true
  );
  erFormHelper.mergeDataToGrid(outInfo.blocks["Table0"], "gridView2");
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
