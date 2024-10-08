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
    :f9-do="F9_DO"
    :f9-pre-do="F9_PRE_DO"
    :f9-cancel="F9_CANCEL"
    :f12-do="F12_DO"
    :f12-pre-do="F12_PRE_DO"
    :f12-cancel="F12_CANCEL"
  >
    <template v-if="initializeFlag === 1">
      <er-layout
        v-show="!data.yyDis"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"
      ></er-layout>
      <er-layout
        v-show="data.yyDis"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter2'"
      ></er-layout>
      <a-tabs v-model:activeKey="tabActiveKey" type="card" @change="changeTab">
        <a-tab-pane key="tab1" tab="质量数据">
          <er-grid
            @erGridReady="erGrid1Ready"
            :er-form-helper-prop="erFormHelper"
            :config-id="'gridView1'"
            @focus-changed="gridView1FocusChanged"
            :options="{ enableClick: true }"
          >
          </er-grid>
        </a-tab-pane>
        <a-tab-pane
          v-if="data.trainDis"
          v-show="data.trainTabDis"
          key="tab2"
          tab="车次清单"
        >
          <er-grid
            @erGridReady="erGrid2Ready"
            :er-form-helper-prop="erFormHelper"
            :config-id="'gridView2'"
          >
          </er-grid>
        </a-tab-pane>
        <a-tab-pane v-show="data.abnormalDis" key="tab3" tab="判定异常数据">
          <er-grid
            @erGridReady="erGrid2Ready"
            :er-form-helper-prop="erFormHelper"
            :config-id="'gridView3'"
          >
          </er-grid>
        </a-tab-pane>
      </a-tabs>
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
import { Logger } from "@ag-grid-community/core";

export default {
  name: "XQMIR21DT",
  components: { erLayout, erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
const initializeService = "gcir_formload";

// 变量定义
const formName = ref("XQMIR21DT");
const erFormHelper = new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");
const tabActiveKey = ref("tab1"); //默认显示的标签

//页面变量
const data: any = reactive({
  grid1: Grid,
  grid2: Grid,
  grid3: Grid,
  grid1EditDis: false,
  gridToolbar1: [],
  compareField: [],
  trainDis: true,
  abnormalDis: true,
  trainTabDis: true,
  gridOptions: {},
  gridKey: "1",
  yyDis: false,
  determineDs: [],
  clickData: null,
  DATA_RESOURCE_M: "ALL",
  DATA_RESOURCE_AP: "ALL",
  TYPE: "ALL",
  DATA_RESOURCE_P: "ALL",
  DATA_RESOURCE_TL: "ALL",
  MAP_CODE: "QMIR21",
});

//---------------------标红-----监听数据改变执行------------------------------------
let ANALYSE_ITEM_ARRAY: any = []; // 去重后的项目
const erGrid1Ready = (e: any) => {
  data.grid1 = e.api;
  erFormHelper.setGridEditable("gridView1", false);
  const gridApi = e.api;
  gridApi.addEventListener("firstDataRendered", (e: any) => {
    console.log("e", e);
    e.columnApi.getColumns()?.forEach((column: any) => {
      if (ANALYSE_ITEM_ARRAY.includes(column.colId)) {
        column.getColDef().cellStyle = (params: any) => {
          if (params.value && typeof params.value === "string") {
            return { backgroundColor: "red" };
          } else {
            return null;
          }
        };
      }
    });
    gridApi.redrawRows();
  });
};

let mode = ""; // 当前操作的模式：主要用来区分是新增还是删除
//对比数据
const contrastData = ref<any>([]);
const erGrid2Ready = () => {
  data.grid2 = erFormHelper.getGrid("gridView2");
  data.grid3 = erFormHelper.getGrid("gridView3");
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
  if (paras.formParams?.form_name)
    formName.value = paras.formParams["form_name"];
  if (paras.formParams?.MAP_CODE) data.MAP_CODE = paras.formParams["MAP_CODE"];
  if (paras.formParams?.TYPE) data.TYPE = paras.formParams["TYPE"];
  if (paras.formParams?.DATA_RESOURCE_M)
    data.DATA_RESOURCE_M = paras.formParams["DATA_RESOURCE_M"];
  if (paras.formParams?.DATA_RESOURCE_AP)
    data.DATA_RESOURCE_AP = paras.formParams["DATA_RESOURCE_AP"];
  if (paras.formParams?.DATA_RESOURCE_P)
    data.DATA_RESOURCE_P = paras.formParams["DATA_RESOURCE_P"];
  if (paras.formParams?.DATA_RESOURCE_TL)
    data.DATA_RESOURCE_TL = paras.formParams["DATA_RESOURCE_TL"];
  //--通用画面，暂时全部显示
  if (data.TYPE !== "进厂") {
    data.trainDis = false;
  }
  const initialResult = await erFormHelper.Initialize(
    formPartition.value,
    formName.value,
    "",
    initializeService
  );
  if (initialResult.flag >= 0) {
    // 画面工具类初始化成功后将画面渲染条件设置为1
    initializeFlag.value = 1;
    nextTick(async () => {
      if (data.trainDis) {
        erFormHelper.setGridEditable("gridView2", false);
      }
      // 获取画面上的主要控件信息
      erFormHelper.setGridEditable("gridView3", false);
      setTimeout(() => {
        //查询要添加的分析项目列
        // queryAnalysisPro();
      }, 500);
    });
  } else {
    erFormHelper.messageError(
      "ErFormHelper initialize faild, error msg is [" + initialResult.msg + "]!"
    );
  }
};
// 数据处理
const handleData = (data: any) => {
  const analysisData = data;
  ANALYSE_ITEM_ARRAY = [];
  const SAMPLE_NO_ARRAY: any = []; //去重后的计量申请号
  const filterArr: any = []; // 去除后的数据
  let customColumns: any = []; //所有列
  analysisData.forEach((item: any) => {
    // ==========================设置列id 根据id分组==========================================================
    const QID = item.ANALYSE_ITEM_CODE.toUpperCase();
    const myField = `Q${QID}`; //分析项目Q+code
    // ======================================================================================================
    if (item.SAMPLE_NO && !SAMPLE_NO_ARRAY.includes(item.SAMPLE_NO)) {
      SAMPLE_NO_ARRAY.push(item.SAMPLE_NO);
      filterArr.push(item);
    }
    // ===========================处理数据 filterArr即显示在页面上的数据 ====================================================
    filterArr.forEach((filterItem: any) => {
      if (item.SAMPLE_NO && filterItem.SAMPLE_NO === item.SAMPLE_NO) {
        if (item.Q25_COUNT !== 0) {
          contrastData.value.push({
            SAMPLE_NO: filterItem.SAMPLE_NO,
            field: myField,
            fieldValue: item["ANALYSIS_VALUE"],
          });
          //   Q25_COUNT!==0标红
          filterItem[myField] = `${item["ANALYSIS_VALUE"]}`;
        } else {
          filterItem[myField] = +item["ANALYSIS_VALUE"];
        }
      }
    });
    // =======================设置列名  customColumns即动态列==========================================
    if (!ANALYSE_ITEM_ARRAY.includes(myField) && item.ANALYSE_ITEM_DESC) {
      ANALYSE_ITEM_ARRAY.push(myField);
      const customColumn = {
        headerName: item.ANALYSE_ITEM_DESC,
        field: myField,
        width: 100, //列的宽度
        hidden: false, //列是否隐藏
        sortable: true,
        type: "value",
      };
      erFormHelper.addGridColumn("gridView1", customColumn);
      customColumns.push(customColumn);
    }
  });
  // ============================第一行数据处理  无值的设为空字符串====================================
  let firstRowData = filterArr[0];
  let newArray = customColumns.map((item: any) => item.colId);
  newArray.forEach((property: any) => {
    if (!(property in firstRowData)) {
      firstRowData[property] = "";
    }
  });
  erFormHelper.mergeDataToGrid(filterArr, "gridView1", true);
};
//查询
//================================查询质量信息（动态展示列名）=======================================
const queryInfo = async () => {
  //0Z画面维护的分析项目
  const inInfoZ = new EI.EIInfo();
  const blockZ = new EI.EiBlock("Table0");
  blockZ.addColumn("FORM_CODE");
  blockZ.addRow({ FORM_CODE: data.MAP_CODE });
  inInfoZ.addBlock(blockZ);
  const outInfoZ = await erFormHelper.callService(
    "qmir21_inq0",
    inInfoZ,
    true,
    true
  );
  const analysisDataZ = outInfoZ.blocks["Table0"].data;

  //21表查询出来的分析项目
  const layoutValue: any = erFormHelper.getAllControlValue("LayoutGroupFilter");
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock("Table0");
  layoutValue.INDEX_FROM = 0;
  layoutValue.RETURN_NUM = 1000;
  layoutValue.MAP_CODE = data.MAP_CODE;
  //都为默认值 ALL
  layoutValue.DATA_RESOURCE_M = data.DATA_RESOURCE_M;
  layoutValue.DATA_RESOURCE_AP = data.DATA_RESOURCE_AP;
  layoutValue.DATA_RESOURCE_P = data.DATA_RESOURCE_P;
  layoutValue.DATA_RESOURCE_TL = data.DATA_RESOURCE_TL;
  block.pushData(layoutValue, true);
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService(
    "qmir21_inq",
    inInfo,
    true,
    true
  );
  const analysisDataD: any = outInfo.blocks["Table0"].data;
  //所有的分析项目数据=0z+qmir21_inq
  const dataRes: any = analysisDataZ.concat(analysisDataD);
  console.log("🚀 查询到的原始数据:", dataRes);
  if (analysisDataD.length > 0) {
    handleData(dataRes);
  } else {
    erFormHelper.messageSuccess("未查询到数据");
  }
};

//F2查询
const F2_DO = async (e: any) => {
  //获取标签卡组件对象
  const tabs = tabActiveKey.value;
  console.log("tabs", tabs);
  if (tabs == "tab1") {
    await queryInfo();
  }
  if (tabs == "tab2") {
    if (!data.clickData) {
      erFormHelper.messageWarning("试样号不能为空!");
      return;
    }
    const total = await queryTrain();
    erFormHelper.messageInfo(`查询完成,共查询到[${total}]条数据`);
  }
  if (tabs == "tab3") {
    if (!data.clickData) {
      erFormHelper.messageWarning("试样号不能为空!");
      return;
    }
    const total = await queryAbnormal();
    erFormHelper.messageInfo(`查询完成,共查询到[${total}]条数据`);
  }
};

//F3新增确认
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
  const block = new EI.EiBlock("Table0");
  const bd = erFormHelper.getGridSelectRows("gridView1", true, false);

  //数据对象的所有属性名称
  const keys = Object.keys(bd[0]);
  //添加页面号&&根据字段对照表处理数据
  for (let b of bd) {
    b.MAP_CODE = data.MAP_CODE;
    //遍历字段对照表
    for (const cf of data.compareField) {
      //判断keys中是否包含当前字段对照对象的fieldCode
      if (keys.includes(cf.fieldCode)) {
        if (cf.fieldType == "number" && b[cf.fieldCode] == null) {
          b[cf.fieldCode] = -9999;
        }
        //在原数据对象中添加属性,key为字段对照对象fieldDesc value是根据字段对照对象的fieldCode取原数据对象的值
        b[cf.fieldDesc] = b[cf.fieldCode];
        //最后删除原数据对象原来的属性
        delete b[cf.fieldCode];
      }
    }
  }
  block.pushData(bd, true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
    "qmir21_ins",
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
    if (data.TYPE == "进厂") {
      data.trainTabDis = !data.trainTabDis;
    }
    data.abnormalDis = !data.abnormalDis;
    // 查询最新数据
    await queryInfo();
  } else {
    return false;
  }
};
//F3新增维护
const F3_PRE_DO = async (e: any) => {
  if (data.TYPE == "进厂") {
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  //erFormHelper.setKendoTabStripSelectFirst(tabRef.value.kendoWidget())
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
  //设置可编辑
  erFormHelper.setGridEditable("gridView1", true);
  mode = "F3";
};
//F3新增取消
const F3_CANCEL = async (e: any) => {
  if (data.TYPE == "进厂") {
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  //显示新增操作工具
  erFormHelper.setGridToolbarVisible("gridView1", {
    addrow: false,
    copyrow: false,
    delete: false,
    cancel: false,
    excel: true,
  });
  await queryInfo();
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
  const block = new EI.EiBlock("Table0");
  const bd = erFormHelper.getGridSelectRows("gridView1", true);

  //数据对象的所有属性名称
  const keys = Object.keys(bd[0]);
  //添加页面号&&根据字段对照表处理数据
  for (let b of bd) {
    b.MAP_CODE = data.MAP_CODE;
    //遍历字段对照表
    for (const cf of data.compareField) {
      //判断keys中是否包含当前字段对照对象的fieldCode
      if (keys.includes(cf.fieldCode)) {
        if (cf.fieldType == "number" && b[cf.fieldCode] == null) {
          b[cf.fieldCode] = -9999;
        }
        //在原数据对象中添加属性,key为字段对照对象fieldDesc value是根据字段对照对象的fieldCode取原数据对象的值
        b[cf.fieldDesc] = b[cf.fieldCode];
        //最后删除原数据对象原来的属性
        delete b[cf.fieldCode];
      }
    }
  }
  block.pushData(bd, true);
  inInfo.addBlock(block);

  // 调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
    "qmir21_upd",
    inInfo,
    true,
    true
  );
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess("操作成功");
    if (data.TYPE == "进厂") {
      data.trainTabDis = !data.trainTabDis;
    }
    data.abnormalDis = !data.abnormalDis;
    // 查询最新数据
    await queryInfo();
    data.grid1EditDis = false;
  } else {
    return false;
  }
};
//F4修改维护
const F4_PRE_DO = async (e: any) => {
  if (data.TYPE == "进厂") {
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  // erFormHelper.setKendoTabStripSelectFirst(tabRef.value.kendoWidget());
  data.grid1EditDis = true;
  //设置可编辑
  erFormHelper.setGridEditable("gridView1", true);
  mode = "";
};
//F4修改取消
const F4_CANCEL = async (e: any) => {
  if (data.TYPE == "进厂") {
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  await queryInfo();
  data.grid1EditDis = false;
};
//F5删除确认
const F5_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows("gridView1").length === 0) {
    erFormHelper.messageWarning("至少选择一条数据");
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock("Table0");
  const bd = erFormHelper.getGridSelectRows("gridView1", true);

  //数据对象的所有属性名称
  const keys = Object.keys(bd[0]);
  //添加页面号&&根据字段对照表处理数据
  for (let b of bd) {
    //遍历字段对照表
    for (const cf of data.compareField) {
      //判断keys中是否包含当前字段对照对象的fieldCode
      if (keys.includes(cf.fieldCode)) {
        //在原数据对象中添加属性,key为字段对照对象fieldDesc value是根据字段对照对象的fieldCode取原数据对象的值
        b[cf.fieldDesc] = b[cf.fieldCode];
        //最后删除原数据对象原来的属性
        delete b[cf.fieldCode];
      }
    }
  }

  block.pushData(bd, true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
    "qmir21_del",
    inInfo,
    true,
    true
  );
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess("操作成功");
    if (data.TYPE == "进厂") {
      data.trainTabDis = !data.trainTabDis;
    }
    data.abnormalDis = !data.abnormalDis;
    // 查询最新数据
    await queryInfo();
  } else {
    return false;
  }
};
//F5删除维护
const F5_PRE_DO = async (e: any) => {
  if (data.TYPE == "进厂") {
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  //erFormHelper.setKendoTabStripSelectFirst(tabRef.value.kendoWidget())
};
//F5删除取消
const F5_CANCEL = async (e: any) => {
  if (data.TYPE == "进厂") {
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  await queryInfo();
};
//F6质量判定确认
const F6_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows("gridView1").length === 0) {
    erFormHelper.messageWarning("至少选择一条数据");
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock("Table0");
  const bd = erFormHelper.getGridSelectRows("gridView1", true);
  block.pushData(bd, true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
    "qmir21_pd",
    inInfo,
    true,
    true
  );
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess("操作成功");
    // 查询最新数据
    await queryInfo();
  } else {
    return false;
  }
};
//F6质量判定维护
const F6_PRE_DO = async (e: any) => {};
//F6质量判定取消
const F6_CANCEL = async (e: any) => {
  await queryInfo();
};
//F12质量异议确认
const F12_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView1", (): boolean => {
    return true;
  });
  if (erFormHelper.getGridSelectRows("gridView1").length != 1) {
    erFormHelper.messageWarning(
      "质量异议要求选择且仅能一条数据,请检查选择数据!"
    );
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkRequiredInput("LayoutGroupFilter2")) {
    erFormHelper.messageWarning(
      "质量异议原因及备注不可以为空！请填写后再提交!"
    );
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock("Table0");
  const bd = erFormHelper.getGridSelectRows("gridView1", true);

  //数据对象的所有属性名称
  const keys = Object.keys(bd[0]);
  //添加质量异议
  for (let b of bd) {
    b.RMA_DESCRIPTION = erFormHelper.getControlValue(
      "LayoutGroupFilter2",
      "RMA_DESCRIPTION"
    );
    //遍历字段对照表
    for (const cf of data.compareField) {
      //判断keys中是否包含当前字段对照对象的fieldCode
      if (keys.includes(cf.fieldCode)) {
        //在原数据对象中添加属性,key为字段对照对象fieldDesc value是根据字段对照对象的fieldCode取原数据对象的值
        b[cf.fieldDesc] = b[cf.fieldCode];
        //最后删除原数据对象原来的属性
        delete b[cf.fieldCode];
      }
    }
    await queryInfo();
  }

  block.pushData(bd, true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
    "qmir21_yy",
    inInfo,
    true,
    true
  );
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess("操作成功");
    if (data.TYPE == "进厂") {
      data.trainTabDis = !data.trainTabDis;
    }
    data.abnormalDis = !data.abnormalDis;
    data.yyDis = false;
  } else {
    return false;
  }
};
//F12质量异议维护
const F12_PRE_DO = async (e: any) => {
  if (data.TYPE == "进厂") {
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  data.yyDis = true;
  erFormHelper.setControlValue("LayoutGroupFilter2", "RMA_DESCRIPTION", ""); //清空质量异议内容
};
//F12质量异议取消
const F12_CANCEL = async (e: any) => {
  if (data.TYPE == "进厂") {
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  data.yyDis = false;
  await queryInfo();
};
//切换标签时主动调查询
const changeTab = (key: any) => {
  console.log("changeTab进来了", key);
  if (key == "tab2") {
    queryTrain();
  } else if (key == "tab3") {
    queryAbnormal();
  }
};
//grid1焦点行事件
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
  data.clickData = e.data;
  console.log("🚀 ~ gridView1Click ~ e:", e.data);
  if (e.data?.get("id") === "") {
    return;
  }
  if (e.data?.get("INSPECT_BATCH_NO") === "") {
    return;
  }
  if (data.TYPE == "进厂") {
    await queryTrain();
  }
  await queryAbnormal();
};

//查询车次清单
const queryTrain = async () => {
  console.log("执行了queryTrain", 1);
  console.log("data.clickData", data.clickData);
  if (!data.clickData) {
    erFormHelper.mergeDataToGrid([], "gridView2");
    return;
  }
  console.log("执行了queryTrain", 2);
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock("Table0");
  block.addColumn("INSPECT_BATCH_NO");
  block.addRow({ INSPECT_BATCH_NO: data.clickData.INSPECT_BATCH_NO }); //批次号--暂定根据批次号查询
  inInfo.addBlock(block);

  const outInfo = await erFormHelper.callService(
    "qmir21_inq2",
    inInfo,
    true,
    true
  );
  console.log("执行了queryTrain结果", outInfo);
  erFormHelper.mergeDataToGrid(outInfo.blocks["Table0"], "gridView2");
  return outInfo.blocks["Table0"].data.length;
};

//查询判定异常数据
const queryAbnormal = async () => {
  if (!data.clickData) {
    erFormHelper.mergeDataToGrid([], "gridView3");
    return;
  }
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock("Table0");
  block.addColumn("SAMPLE_NO");
  block.addRow({ SAMPLE_NO: data.clickData.SAMPLE_NO });
  inInfo.addBlock(block);

  const outInfo = await erFormHelper.callService(
    "qmir21_inq1",
    inInfo,
    true,
    true
  );
  erFormHelper.mergeDataToGrid(outInfo.blocks["Table0"], "gridView3");
  return outInfo.blocks["Table0"].data.length;
};
//F9复样/增样--确认
const F9_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows("gridView1").length === 0) {
    erFormHelper.messageWarning("至少选择一条数据");
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock("gridView1");
  inInfo.addBlock(bd, "Table0");
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
    "qmir27_fy",
    inInfo,
    true,
    true
  );
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess("操作成功");
  } else {
    return false;
  }
  // 查询最新数据
  queryInfo();
};
//F9复样/增样--维护
const F9_PRE_DO = async (e: any) => {};
//F9复样/增样--取消
const F9_CANCEL = async (e: any) => {
  // 查询最新数据
  await queryInfo();
};

onMounted(() => {
  // initializePage();
});
</script>

<style lang="scss">
.efpanel-root {
  height: 100%;
}
</style>import { Grid } from 'ant-design-vue';

