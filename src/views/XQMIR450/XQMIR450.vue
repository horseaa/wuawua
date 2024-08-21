<template>
  <xr-ef-form @ready="efFormReady"
              :f2-do="F2_DO">
    <template v-if="initializeFlag === 1">
    <er-layout 
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'LayoutGroupFilter'"></er-layout>
    <a-tabs v-model:activeKey="tabActiveKey" type="card" >
      <a-tab-pane key="tab1" tab="磨后喷吹煤成分">
        <er-grid 
                @erGridReady="erGrid1Ready"
                :er-form-helper-prop="erFormHelper"
                :config-id="'gridView1'">
        </er-grid>
      </a-tab-pane>
      <a-tab-pane key="tab2" tab="磨后喷吹煤统计分析">
        <er-grid 
                @erGridReady="erGrid2Ready"
                :er-form-helper-prop="erFormHelper"
                :options="{viewType:'BandView'}"
                :config-id="'gridView2'">
        </er-grid>
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

export default {
  name: 'XQMIR450',
  components: { erLayout,erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
const initializeService = 'qmir_form_get';

// 变量定义
const formName = ref('XQMIR450');
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
  grid1EditDis:false,
  gridToolbar1:[],
  compareField:[],
  trainDis:true,
  abnormalDis:true,
  trainTabDis:true,
  gridOptions:{},
  gridKey:'1',
  determineDs:[],
  clickData:{},
  MAP_CODE:'QMIR45'
});
const erGrid1Ready = () => {
  data.grid1 = erFormHelper.getGrid('gridView1');
}

const erGrid2Ready = () => {
  data.grid2 = erFormHelper.getGrid('gridView2'); 
}

const efFormReady = (e: any) => {
  efFormInfo.value = e.formInfo;
  efFormIsReady.value = true;
  formPartition.value = efFormInfo.value.formPartition;
  // 初始化低代码工具类
  initializePage();
};

// 画面相关数据初始化--异步调用
const initializePage = async () => {
  const paras = efFormInfo.value;
  if (paras.formParams?.form_name) formName.value = paras.formParams['form_name'];
  if (paras.formParams?.MAP_CODE) data.MAP_CODE = paras.formParams['MAP_CODE'];
  // 调用后台服务service获取配置数据并实例化工具类--Initialize
  const initialResult = await erFormHelper.Initialize(formPartition.value, formName.value, '', initializeService);

  //判断初始化返回结果，若>=0表示正确获取初始化信息，否则报错
  if (initialResult.flag >= 0) {
    //查询要添加的分析项目列
    // await queryAnalysisPro();
    // 画面工具类初始化成功后将画面渲染条件设置为1
    initializeFlag.value = 1;

    // 回调函数获取控件信息及设置定义事件等操作
    nextTick(() => {
      // 获取画面上的主要控件信息
      setTimeout(() => {
        //查询要添加的分析项目列
        queryAnalysisPro();
            //设置工具栏位置
           // erFormHelper.setGridToolbarPosition('gridView1', 'bottom');
          }, 500);
      // 设置表格列不可编辑
      // erFormHelper.setGridEditable('gridView1',false);
      // erFormHelper.setGridEditable('gridView2',false);
    });
  } else {
    // 在页面上侧中间显示错误信息栏
    erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
  }
};


//查询要显示的分析项目&判定项目
const queryAnalysisPro = async () => {
  console.log("🚀 ~ queryAnalysisPro ~ data:", data)
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.addColumn('FORM_CODE');
  block.addRow({FORM_CODE:data.MAP_CODE});
  inInfo.addBlock(block);

  const outInfo = await erFormHelper.callService('qmir21_inq0', inInfo, true, true);
  const customColumns = ref([{}]);
  const analysisData = outInfo.blocks['Table0'].data;
  //分析项目
  for (let a of analysisData) {
    //给返回分析项目重新编号前缀Q拼接compareField规则表的长度(长度是递增的)
    const fieldId = 'Q'+data.compareField.length;
    data.compareField.push({
      fieldCode:fieldId,
      fieldDesc:a.ANALYSE_ITEM_CODE,
      fieldType:a.ANALYSE_ITEM_TYPE == 'N' ? 'number' : 'string'
    })
    // let customColumn = {
    //   field: fieldId,
    //   title: a.ANALYSE_ITEM_REMARK,
    //   width: 120,
    //   locked: false,
    //   defaultValue: null,
    //   addToDataSource:true,
    //   editable: function () {
    //     return true;
    //   },
    //   // format: '#,##0.00',
    //   // max: 20,
    //   // min: -20,
    //   type: a.ANALYSE_ITEM_TYPE == 'N' ? 'number' : 'string',
    //   hidden:a.DIS_FLAG != 'Y'
    // }
    const customColumn: any = {
            field: '',
            title: '',
            hidden: false,
            width: 100
          };
    customColumn.field = fieldId;
    customColumn.headerName = a.ANALYSE_ITEM_REMARK;
    if (a.ANALYSE_ITEM_TYPE == 'N'){
      Reflect.set(customColumn,'decimals',a.DECIMAL_DIGIT)
      Reflect.set(customColumn,'aggregate','sum')
    }
    //给grid1的options加列配置
    // customColumns.push(customColumn)
    customColumns.value.push(customColumn);
  }
  data.gridOptions['customColumns'] = customColumns;
  customColumns.value.shift();
  erFormHelper.addGridColumn("gridView1",customColumns.value);
}


//F2查询
const F2_DO = async (e: any) => {
  //获取标签卡组件对象
  // const tabStrip = tabRef.value.kendoWidget();
  //获取当前激活的标签卡title
  const tabs = tabActiveKey.value;
  // const title = tabStrip.tabGroup.children(".k-state-active").text();
  if (tabs == 'tab1'){
    await queryInfoT1();
  }else{
    await queryInfoT2();
  }
  erFormHelper.setGridEditable('gridView1',false);
  erFormHelper.setGridEditable('gridView2',false);
};

//Tab1通过接口查询
const queryInfoT1 = async () => {
  const layoutValue: any = erFormHelper.getAllControlValue('LayoutGroupFilter');
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  layoutValue.INDEX_FROM = 0
  layoutValue.RETURN_NUM = 1000
  block.pushData(layoutValue,true);
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir45_inq', inInfo, false, true);
  console.log("🚀 ~ queryInfoT1 ~ outInfo:", outInfo)
  erFormHelper.mergeDataToGrid(outInfo.blocks['Table0'], 'gridView1');
}

//Tab2通过接口查询
const queryInfoT2 = async () => {
  const layoutValue: any = erFormHelper.getAllControlValue('LayoutGroupFilter');
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  layoutValue.INDEX_FROM = 0
  layoutValue.RETURN_NUM = 1000
   block.pushData(layoutValue,true);
  inInfo.addBlock(block);
  const outInfo = await erFormHelper.callService('qmir45_inq1', inInfo, false, true);
  console.log("🚀 ~ queryInfoT2 ~ outInfo:", outInfo)
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