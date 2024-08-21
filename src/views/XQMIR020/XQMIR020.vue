<template>
  <xr-ef-form @ready="efFormReady"
              :f2-do="F2_DO">
  <template v-if="initializeFlag === 1">          
    <v-splitter style="height: 100%" class="default-theme">
      <v-splitter-pane>
          <er-layout 
                        style="margin: 0"
                        :er-form-helper-prop="erFormHelper"
                        :config-id="'LayoutGroupFilter'"></er-layout>
          <xr-ef-panel title="查询结果"
                      padding="0 5px 5px 5px"
                      style="height:90%">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <er-grid 
                      @erGridReady="erGrid1Ready"
                      :er-form-helper-prop="erFormHelper"
                      :config-id="'gridView1'"
                      :options="{enableClick:true}"
                      @click="gridView1Click"
                      >
              </er-grid>
            </template>
          </xr-ef-panel>
      </v-splitter-pane>
      <v-splitter-pane>
          <er-layout 
                        @erGridReady="erGrid1Ready"
                        :er-form-helper-prop="erFormHelper"
                        :config-id="'LayoutGroupFilter2'"></er-layout>
          <xr-ef-panel title="查询结果"
                      padding="0 5px 5px 5px"
                      style="height:90%">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <er-grid 
                          @erGridReady="erGrid1Ready"
                          :er-form-helper-prop="erFormHelper"
                          :config-id="'gridView2'">
              </er-grid>
            </template>
          </xr-ef-panel>
      </v-splitter-pane>
      <v-splitter-pane>
          <er-layout 
                        @erGridReady="erGrid1Ready"
                        :er-form-helper-prop="erFormHelper"
                        :config-id="'LayoutGroupFilter3'"></er-layout>
          <xr-ef-panel title="查询结果"
                      padding="0 5px 5px 5px"
                      style="height:90%">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <er-grid 
                        @erGridReady="erGrid1Ready"
                        :er-form-helper-prop="erFormHelper"
                        :config-id="'gridView3'">
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
import { Ref, nextTick, onMounted, ref } from 'vue';
import { Grid } from 'ant-design-vue';
import { ButtonType } from 'ant-design-vue/es/button';
// import {CMUtil} from "@/utils/CMUtil";

export default {
  name: 'XQMIR020',
  components: { erLayout,erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
const initializeService = 'qmir_form_get';

// 变量定义
const formName = 'XQMIR020';
const erFormHelper =new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");

let grid1!:any;
let grid2!:any;
let grid3!:any;

//查询主项字段值
const filterCol: Ref<any> = ref();

const erGrid1Ready = () => {
  grid1 = erFormHelper.getGrid('gridView1');
  grid2 = erFormHelper.getGrid('gridView2');
  grid3 = erFormHelper.getGrid('gridView3');
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
      // 设置表格列不可编辑
      // erFormHelper.setGridEditable('gridView1',false);
      // erFormHelper.setGridEditable('gridView2',false);
      // erFormHelper.setGridEditable('gridView3',false);

      //LayoutGroupFilter2过滤按钮事件
      const filterBtn1 = erFormHelper.getControl('LayoutGroupFilter2','FILTER');
      // if (filterBtn1 && filterBtn1 instanceof kendo.ui.Button) {
      //   (filterBtn1 as kendo.ui.Button).bind('click',(e:kendo.ui.ButtonEvent) => {
      //     queryRelation();
      //   })
      // }
      filterBtn1 && filterBtn1.bind('click', (e: ButtonType) => queryRelation());
      //LayoutGroupFilter3过滤按钮事件
      const filterBtn2 = erFormHelper.getControl('LayoutGroupFilter3','FILTER');
      // if (filterBtn2 && filterBtn2 instanceof kendo.ui.Button) {
      //   (filterBtn2 as kendo.ui.Button).bind('click',(e:kendo.ui.ButtonEvent) => {
      //     queryRelation();
      //   })
      // }
      filterBtn2 && filterBtn2.bind('click', (e: ButtonType) => queryRelation());

      //LayoutGroupFilter2不包含按钮事件
      const notContain = erFormHelper.getControl('LayoutGroupFilter2','NOT_CONTAIN');
      // if (notContain && notContain instanceof kendo.ui.Button) {
      //   (notContain as kendo.ui.Button).bind('click',(e:kendo.ui.ButtonEvent) => {
      //     updateRelation(false);
      //   })
      // }
      notContain && notContain.bind('click', (e: ButtonType) => updateRelation(false));
      //LayoutGroupFilter3包含按钮事件
      const contain = erFormHelper.getControl('LayoutGroupFilter3','CONTAIN');
      // if (contain && contain instanceof kendo.ui.Button) {
      //   (contain as kendo.ui.Button).bind('click',(e:kendo.ui.ButtonEvent) => {
      //     updateRelation(true);
      //   })
      // }
      contain && contain.bind('click', (e: ButtonType) => updateRelation(true));

      nextTick(()=>{//下拉框允许输入
        //CMUtil.dropInupt(erFormHelper,'LayoutGroupFilter','DATA_RESOURCE');
      })

    });
  } else {
    erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
  }
};

//调接口查询下拉框内容
const queryT1 = async () => {
  const layoutValue = erFormHelper.getAllControlValue('LayoutGroupFilter')
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.pushData(layoutValue,true);
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir02_inq', inInfo, false, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['TQMIR00'],'gridView1')
  // 设置表格列不可编辑
  erFormHelper.setGridEditable('gridView1',false);
  erFormHelper.setGridEditable('gridView2',false);
  erFormHelper.setGridEditable('gridView3',false);
}

//F2查询
const F2_DO = async (e: any) => {
  await queryT1();
};

//grid1的单击事件
const gridView1Click = async (e: any) => {
  if (e.data?.get('id') === '') {
    return;
  }
  filterCol.value = e.data?.get('DATA_RESOURCE');
  await queryRelation();
};

//查询关系
const queryRelation = async () => {
  if (filterCol.value == undefined){
    erFormHelper.messageWarning('没有选中取样类别')
    return;
  }
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.addColumn('DATA_RESOURCE');
  block.addColumn('SAMPLE_POS_CODE_BH');
  block.addColumn('SAMPLE_POS_CODE_WBH');

  block.addRow({
    DATA_RESOURCE: filterCol.value,
    SAMPLE_POS_CODE_BH: erFormHelper.getControlValue('LayoutGroupFilter2', 'SAMPLE_POS_CODE_BH'),
    SAMPLE_POS_CODE_WBH: erFormHelper.getControlValue('LayoutGroupFilter3', 'SAMPLE_POS_CODE_WBH')
  });
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir02_inq1', inInfo, false, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.mergeDataToGrid(outInfo.blocks['Table0'], 'gridView2');
    erFormHelper.mergeDataToGrid(outInfo.blocks['Table1'], 'gridView3');
  }else {
    return false;
  }
}

//调整关系
const updateRelation = async (isContain:boolean) => {
  if (erFormHelper.getGridSelectRows(isContain ? 'gridView3' : 'gridView2').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }
  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock(isContain ? 'gridView3' : 'gridView2');
  inInfo.addBlock(bd,'Table0');

  const block1 = new EI.EiBlock('Table1');
  block1.addColumn('DATA_RESOURCE');
  block1.addRow({DATA_RESOURCE: filterCol.value})
  inInfo.addBlock(block1);
  const outInfo = await erFormHelper.callService(isContain ? 'qmir02_ins' : 'qmir02_del', inInfo, false, true);
  if (outInfo.sys.status >= 0) {
    await queryRelation();
    erFormHelper.messageSuccess('操作成功');
  }else {
    return false;
  }
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
