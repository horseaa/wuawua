<template>
  <xr-ef-form @ready="efFormReady" :f2-do="F2_DO" :f3-do="F3_DO" :f3-pre-do="F3_PRE_DO" :f3-cancel="F3_CANCEL"
    :f4-do="F4_DO" :f4-pre-do="F4_PRE_DO" :f4-cancel="F4_CANCEL" :f5-do="F5_DO" :f5-pre-do="F5_PRE_DO"
    :f5-cancel="F5_CANCEL" :f6-do="F6_DO" :f6-pre-do="F6_PRE_DO" :f6-cancel="F6_CANCEL" :f8-do="F8_DO"
    :f8-pre-do="F8_PRE_DO" :f8-cancel="F8_CANCEL" :f9-do="f9_do" :f9-pre-do="F9_PRE_DO" :f9-cancel="F9_CANCEL"
    :f10-do="f10_do" :f10-pre-do="F10_PRE_DO" :f10-cancel="F10_CANCEL" :f11-do="f11_do" :f11-pre-do="F11_PRE_DO"
    :f11-cancel="F11_CANCEL">
    <template v-if="initializeFlag === 1">
      <er-layout :er-form-helper-prop="erFormHelper" :config-id="'LayoutGroupFilter'"></er-layout>
      <v-splitter style="height: 100%" class="default-theme">
        <v-splitter-pane size="80">
          <xr-ef-form-base>
            <xr-ef-panel title="检验委托数据" padding="0 0 5px 5px">
              <template #customButtonSlot>

              </template>
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
    </template>
  </xr-ef-form>

  <!-- 画面弹框 -->
  <xr-ef-dialog width="1000px" height="500px" v-model:visible="xrEfDialogVisible" title="信息" >
    <XQMIR13POP :openInDialog="true"  :parentInfo="parentInfo" @getChildInfo="getChildInfo"></XQMIR13POP>
  </xr-ef-dialog>
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
import XQMIR13POP from "../XQMIR13POP/XQMIR13POP.vue";
import xrEfDialog from "EFX/xrEfDialog";
import ErPopFree from 'ERX/ErPopFree';
import ErPopQuery from 'ERX/ErPopQuery';
import { PopFreeReturnInfo, PopQueryReturnInfo } from 'ERX/er-type';

// 在业务画面 ts 部分引入并进行初始化
import eBFR from "EBFR/eBFR";

// // 首先在 EFX 中里面引入 EBFR 工具。
// import eBFR from 'EFX/eBFR'


export default {
  name: 'XQMIR270',
  components: { erLayout, erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
const initializeService = 'qmir_form_get';

// 变量定义
const formName = ref('XQMIR27X');
const erFormHelper = new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");

//弹窗画面
const popSTD_ID_Query = new ER.PopQueryHelper(formPartition.value, "XQMIR13POP", "", "qmir_form_get");

// 二、AutoQuery 自动查询，默认值为 fasle
popSTD_ID_Query.AutoQuery = true;
// 三、AutoRefresh 自动刷新，默认值为 fasle
popSTD_ID_Query.AutoRefresh = true;

//#region 弹框相关
// 弹框是否显示
const currentRow = ref();
const xrEfDialogVisible = ref(false);
// 传值1：传递数据到DEMO03-定义属性openInDialog、parentInfo
const openInDialog = ref(true);
const parentInfo = ref();
const btnIsPress = ref(false); // 按钮是否按下

// 获取值：获取子画面的数据-事件参数为传递的数据
const getChildInfo = (e: any) => {
  console.log("e:", e);
  // 结束Grid的编辑状态,否则无法取到最后一个焦点单元格的
  erFormHelper.stopGridEditing("gridView1", (): boolean => {
    return true;
  });
  // 关闭弹框
  xrEfDialogVisible.value = false;
  // 获取到弹框返回的内容之后进行赋值操作
  console.log("🚀 ~ getChildInfo ~ WORK_SEQ_NO:", JSON.parse(JSON.stringify(e.info.data))[0].WORK_SEQ_NO)
  erFormHelper.setGridRowData("gridView1", currentRow.value, {
    BACK1: JSON.parse(JSON.stringify(e.info.data))[0].WORK_SEQ_NO,//ID
    MAT_CODE: JSON.parse(JSON.stringify(e.info.data))[0].MAT_CODE,
    PROD_UNIT_CODE: JSON.parse(JSON.stringify(e.info.data))[0].PROD_UNIT_CODE,
    INSPECT_TYPE: JSON.parse(JSON.stringify(e.info.data))[0].INSPECT_TYPE,
    SAMPLE_POS_CODE: JSON.parse(JSON.stringify(e.info.data))[0].SAMPLE_POS_CODE,
  });
};
//#endregion

//页面变量
const data: any = reactive({
  grid1: Grid,
  grid2: Grid,
  gridToolbar1: [],
  clickData: {},
  DATA_RESOURCE_M: 'ALL',
  DATA_RESOURCE_AP: 'ALL',
  DATA_RESOURCE_P: 'ALL',
})
let mode = ""; // 当前操作的模式：主要用来区分是新增还是删除

const erGrid1Ready = (params: any) => {
  data.grid1 = erFormHelper.getGrid('gridView1');
  data.grid2 = erFormHelper.getGrid('gridView2');
  console.log("params:", params);
  // 绑定自定义事件
  params.api.addEventListener("cellClicked", cellEditEvent);
}
// 单元格编辑事件
const cellEditEvent = async (e: any) => {
  currentRow.value = e.data;
  if (e.column.colId === "BACK1" && btnIsPress.value) {
    //显示画面
    xrEfDialogVisible.value = true;
    // 显示画面
    // ER.PopUtils.showErPopQuery(
    //   ErPopQuery,
    //   popSTD_ID_Query,
    //   (e: PopQueryReturnInfo) => {
    //     // 判断点击的是否是确定按钮，并且是否选中了信息
    //     // e.checkedItem 是选择的当前行的数据，e.checkedItemArray 是返回的勾选行数据，这个根据业务场景自己判断
    //     if (e.dialogResult === "ok" && e.checkedItem) {
    //       // 获取当前行的数据--->用于单选
    //       const checkData = e.checkedItem;
    //       console.log("....checkData", checkData);
    //       console.log("....STD_ID", checkData.WORK_SEQ_NO);
    //       // 结束Grid的编辑状态,否则无法取到最后一个焦点单元格的
    //       erFormHelper.stopGridEditing("gridView1", (): boolean => {
    //         return true;
    //       });
    //       erFormHelper.setGridRowData("gridView1", currentRow.value, {
    //         BACK1: JSON.parse(JSON.stringify(checkData.WORK_SEQ_NO)),

    //         MAT_CODE: JSON.parse(JSON.stringify(checkData.MAT_CODE))

    //       });
    //     }
    //   }
    // );
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

  const paras = efFormInfo.value;
  console.log("🚀 ~ initializePage ~ paras:", paras)
  if (paras.formParams?.form_name) formName.value = paras.formParams['form_name'];
  if (paras.formParams?.DATA_RESOURCE_M) data.DATA_RESOURCE_M = paras.formParams['DATA_RESOURCE_M'];
  if (paras.formParams?.DATA_RESOURCE_AP) data.DATA_RESOURCE_AP = paras.formParams['DATA_RESOURCE_AP'];
  if (paras.formParams?.DATA_RESOURCE_P) data.DATA_RESOURCE_P = paras.formParams['DATA_RESOURCE_P'];


  const initialResult = await erFormHelper.Initialize(formPartition.value, formName.value, '', initializeService);
  console.log("🚀 156~ initializePage ~ formName.value:", formName.value)
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

//查询表格数据
const queryInfo = async () => {
  // erFormHelper.queryDataByDataSource('gridView1', { filterConfigId: 'LayoutGroupFilter' });
  const layoutValue: any = erFormHelper.getAllControlValue('LayoutGroupFilter');
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  layoutValue.INDEX_FROM = 0
  layoutValue.RETURN_NUM = 1000
  layoutValue.MAP_CODE = data.MAP_CODE
  layoutValue.DATA_RESOURCE_M = data.DATA_RESOURCE_M
  layoutValue.DATA_RESOURCE_AP = data.DATA_RESOURCE_AP
  layoutValue.DATA_RESOURCE_P = data.DATA_RESOURCE_P
  block.pushData(layoutValue, true);
  inInfo.addBlock(block);

  const outInfo = await erFormHelper.callService('qmir27a_inq', inInfo, true, true);
  erFormHelper.mergeDataToGrid(outInfo.getBlock(0), 'gridView1');
  erFormHelper.messageInfo(`查询完成,共查询到[${outInfo.getBlock(0).data.length}]条数据`);
  erFormHelper.setGridEditable('gridView1', false);
  erFormHelper.setGridEditable('gridView2', false);

  btnIsPress.value = false;
};

//F2查询
const F2_DO = async (e: any) => {
  queryInfo();

};

//F3新增确定
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
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd, 'Table0');


  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir27_ins', inInfo, true, true);

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
    queryInfo();
  } else {
    return false;
  }
};
//F3新增维护
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
  mode= "F3"
  btnIsPress.value = true;
};
//F3新增取消
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
  queryInfo();
};

//F4修改确认
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
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd, 'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir27_upd', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 设置表格列不可编辑
    erFormHelper.setGridEditable('gridView1', false);
    // 查询最新数据
    queryInfo();
  } else {
    return false;
  }
};
//F4修改维护
const F4_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable('gridView1', true);
  btnIsPress.value = true;//修改标准ID
  mode= ""
};
//F4修改取消
const F4_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView1', false);
  queryInfo();
};

//F5删除确认
const F5_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd, 'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir27_del', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
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
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd, 'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir27_entr', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
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

};

//F8收回确认
const F8_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd, 'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir27_back', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
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

};

const f9_do = async (e: any) => {

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd, 'Table0');
  const outInfo = await erFormHelper.callService('qmir21_iii', inInfo, false, true);


};

const F9_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable('gridView1', true);
};

const F9_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView1', false);
  queryInfo();
};



const f10_do = async (e: any) => {
  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd, 'Table0');
  const outInfo = await erFormHelper.callService('qmir21_ddd', inInfo, false, true);


};

const F10_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable('gridView1', true);
};

const F10_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView1', false);
  queryInfo();
};

const f11_do = async (e: any) => {
  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRows('gridView1');
  for (let b of bd) {

    console.log("🚀 ~ constf11_do= ~ b.SAMPLE_ENTR_NO:", b.SAMPLE_ENTR_NO);
    // 预览XML
    // eBFR.CallReportXLSXFrom('WHWT', '@SAMPLE_ENTR_NO@$$'+b.SAMPLE_ENTR_NO);
    // 预览PDF
    //eBFR.CallReportPDFFrom("WHWT", '@SAMPLE_ENTR_NO@$$' + b.SAMPLE_ENTR_NO);

    const myMap = new Map();
    myMap.set("SAMPLE_ENTR_NO", b.SAMPLE_ENTR_NO);
    eBFR.CallReportPDFFromMap("WHWT", myMap)
    // eBFR.CallReportXLSXFromMap("WHWT", myMap)

  }
};

const F11_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable('gridView1', true);

  console.log("514F11_PRE_DO");
};

const F11_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView1', false);
  queryInfo();
};


//grid1行点击事件
const gridView1FocusChanged = async (e: any) => {
  // 禁用修改非新增行
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

  console.log("🚀 ~ gridView1Click ~ e:", e.data)
  if (e.data?.get('id') === '') {
    return;
  }
  if (e.data?.get('SAMPLE_ENTR_NO') === '') {
    return;
  }
  data.clickData = e.data


  await queryAnalysis(e.data?.get('SAMPLE_ENTR_NO'));
};

//查询分析项目
const queryAnalysis = async (workSeqNo: string) => {
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.addColumn('SAMPLE_ENTR_NO');
  block.addRow({
    SAMPLE_ENTR_NO: workSeqNo
  });
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir27_inq2', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['Table0'], 'gridView2');
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
