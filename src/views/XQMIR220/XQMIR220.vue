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
              :f7-cancel="F7_CANCEL">
    <template v-if="initializeFlag === 1">
    <!-- <a-tabs style="height: 100%;" ref="tabRef" @select="onSelect"> -->
    <a-tabs v-model:activeKey="tabActiveKey" type="card" >
      <a-tab-pane key="tab1" tab="试样登记">
            <er-layout 
                      :er-form-helper-prop="erFormHelper"
                      :config-id="'LayoutGroupFilter'"></er-layout>
            <er-layout 
                      :er-form-helper-prop="erFormHelper"
                      :config-id="'LayoutGroupFilter2'"></er-layout>
            <xr-ef-panel title="试样数据"
                         padding="0 5px 5px 5px">
              <template #customButtonSlot>

              </template>
              <template #contentSlot>
                <!-- <div :style="data.divDisable1 ? data.disableStyle : `height:100%`"> -->
                  <er-grid 
                          @erGridReady="erGrid1Ready"
                          :er-form-helper-prop="erFormHelper"
                          :config-id="'gridView1'"
                          :page-options="{ pagination: 'server', pageSize: 100 }"
                          @click="gridView1Click">
                  </er-grid>
                <!-- </div> -->
              </template>
            </xr-ef-panel>
      </a-tab-pane>
      <a-tab-pane key="tab2" tab="车次信息">
        <v-splitter horizontal style="height: 100%" class="default-theme">
          <v-splitter-pane size="40">
              <xr-ef-panel title="已组批车次"
                          padding="0 0 0 0">
                <template #customButtonSlot>

                </template>
                <template #contentSlot>
                  <er-grid 
                          @erGridReady="erGrid2Ready"
                          :er-form-helper-prop="erFormHelper"
                          :config-id="'gridView2'"
                          :page-options="{ pagination: 'server', pageSize: 200 ,pagesizes:[200, 400]}">
                  </er-grid>
                </template>
              </xr-ef-panel>
          </v-splitter-pane>
          <v-splitter-pane>
              <xr-ef-panel title="未组批车次"
                          padding="0 0 0 0">
                <template #customButtonSlot>

                </template>
                <template #contentSlot>
                  <er-layout 
                            :er-form-helper-prop="erFormHelper"
                            :config-id="'LayoutGroupFilter3'"
                            id="layout_train"></er-layout>
                  <er-grid 
                            @erGridReady="erGrid3Ready"
                            :er-form-helper-prop="erFormHelper"
                            :config-id="'gridView3'"
                            :page-options="{ pagination: 'server', pageSize: 200 ,pagesizes:[200, 400]}">
                  </er-grid>
                </template>
              </xr-ef-panel>
          </v-splitter-pane>
        </v-splitter>
      </a-tab-pane>
    </a-tabs>
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
  name: 'XQMIR220',
  components: { erLayout,erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
const initializeService = 'qmir_form_get';

// 变量定义
const formName = 'XQMIR220';
const erFormHelper =new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");

const tabRef = ref();
const tabActiveKey = ref('tab1') 

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
  deleteDis:false,
  total:0,
  total3:0,
  clickData:{}
});

const erGrid1Ready = (e:any) => {
  data.grid1 = e.API.data;
  console.log("🚀 ~ erGrid1Ready ~ data.grid1:", data.grid1)
  
}

const erGrid2Ready = () => {
  data.grid2 = erFormHelper.getGrid('gridView2');
}

const erGrid3Ready = () => {
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

    // 调用ErFormHelper工具类的setGridServerPagingQuery方法设置分页查询方法
    // erFormHelper.setGridServerPagingQuery('gridView1', (options: any) => {
    //   const layoutValue: any = erFormHelper.getControlValue(
    //       'LayoutGroupFilter',
    //       'MAT_CODE,BUY_ORDER_NO,WORK_DATE_START,WORK_DATE_END',
    //       // 'GridLookupEdit,TextEdit,DateEdit,DateEdit'
    //   );
    //   layoutValue.INDEX_FROM = options.data.skip
    //   layoutValue.RETURN_NUM = options.data.pageSize
    //   if (layoutValue.WORK_DATE_START == null){
    //     layoutValue.WORK_DATE_START = ''
    //   }
    //   if (layoutValue.WORK_DATE_END == null){
    //     layoutValue.WORK_DATE_END = ''
    //   }

    //   const inInfo = new EI.EIInfo();
    //   const block = new EI.EiBlock('Table0');
    //   block.pushData(layoutValue,true);
    //   inInfo.addBlock(block);
    //   erFormHelper.callService('qmir22_inq', inInfo, false, true).then((res:any) => {
    //     const outInfo = res as EI.EIInfo;
    //     if (res.sys.status >= 0) {
    //       //根据自己的后台获取查询结果及总页数
    //       const resultData = outInfo.getBlock(0).data;   //后台返回的当页的数据
    //       if (outInfo.blocks['Table1'] != undefined){
    //         data.total = outInfo.blocks['Table1'].data[0].RECORD_TOTAL;
    //       }
    //       //固定写法[ison的键必须是data和total]
    //       const result = { data: resultData, total: data.total };
    //       options.success(result);
    //     }
    //   })
    // });

    // erFormHelper.setGridServerPagingQuery('gridView3', (options: any) => {
    //   const layoutValue: any = erFormHelper.getControlValue(
    //       'LayoutGroupFilter3',
    //       'MAT_CODE,BUY_ORDER_NO,WORK_DATE_START,WORK_DATE_END',
    //       'GridLookupEdit,TextEdit,DateEdit,DateEdit'
    //   );
    //   layoutValue.INDEX_FROM = options.data.skip
    //   layoutValue.RETURN_NUM = options.data.pageSize
    //   layoutValue.SAMPLE_NO = erFormHelper.getGridSelectRows('gridView1')[0].SAMPLE_NO
    //   if (layoutValue.WORK_DATE_START == null){
    //     layoutValue.WORK_DATE_START = ''
    //   }
    //   if (layoutValue.WORK_DATE_END == null){
    //     layoutValue.WORK_DATE_END = ''
    //   }

    //   const inInfo = new EI.EIInfo();
    //   const block = new EI.EiBlock('Table0');
    //   block.pushData(layoutValue,true);
    //   inInfo.addBlock(block);
    //   erFormHelper.callService('qmir22_inq1', inInfo, false, true).then((res:any) => {
    //     const outInfo = res as EI.EIInfo;
    //     if (res.sys.status >= 0) {
    //       //根据自己的后台获取查询结果及总页数
    //       const resultData = outInfo.getBlock(0).data;   //后台返回的当页的数据
    //       if (outInfo.blocks['Table1'] != undefined){
    //         data.total3 = outInfo.blocks['Table1'].data[0].RECORD_TOTAL;
    //       }
    //       //固定写法[ison的键必须是data和total]
    //       const result = { data: resultData, total: data.total3 };
    //       options.success(result);
    //     }
    //   })
    // });

    // 回调函数获取控件信息及设置定义事件等操作
    nextTick(() => {
      nextTick(() => {
        // 设置组件禁用
        erFormHelper.setAllControlReadOnly('LayoutGroupFilter2',true)
      });
      // 获取画面上的主要控件信息

      // 设置每页记录数为1000
      // data.grid1.options.dataSource?.pageSize(200);
      // data.grid2.options.dataSource?.pageSize(200);
      // data.grid3.options.dataSource?.pageSize(200);
      // 设置表格列不可编辑
      // erFormHelper.setGridEditable('gridView1',false);
      // erFormHelper.setGridEditable('gridView2',false);
      // erFormHelper.setGridEditable('gridView3',false);

      //组批
      const filterBtn1 = erFormHelper.getControl('LayoutGroupFilter3','BATCHING');
      // if (filterBtn1 && filterBtn1 instanceof kendo.ui.Button) {
      //   (filterBtn1 as kendo.ui.Button).bind('click',(e:kendo.ui.ButtonEvent) => {
      //     batching();
      //   })
      // }
      filterBtn1 && filterBtn1.bind('click', (e: ButtonType) => batching());
      
      //退批
      const filterBtn2 = erFormHelper.getControl('LayoutGroupFilter3','REJECTION');
      // if (filterBtn2 && filterBtn2 instanceof kendo.ui.Button) {
      //   (filterBtn2 as kendo.ui.Button).bind('click',(e:kendo.ui.ButtonEvent) => {
      //     unBatching();
      //   })
      // }
      filterBtn2 && filterBtn2.bind('click', (e: ButtonType) => unBatching());

    });
  } else {
    erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
  }
};

//查询
const queryInfo = () => {
  //获取标签卡组件对象
  // const tabStrip = tabRef.value.kendoWidget();
  //获取当前激活的标签卡title
  // const title = tabStrip.tabGroup.children(".k-state-active").text();
  const tabs = tabActiveKey.value;
  if (tabs == 'tab1'){
    //erFormHelper.getGridServerPageData('gridView1');
    erFormHelper.getGrid('gridView1');
  }
  if (tabs == 'tab2'){
    if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
      erFormHelper.messageWarning('至少选择一条试样数据');
      return false;
    }
    //erFormHelper.getGridServerPageData('gridView3');
    erFormHelper.getGrid('gridView3');
  }
  erFormHelper.setGridEditable('gridView1',false);
  erFormHelper.setGridEditable('gridView2',false);
  erFormHelper.setGridEditable('gridView3',false);
}

//F2查询
const F2_DO = async (e: any) => {
  queryInfo();
};

//新增确认
const F3_DO = async (e: any) => {
  //检验必输项
  if (!erFormHelper.checkGridInput('LayoutGroupFilter2')) {
    return false;
  }
  const layoutValue: any = erFormHelper.getControlValue(
      'LayoutGroupFilter2',
      'SAMPLE_NO,INSPECT_BATCH_NO,SAMPLE_POS_CODE,MAT_CODE,BUY_ORDER_NO,' +
      'SAMPLE_POS_DESC,SAMPLE_TIME,MAT_ARRI_TIME,WORK_TEAM,WORK_SHIFT,ENCR_LEVEL,SAMPLE_DESC'
  );
  erFormHelper.setControlValue('LayoutGroupFilter2', 'INSPECT_BATCH_NO', layoutValue.SAMPLE_NO);
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0')
  block.pushData(layoutValue,true)
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22_ins', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.setAllControlReadOnly('LayoutGroupFilter2',true)
    data.divDisable1 = false
    erFormHelper.messageSuccess('操作成功!');
  }else {
    return false;
  }
};
//新增维护
const F3_PRE_DO = async (e: any) => {
  erFormHelper.setAllControlReadOnly('LayoutGroupFilter2',false)
  data.divDisable1 = true
};
//新增取消
const F3_CANCEL = async (e: any) => {
  erFormHelper.setAllControlReadOnly('LayoutGroupFilter2',true)
  data.divDisable1 = false
};

//F4修改确认
const F4_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView1",(): boolean =>{
    return true;
  });
  const bd:any[] = erFormHelper.getGridSelectRows('gridView1',false,true);

  if (bd[0].DATA_STATUS != '00'){
    erFormHelper.messageWarning('该试样不是编辑状态，不能修改');
    return false;
  }

  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkGridInput('LayoutGroupFilter2')) {
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0')
  bd[0].SAMPLE_NO = erFormHelper.getControlValue('LayoutGroupFilter2','SAMPLE_NO');
  bd[0].INSPECT_BATCH_NO = erFormHelper.getControlValue('LayoutGroupFilter2','INSPECT_BATCH_NO');
  bd[0].SAMPLE_POS_CODE = erFormHelper.getControlValue('LayoutGroupFilter2','SAMPLE_POS_CODE');
  bd[0].MAT_CODE = erFormHelper.getControlValue('LayoutGroupFilter2','MAT_CODE');
  bd[0].BUY_ORDER_NO = erFormHelper.getControlValue('LayoutGroupFilter2','BUY_ORDER_NO');
  bd[0].SAMPLE_POS_DESC = erFormHelper.getControlValue('LayoutGroupFilter2','SAMPLE_POS_DESC');
  bd[0].SAMPLE_TIME = erFormHelper.getControlValue('LayoutGroupFilter2','SAMPLE_TIME');
  bd[0].MAT_ARRI_TIME = erFormHelper.getControlValue('LayoutGroupFilter2','MAT_ARRI_TIME');
  bd[0].WORK_TEAM = erFormHelper.getControlValue('LayoutGroupFilter2','WORK_TEAM');
  bd[0].WORK_SHIFT = erFormHelper.getControlValue('LayoutGroupFilter2','WORK_SHIFT');
  bd[0].ENCR_LEVEL = erFormHelper.getControlValue('LayoutGroupFilter2','ENCR_LEVEL');
  bd[0].SAMPLE_DESC = erFormHelper.getControlValue('LayoutGroupFilter2','SAMPLE_DESC');

  block.pushData(bd[0],true)
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22_upd', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    erFormHelper.setControlReadOnly('LayoutGroupFilter2',true,'SAMPLE_POS_CODE','BUY_ORDER_NO','SAMPLE_POS_DESC','SAMPLE_TIME','MAT_ARRI_TIME','WORK_TEAM','WORK_SHIFT','ENCR_LEVEL','SAMPLE_DESC')
    data.divDisable1 = false;
    erFormHelper.messageSuccess('操作成功!');
  }else {
    return false;
  }
};
//F4修改维护
const F4_PRE_DO = async (e: any) => {
  data.divDisable1 = true;
  erFormHelper.setControlReadOnly('LayoutGroupFilter2',false,'SAMPLE_POS_CODE','BUY_ORDER_NO','SAMPLE_POS_DESC','SAMPLE_TIME','MAT_ARRI_TIME','WORK_TEAM','WORK_SHIFT','ENCR_LEVEL','SAMPLE_DESC')
};
//F4修改取消
const F4_CANCEL = async (e: any) => {
  erFormHelper.setControlReadOnly('LayoutGroupFilter2',true,'SAMPLE_POS_CODE','BUY_ORDER_NO','SAMPLE_POS_DESC','SAMPLE_TIME','MAT_ARRI_TIME','WORK_TEAM','WORK_SHIFT','ENCR_LEVEL','SAMPLE_DESC')
  data.divDisable1 = false;
};

//F5删除确认
const F5_DO = async (e: any) => {
  const bd:any[] = erFormHelper.getGridSelectRows('gridView1',false,true);
  for (const b of bd) {
    if (b.DATA_STATUS != '00'){
      erFormHelper.messageWarning('该试样不是编辑状态，不能删除');
      return false;
    }
  }

  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.pushData(bd,true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22_del', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    // 查询最新数据
    queryInfo();
    erFormHelper.messageSuccess('操作成功!');
  }else {
    return false;
  }
};
//F5删除维护
const F5_PRE_DO = async (e: any) => {
  data.deleteDis = true;
};
//F5删除取消
const F5_CANCEL = async (e: any) => {
  data.deleteDis = false;
  data.grid1.clearSelection();
};

//F6送检确认
const F6_DO = async (e: any) => {
  const bd:any[] = erFormHelper.getGridSelectRows('gridView1',false,true);
  for (const b of bd) {
    if (b.DATA_STATUS != '00'){
      erFormHelper.messageWarning('该试样不是编辑状态，不能送检');
      return false;
    }
  }

  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.pushData(bd,true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22_snd', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    // 查询最新数据
    queryInfo();
    erFormHelper.messageSuccess('操作成功!');
  }else {
    return false;
  }
};
//F6送检维护
const F6_PRE_DO = async (e: any) => {
  data.deleteDis = true;
};
//F6送检取消
const F6_CANCEL = async (e: any) => {
  data.deleteDis = false;
  data.grid1.clearSelection();
};

//F7撤销确认
const F7_DO = async (e: any) => {
  const bd:any[] = erFormHelper.getGridSelectRows('gridView1',false,true);
  for (const b of bd) {
    if (b.DATA_STATUS == '00'){
      erFormHelper.messageWarning('未送检,不能撤销');
      return false;
    }
    if (b.DATA_STATUS == '02'){
      erFormHelper.messageWarning('加密中,不能撤销');
      return false;
    }
    if (b.DATA_STATUS == '03'){
      erFormHelper.messageWarning('分析完成,不能撤销');
      return false;
    }
  }

  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.pushData(bd,true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22_bak', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    // 查询最新数据
    queryInfo();
    erFormHelper.messageSuccess('操作成功!');
  }else {
    return false;
  }
};
//F7撤销维护
const F7_PRE_DO = async (e: any) => {
  data.deleteDis = true;
};
//F7撤销取消
const F7_CANCEL = async (e: any) => {
  data.deleteDis = false;
  data.grid1.clearSelection();
};

//grid1点击事件
const gridView1Click = async (e: any) => {
  //如果有上次点击的数据就取消勾选并且是非删除模式
  if (data.clickData.uid != undefined && !data.deleteDis){
    erFormHelper.unCheckAllGridRow(data.grid1,data.clickData.uid)
  }
  //如果点的是勾选框就不用重复勾选并且是非删除模式
  if (!e.columnChanged && !data.deleteDis){
    erFormHelper.checkGridRow(data.grid1,e.data!.uid)
  }
  data.clickData = e.data
  erFormHelper.setControlValue('LayoutGroupFilter2','SAMPLE_NO',data.clickData.SAMPLE_NO);
  erFormHelper.setControlValue('LayoutGroupFilter2','INSPECT_BATCH_NO',data.clickData.INSPECT_BATCH_NO);
  erFormHelper.setControlValue('LayoutGroupFilter2','SAMPLE_POS_CODE',data.clickData.SAMPLE_POS_CODE);
  erFormHelper.setControlValue('LayoutGroupFilter2','MAT_CODE',data.clickData.MAT_CODE);
  erFormHelper.setControlValue('LayoutGroupFilter2','BUY_ORDER_NO',data.clickData.BUY_ORDER_NO);
  erFormHelper.setControlValue('LayoutGroupFilter2','SAMPLE_POS_DESC',data.clickData.SAMPLE_POS_DESC);
  erFormHelper.setControlValue('LayoutGroupFilter2','SAMPLE_TIME',data.clickData.SAMPLE_TIME);
  erFormHelper.setControlValue('LayoutGroupFilter2','MAT_ARRI_TIME',data.clickData.MAT_ARRI_TIME);
  erFormHelper.setControlValue('LayoutGroupFilter2','WORK_TEAM',data.clickData.WORK_TEAM);
  erFormHelper.setControlValue('LayoutGroupFilter2','WORK_SHIFT',data.clickData.WORK_SHIFT);
  erFormHelper.setControlValue('LayoutGroupFilter2','ENCR_LEVEL',data.clickData.ENCR_LEVEL);
  erFormHelper.setControlValue('LayoutGroupFilter2','SAMPLE_DESC',data.clickData.SAMPLE_DESC);
};

//查询已组车次
const queryBatch = async () => {
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.addColumn('SAMPLE_NO');
  block.addRow({
    SAMPLE_NO: data.clickData.SAMPLE_NO
  });
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir22_inq2', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['TQMIR22'], 'gridView2');
}

//组批
const batching = async () => {
  if (erFormHelper.getGridSelectRows('gridView3').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const bd:any[] = erFormHelper.getGridSelectRows('gridView3',false,true);
  for (const b of bd) {
    if (!b.SRC_MAT_CODE == data.clickData.MAT_CODE){
      erFormHelper.messageWarning('物料代码信息不一致');
      return false;
    }
    if (!b.BUY_ORDER_NO == data.clickData.BUY_ORDER_NO){
      erFormHelper.messageWarning('采购订单信息不一致');
      return false;
    }
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const block1 = new EI.EiBlock('Table1');
  block1.addColumn('SAMPLE_NO');
  block1.addRow({SAMPLE_NO:data.clickData.SAMPLE_NO});
  block.pushData(bd,true);
  inInfo.addBlock(block);
  inInfo.addBlock(block1);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22_com', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    // 查询最新数据
    queryInfo();
    erFormHelper.messageSuccess('操作成功!');
    await queryBatch();
  }else {
    return false;
  }
}

//退批
const unBatching = async () => {
  if (erFormHelper.getGridSelectRows('gridView2').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const bd:any[] = erFormHelper.getGridSelectRows('gridView2',false,true);

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.pushData(bd,true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir22_rev', inInfo, true, true);

  if (outInfo.sys.status >= 0) {
    // 查询最新数据
    queryInfo();
    erFormHelper.messageSuccess('操作成功!');
    await queryBatch();
  }else {
    return false;
  }
}

onMounted(() => {
  // initializePage();
});
</script>

<style lang="scss">
//.k-tabstrip-content, html.default .k-tabstrip > .k-content {
//  padding: 0 !important;
//}

#registration  {
  padding: 0 !important;
}
#layout_train .efpanel-root {
  padding: 0 0 5px 0 !important;
  }
.efpanel-root {
height: 100%;
}
</style>
