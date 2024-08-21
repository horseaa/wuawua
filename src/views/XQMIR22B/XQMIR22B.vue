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
              :f8-cancel="F8_CANCEL">
    <template v-if="initializeFlag === 1">
    <er-layout 
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'LayoutGroupFilter'"></er-layout>
      <v-splitter horizontal style="height: 100%" class="default-theme">
        <v-splitter-pane>
              <er-grid 
                          @erGridReady="erGrid1Ready"
                          :er-form-helper-prop="erFormHelper"
                          :config-id="'gridView1'"
                          :options="{enableClick:true}"
                          @click="gridView1Click">
              </er-grid>
        </v-splitter-pane>
        <v-splitter-pane>
            <xr-ef-panel title="已组汽车信息"
                        padding="0 5px 5px 5px">
              <template #customButtonSlot>

              </template>
              <template #contentSlot>
                <div style="display: flex; height: 100%;">
                  <div style="display: flex; flex-direction: column; width: 6%;">
                    <xr-ef-panel title="标题"
                                padding="0 5px 0 0"
                                :show-header="false">
                      <template #customButtonSlot>

                      </template>
                      <template #contentSlot>
                        <kendo-button :disabled="data.butDisable1"
                                      @click="removeBatching"
                                      :options="{enableClick:true}"
                                      style="margin: 50px 0 50px 0">
                          移出批次
                        </kendo-button>
                      </template>
                    </xr-ef-panel>
                  </div>
                  <div style="display: flex; flex-direction: column; width: 94%;">
                    <div :style="data.divDisable2 ? data.disableStyle : `height:100%`">
                      <er-grid 
                                @erGridReady="erGrid1Ready"
                                :er-form-helper-prop="erFormHelper"
                                :config-id="'gridView2'">
                      </er-grid>
                    </div>
                  </div>
                </div>
              </template>
            </xr-ef-panel>
        </v-splitter-pane>
        <v-splitter-pane>
            <xr-ef-panel title="未组汽车信息"
                        padding="0 5px 5px 5px">
              <template #customButtonSlot>
    <!--            <kendo-button icon="" @click="queryDetailed2">查询</kendo-button>-->
              </template>
              <template #contentSlot>
                <div style="display: flex; height: 100%;">
                  <div style="display: flex; flex-direction: column; width: 6%;">
                    <xr-ef-panel title="标题"
                                padding="0 5px 0 0"
                                :show-header="false">
                      <template #customButtonSlot>

                      </template>
                      <template #contentSlot>
                        <kendo-button :disabled="data.butDisable2"
                                      @click="moveBatching"
                                      :options="{enableClick:true}"
                                      style="margin: 50px 0 50px 0">
                          组入批次
                        </kendo-button>
                      </template>
                    </xr-ef-panel>
                  </div>
                  <div style="display: flex; flex-direction: column; width: 94%;">
                    <div style="display: flex; flex-direction: column; height: 100%;">
                      <div style="display: flex; flex-direction: column; width: 100%; height: 20%;">
                        <er-layout 
                                      @erGridReady="erGrid1Ready"
                                      :er-form-helper-prop="erFormHelper"
                                      :config-id="'LayoutGroupFilter2'"
                                      :show-group-border="false"
                                      id="layout2"
                        ></er-layout>
                      </div>
                      <div style="display: flex; flex-direction: column; width: 100%; height: 80%;">
                        <div :style="data.divDisable3 ? data.disableStyle : `height:100%`">
                          <er-grid 
                                    @erGridReady="erGrid1Ready"
                                    :er-form-helper-prop="erFormHelper"
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
import { EI } from 'EIX/ei';
import { ER } from 'ERX/Er';
import erLayout from 'ERX/ErLayout';
import erGrid from "ERX/ErGrid";
import xrEfPanel from "EFX/xrEfPanel";
import xrEfForm from "EFX/xrEfForm";
import { nextTick, onMounted, reactive, ref } from 'vue';
import { Grid } from 'ant-design-vue';
import { ButtonType } from 'ant-design-vue/es/button';

export default {
  name: 'XQMIR22B',
  components: { erLayout,erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
const initializeService = 'qmir_form_get';

// 变量定义
const formName = 'XQMIR22B';
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
  //div禁用样式
  disableStyle:{
    pointerEvents:'none',
    userSelect:'none',
    opacity:0.3,
    height:100+'%'
  },
  divDisable1:false,
  divDisable2:false,
  divDisable3:false,
  butDisable1:true,
  butDisable2:true,
  clickData:{}
})
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
  const initialResult = await erFormHelper.Initialize(formPartition.value, formName, '', initializeService);
  if (initialResult.flag >= 0) {
    // 画面工具类初始化成功后将画面渲染条件设置为1
    initializeFlag.value = 1;

    // 回调函数获取控件信息及设置定义事件等操作
    nextTick(() => {
      // 获取画面上的主要控件信息

      // 设置每页记录数为1000
      // data.grid1.options.dataSource?.pageSize(1000);
      // data.grid2.options.dataSource?.pageSize(1000);
      // data.grid3.options.dataSource?.pageSize(1000);
      // 设置表格列不可编辑
      // erFormHelper.setGridEditable('gridView1',false);
      // erFormHelper.setGridEditable('gridView2',false);
      // erFormHelper.setGridEditable('gridView3',false);

      //LayoutGroupFilter2按钮事件
      const filterBtn1 = erFormHelper.getControl('LayoutGroupFilter2','QUERY');
      // if (filterBtn1 && filterBtn1 instanceof kendo.ui.Button) {
      //   (filterBtn1 as kendo.ui.Button).bind('click',(e:kendo.ui.ButtonEvent) => {
      //     queryDetailed2();
      //   })
      // }
      filterBtn1 && filterBtn1.bind('click', (e: ButtonType) => queryDetailed2());

    });
  } else {
    erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
  }
};

//查询表格数据
const queryInfo = () => {
  erFormHelper.queryDataByDataSource('gridView1', { filterConfigId: 'LayoutGroupFilter'});
   // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView1',false);
  erFormHelper.setGridEditable('gridView2',false);
  erFormHelper.setGridEditable('gridView3',false);

};

//F2查询
const F2_DO = async (e: any) => {
  queryInfo();
};

//F3组批新增确定
const F3_DO = async (e: any) => {
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
  inInfo.addBlock(bd,'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22a_ins', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    data.divDisable1 = false;
    data.divDisable2 = false;
    erFormHelper.messageSuccess('操作成功');
    queryInfo();
  }else {
    return false;
  }
};
//F3组批新增维护
const F3_PRE_DO = async (e: any) => {
  maskOperate(true,true,false);
  //设置可编辑
  erFormHelper.setGridEditable('gridView3',true);
};
//F3组批新增取消
const F3_CANCEL = async (e: any) => {
  maskOperate(false,false,false);
  queryInfo();
};

//移出组批
const removeBatching = async () => {
  if (erFormHelper.getGridSelectRows('gridView2').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView2');
  inInfo.addBlock(bd,'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22a_del2', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    await queryDetailed(data.clickData);
    await queryDetailed2();
  }else {
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
  inInfo.addBlock(bd,'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22a_ins2', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    await queryDetailed2();
    await queryDetailed(data.clickData);
  }else {
    return false;
  }
}

//F4组批调整确定
const F4_DO = async (e: any) => {
  data.butDisable1 = true;
  data.butDisable2 = true;
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
};

//F5组批删除确定
const F5_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd,'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22a_del', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    maskOperate(false,false,false);
    queryInfo();
  }else {
    return false;
  }
};
//F5组批删除维护
const F5_PRE_DO = async (e: any) => {
  maskOperate(false,true,true);
};
//F5组批删除取消
const F5_CANCEL = async (e: any) => {
  maskOperate(false,false,false);
  queryInfo();
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
  inInfo.addBlock(bd,'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22a_upd', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    maskOperate(false,false,false);
    queryInfo();
  }else {
    return false;
  }
};
//F7组批提交维护
const F7_PRE_DO = async (e: any) => {
  maskOperate(false,true,true);
};
//F7组批提交取消
const F7_CANCEL = async (e: any) => {
  maskOperate(false,false,false);
  queryInfo();
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
  inInfo.addBlock(bd,'Table0');

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22a_upd', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    maskOperate(false,false,false);
    queryInfo();
  }else {
    return false;
  }
};
//F8组批收回维护
const F8_PRE_DO = async (e: any) => {
  maskOperate(false,true,true);
};
//F8组批收回取消
const F8_CANCEL = async (e: any) => {
  maskOperate(false,false,false);
  queryInfo();
};

//grid1行点击事件
const gridView1Click = async (e: any) => {
  data.clickData = e.data
  await queryDetailed({SAMPLE_ENTR_NO:e.data?.get('SAMPLE_ENTR_NO'),BUY_ORDER_NO:e.data?.get('BUY_ORDER_NO')});
};

//查询已组汽车信息
const queryDetailed = async (row:any) => {
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.addColumn('SAMPLE_ENTR_NO');
  block.addColumn('BUY_ORDER_NO');
  block.addRow({
    SAMPLE_ENTR_NO: row.SAMPLE_ENTR_NO,
    BUY_ORDER_NO: row.BUY_ORDER_NO
  });
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir22a_inq2', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['Table0'], 'gridView2');
}

//查询未组汽车信息
const queryDetailed2 = async () => {
  const layoutValue: any = erFormHelper.getControlValue(
      'LayoutGroupFilter2',
      'WORK_DATE_START,WORK_DATE_END,SUPPLIER_CODE,MAT_CODE',
      // 'DateEdit,DateEdit,GridLookupEdit,GridLookupEdit'
  );
  layoutValue.TRNP_MODE_CODE = '2'
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.pushData(layoutValue,true);
  inInfo.addBlock(block);

  const outInfo = await erFormHelper.callService('qmir22a_inq3', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['Table0'], 'gridView3');
}

//遮罩层显示操作(传入各区域遮罩层显示状态)
const maskOperate = (region1Vis:boolean,region2Vis:boolean,region3Vis:boolean) => {
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
