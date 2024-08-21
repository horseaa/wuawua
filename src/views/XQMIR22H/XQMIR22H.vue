<template>
  <xr-ef-form @ready="efFormReady" :f2-do="F2_DO" :f3-do="F3_DO" :f3-pre-do="F3_PRE_DO" :f3-cancel="F3_CANCEL"
    :f4-do="F4_DO" :f4-pre-do="F4_PRE_DO" :f4-cancel="F4_CANCEL" :f5-do="F5_DO" :f5-pre-do="F5_PRE_DO"
    :f5-cancel="F5_CANCEL" :f7-do="F7_DO" :f7-pre-do="F7_PRE_DO" :f7-cancel="F7_CANCEL" :f8-do="F8_DO"
    :f8-pre-do="F8_PRE_DO" :f8-cancel="F8_CANCEL" :f9-do="F9_DO" :f9-pre-do="F9_PRE_DO" :f9-cancel="F9_CANCEL"
    :f10-do="F10_DO" :f10-pre-do="F10_PRE_DO" :f10-cancel="F10_CANCEL" :f11-do="f11_do" :f11-pre-do="F11_PRE_DO"
    :f11-cancel="F11_CANCEL">
    <template v-if="initializeFlag === 1">
      <er-layout :er-form-helper-prop="erFormHelper" :config-id="'LayoutGroupFilter'"></er-layout>

      <v-splitter style="height: 100%" class="default-theme">
        <v-splitter-pane>


          <v-splitter horizontal style="height: 100%" class="default-theme">

            <v-splitter-pane size="55">
              <div :style="data.divDisable1 ? data.disableStyle : `height:100%`">
                <er-grid @erGridReady="erGrid1Ready" :er-form-helper-prop="erFormHelper" :config-id="'gridView1'"
                  :options="{enableClick:true}" @click="gridView1Click">
                </er-grid>
              </div>
            </v-splitter-pane>

            <v-splitter-pane size="45">


              <xr-ef-panel title="已组汽车信息" padding="0 5px 5px 5px">

                <template #customButtonSlot>
                  <a-button @click="removeBatching" :options="{enableClick:true}" :disabled="data.butDisable1"
                    style="margin: 50px 0 50px 0">移出批次
                  </a-button>
                </template>

                <template #contentSlot>
                  <div style="display: flex; height: 100%;">

                    <div style="display: flex; flex-direction: column; width: 100%;">
                      <div :style="data.divDisable2 ? data.disableStyle : `height:100%`">
                        <er-grid @erGridReady="erGrid1Ready" :er-form-helper-prop="erFormHelper"
                          :config-id="'gridView2'">
                        </er-grid>
                      </div>
                    </div>
                  </div>
                </template>
              </xr-ef-panel>



            </v-splitter-pane>
          </v-splitter>
        </v-splitter-pane>


        <v-splitter-pane>
          <xr-ef-panel title="未组汽车信息" padding="0 5px 5px 5px">
            <template #customButtonSlot>
              <a-button @click="moveBatching" :options="{enableClick:true}" :disabled="data.butDisable2"
                style="margin: 50px 0 50px 0">组入批次
              </a-button>
            </template>
            <template #contentSlot>
              <div style="display: flex; height: 100%;">

                <div style="display: flex; flex-direction: column; width: 100%;">
                  <div style="display: flex; flex-direction: column; height: 100%;">
                    <div style="display: flex; flex-direction: column; width: 100%; height: 10%;">
                      <er-layout :er-form-helper-prop="erFormHelper" :config-id="'LayoutGroupFilter2'"
                        :show-group-border="false" id="layout2"></er-layout>
                    </div>
                    <div style="display: flex; flex-direction: column; width: 100%; height: 100%;">
                      <div :style="data.divDisable3 ? data.disableStyle : `height:100%`">
                        <er-grid @erGridReady="erGrid1Ready" :er-form-helper-prop="erFormHelper"
                          :config-id="'gridView3'">
                        </er-grid>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </xr-ef-panel>

        </v-splitter-pane>

      </v-splitter>

    </template>
  </xr-ef-form>
</template>

<script lang="ts">
import {EI} from 'EIX/ei';
import {ER} from 'ERX/Er';
import erLayout from 'ERX/ErLayout';
import erGrid from "ERX/ErGrid";
import xrEfPanel from "EFX/xrEfPanel";
import xrEfForm from "EFX/xrEfForm";
import {nextTick, onMounted, reactive, ref} from 'vue';
import {Grid} from 'ant-design-vue';
import {ButtonType} from 'ant-design-vue/es/button';
import dayjs from "dayjs";
// 在业务画面 ts 部分引入并进行初始化
import eBFR from "EBFR/eBFR";// 首先在 EFX 中里面引入 EBFR 工具。
export default {
  name: 'XQMIR22H',

};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
const initializeService = 'qmir_form_get';

// 变量定义
const formName = ref('XQMIR22H');
const erFormHelper = new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");

//页面变量
const data: any = reactive({
  grid1: Grid,
  grid2: Grid,
  grid3: Grid,
  //div禁用样式
  disableStyle: {
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0.3,
    height: 100 + '%'
  },
  divDisable1: false,
  divDisable2: false,
  divDisable3: false,
  butDisable1: true,
  butDisable2: true,
  clickData: {}
});
const erGrid1Ready = () => {
  data.grid1 = erFormHelper.getGrid('gridView1');
  data.grid2 = erFormHelper.getGrid('gridView2');
  data.grid3 = erFormHelper.getGrid('gridView3');
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
  const paras = efFormInfo.value;
  if (paras.formParams?.form_name) formName.value = paras.formParams['form_name'];
  if (paras.formParams?.DATA_RESOURCE_M) data.DATA_RESOURCE_M = paras.formParams['DATA_RESOURCE_M'];
  const initialResult = await erFormHelper.Initialize(formPartition.value, formName.value, '', initializeService);
  if (initialResult.flag >= 0) {
    // 画面工具类初始化成功后将画面渲染条件设置为1
    initializeFlag.value = 1;

    // 回调函数获取控件信息及设置定义事件等操作
    nextTick(() => {
      // 获取画面上的主要控件信息
      //LayoutGroupFilter2按钮事件
      const filterBtn1 = erFormHelper.getControl('LayoutGroupFilter2', 'QUERY');
      filterBtn1 && filterBtn1.bind('click', (e: ButtonType) => queryDetailed2());

    });
  } else {
    erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
  }
};

//查询表格数据
const queryInfo = async () => {
  const layoutValue: any = erFormHelper.getAllControlValue('LayoutGroupFilter');
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  layoutValue.DATA_RESOURCE_M = data.DATA_RESOURCE_M
  block.pushData(layoutValue, true);
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir22a_inq', inInfo, false, true, false, formPartition.value);
  console.log("🚀 ~ queryInfo ~ outInfo:", outInfo)
  erFormHelper.mergeDataToGrid(outInfo.getBlock(0), 'gridView1');
  erFormHelper.messageInfo(`查询完成,共查询到[${outInfo.getBlock(0).data.length}]条数据`);
  erFormHelper.setGridEditable('gridView1', false);
};

//F2查询
const F2_DO = async (e: any) => {
  await queryInfo();
  // await queryDetailed2();
  // await queryDetailed(data.clickData);
};

//F3组批新增确定
const F3_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView3", (): boolean => {
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
//获取查询框的取样个数
  const layoutValue: any = erFormHelper.getAllControlValue('LayoutGroupFilter2');
  console.log("🚀 ~ queryInfo ~ layoutValue:", layoutValue);
  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView3');
  bd.addColumn('BACK0');
  bd.data[0].BACK0 = layoutValue.BACK0;
  inInfo.addBlock(bd, 'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22a_ins', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    data.divDisable1 = false;
    data.divDisable2 = false;
    await queryInfo();
    await queryDetailed2();
  } else {
    return false;
  }
  erFormHelper.setControlValue('LayoutGroupFilter2', 'BACK0', "");//清空取样个数
};
//F3组批新增维护
const F3_PRE_DO = async (e: any) => {
  // maskOperate(true,true,false);
  //设置不可编辑
  erFormHelper.setGridEditable('gridView3', false);

};
//F3组批新增取消
const F3_CANCEL = async (e: any) => {
  maskOperate(false, false, false);
  await queryInfo();
  await queryDetailed2();
  erFormHelper.setControlValue('LayoutGroupFilter2', 'BACK0', "");//清空取样个数
};

//移出组批
const removeBatching = async () => {
  if (erFormHelper.getGridSelectRows('gridView2').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView2');
  bd.addColumn('SAMPLE_ENTR_NO');
  bd.data[0].SAMPLE_ENTR_NO = data.clickData.SAMPLE_ENTR_NO
  bd.addColumn('INSPECT_BATCH_NO');
  bd.data[0].INSPECT_BATCH_NO = data.clickData.INSPECT_BATCH_NO
  inInfo.addBlock(bd, 'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22a_del2', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    await queryDetailed(data.clickData);
    await queryDetailed2();
  } else {
    return false;
  }
}


//组入组批
const moveBatching = async () => {
  if (erFormHelper.getGridSelectRows('gridView3').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView3');
  bd.addColumn('SAMPLE_ENTR_NO');
  bd.data[0].SAMPLE_ENTR_NO = data.clickData.SAMPLE_ENTR_NO
  bd.addColumn('INSPECT_BATCH_NO');
  bd.data[0].INSPECT_BATCH_NO = data.clickData.INSPECT_BATCH_NO
  inInfo.addBlock(bd, 'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22a_ins2', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    await queryDetailed2();
    await queryDetailed(data.clickData);
  } else {
    return false;
  }
}

//F4组批调整确定
const F4_DO = async (e: any) => {
  data.butDisable1 = true;
  data.butDisable2 = true;
  await queryInfo();
  await queryDetailed2();
  await queryDetailed(data.clickData);
};
//F4组批调整维护
const F4_PRE_DO = async (e: any) => {
  data.butDisable1 = false;
  data.butDisable2 = false;
};
//F4组批调整取消
const F4_CANCEL = async (e: any) => {
  data.butDisable1 = true;
  data.butDisable2 = true;
  await queryInfo();
  await queryDetailed2();
  await queryDetailed(data.clickData);
};

//F5组批删除确定
const F5_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd, 'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22a_del', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    maskOperate(false, false, false);
    await queryInfo();
    await queryDetailed2();
  } else {
    return false;
  }
};
//F5组批删除维护
const F5_PRE_DO = async (e: any) => {
  maskOperate(false, true, true);
};
//F5组批删除取消
const F5_CANCEL = async (e: any) => {
  maskOperate(false, false, false);
  await queryInfo();
};

//F7组批提交确定
const F7_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  bd.addColumn('DEAL_FLAG');
  bd.data[0].DEAL_FLAG = 'I'
  inInfo.addBlock(bd, 'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22a_upd', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    maskOperate(false, false, false);
    await queryInfo();
  } else {
    return false;
  }
};
//F7组批提交维护
const F7_PRE_DO = async (e: any) => {
  maskOperate(false, true, true);
};
//F7组批提交取消
const F7_CANCEL = async (e: any) => {
  maskOperate(false, false, false);
  await queryInfo();
};

//F8组批收回确定
const F8_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  bd.addColumn('DEAL_FLAG');
  bd.data[0].DEAL_FLAG = 'D'
  inInfo.addBlock(bd, 'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22a_upd', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    maskOperate(false, false, false);
    await queryInfo();
  } else {
    return false;
  }
};
//F8组批收回维护
const F8_PRE_DO = async (e: any) => {
  maskOperate(false, true, true);
};
//F8组批收回取消
const F8_CANCEL = async (e: any) => {
  maskOperate(false, false, false);
  await queryInfo();
};
//F9下发采购确认
const F9_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  bd.addColumn('DEAL_FLAG');
  bd.data[0].DEAL_FLAG = 'I'
  inInfo.addBlock(bd, 'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22a_send', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
  } else {
    return false;
  }
};
//F9下发采购维护
const F9_PRE_DO = async (e: any) => {

};
//F9下发采购取消
const F9_CANCEL = async (e: any) => {
  // 查询最新数据
  await queryInfo();
};
//F10采购收回确认
const F10_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  bd.addColumn('DEAL_FLAG');
  bd.data[0].DEAL_FLAG = 'D'
  inInfo.addBlock(bd, 'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22a_send', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
  } else {
    return false;
  }
};
//F10采购收回维护
const F10_PRE_DO = async (e: any) => {

};
//F10采购收回取消
const F10_CANCEL = async (e: any) => {
  // 查询最新数据
  await queryInfo();
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
const gridView1Click = async (e: any) => {
  console.log('e', e);
  data.clickData = e.data;
  console.log('data.clickData', data.clickData);
  //data.clickData = e.data
  // await queryDetailed({SAMPLE_ENTR_NO:e.data?.get('SAMPLE_ENTR_NO')});
  await queryDetailed({INSPECT_BATCH_NO: e.data?.get('INSPECT_BATCH_NO')});

};

//查询已组汽车信息
const queryDetailed = async (row: any) => {
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  /*  block.addColumn('SAMPLE_ENTR_NO');
    block.addRow({
      SAMPLE_ENTR_NO: row.SAMPLE_ENTR_NO,
    });
    console.log("SAMPLE_ENTR_NO", row.SAMPLE_ENTR_NO);*/
  block.addColumn('INSPECT_BATCH_NO');
  block.addRow({
    INSPECT_BATCH_NO: row.INSPECT_BATCH_NO,
  });
  console.log("INSPECT_BATCH_NO", row.INSPECT_BATCH_NO);
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir22a_inq2', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['Table0'], 'gridView2');
  erFormHelper.setGridEditable('gridView2', false);
}

//查询未组汽车信息
const queryDetailed2 = async () => {
  const layoutValue: any = erFormHelper.getAllControlValue('LayoutGroupFilter2');
  console.log("🚀 ~ 463 ~ layoutValue:", layoutValue)
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  layoutValue.DATA_RESOURCE_M = data.DATA_RESOURCE_M;
  block.pushData(layoutValue, true);
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir22a_inq3', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['Table0'], 'gridView3');
  erFormHelper.messageInfo(`查询完成,共查询到[${outInfo.blocks['Table0'].data.length}]条数据`);
  erFormHelper.setGridEditable('gridView3', false);
}

//遮罩层显示操作(传入各区域遮罩层显示状态)
const maskOperate = (region1Vis: boolean, region2Vis: boolean, region3Vis: boolean) => {
  data.divDisable1 = region1Vis;
  data.divDisable2 = region2Vis;
  data.divDisable3 = region3Vis;
}

onMounted(() => {
  // initializePage();
});
</script>

<style lang="scss">
#layout2  .efpanel-card .noHeaderHeight{
  padding: 0 !important;
}
#layout2 .efpanel-root {
  padding: 0 !important;
}
.efpanel-root {
  height: 100%;
}
</style>

