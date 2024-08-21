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
              :f9-do="F9_DO"
              :f9-pre-do="F9_PRE_DO"
              :f9-cancel="F9_CANCEL"
              :f12-do="F12_DO"
              :f12-pre-do="F12_PRE_DO"
              :f12-cancel="F12_CANCEL">
    <template v-if="initializeFlag === 1">
      <er-layout
          v-show="!data.yyDis"
          :er-form-helper-prop="erFormHelper"
          :config-id="'LayoutGroupFilter'"></er-layout>
      <er-layout
          v-show="data.yyDis"
          :er-form-helper-prop="erFormHelper"
          :config-id="'LayoutGroupFilter2'"></er-layout>
      <a-tabs v-model:activeKey="tabActiveKey" type="card" @change="changeTab">
        <a-tab-pane  key="tab1" tab="质量数据">
          <er-grid
              @erGridReady="erGrid1Ready"
              :er-form-helper-prop="erFormHelper"
              :config-id="'gridView1'"
              @focus-changed="gridView1FocusChanged"
              :options="{ enableClick: true }">
          </er-grid>
        </a-tab-pane>
        <a-tab-pane v-if="data.trainDis" v-show="data.trainTabDis" key="tab2" tab="车次清单">
          <er-grid
              @erGridReady="erGrid2Ready"
              :er-form-helper-prop="erFormHelper"
              :config-id="'gridView2'">
          </er-grid>
        </a-tab-pane>
        <a-tab-pane v-show="data.abnormalDis" key="tab3" tab="判定异常数据">
          <er-grid
              @erGridReady="erGrid3Ready"
              :er-form-helper-prop="erFormHelper"
              :config-id="'gridView3'">
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
  name: 'XQMIR21',
  components: { erLayout,erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// import $ from 'jquery'
// 获取画面的分区信息及设置画面初始化service
const initializeService = 'gcir_formload';

// 变量定义
const formName = ref('XQMIR21X');
const erFormHelper =new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");

const tabActiveKey = ref('tab1')

//页面变量
const data:any = reactive({
  grid1:Grid,
  grid2:Grid,
  grid3:Grid,
  grid1EditDis:false,
  gridToolbar1:[],
  compareField:[],
  trainDis:true,
  abnormalDis:true,
  trainTabDis:true,
  gridOptions:{},
  gridKey:'1',
  yyDis:false,
  determineDs:[],
  clickData:null,
  DATA_RESOURCE_M:'ALL',
  DATA_RESOURCE_AP:'ALL',
  TYPE:'ALL',
  DATA_RESOURCE_P:'ALL',
  DATA_RESOURCE_TL:'ALL',
  MAP_CODE:'QMIR21'
})

let dataSource:any;
let resultArray0;
let mergedObjAll;
//let resultCodes=[];//放所有的动态列
let resultCodes:any[]=[]
let customColumns = ref([{}]);
const erGrid1Ready = (e:any) => {
  data.grid1 = e.api;
  dataSource = e.columnApi
}
let mode = ""; // 当前操作的模式：主要用来区分是新增还是删除

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
  const paras = efFormInfo.value;
  if (paras.formParams?.form_name) formName.value = paras.formParams['form_name'];
  if (paras.formParams?.MAP_CODE) data.MAP_CODE = paras.formParams['MAP_CODE'];
  if (paras.formParams?.TYPE) data.TYPE = paras.formParams['TYPE'];
  if (paras.formParams?.DATA_RESOURCE_M) data.DATA_RESOURCE_M = paras.formParams['DATA_RESOURCE_M'];
  if (paras.formParams?.DATA_RESOURCE_AP) data.DATA_RESOURCE_AP = paras.formParams['DATA_RESOURCE_AP'];
  if (paras.formParams?.DATA_RESOURCE_P) data.DATA_RESOURCE_P = paras.formParams['DATA_RESOURCE_P'];
  if (paras.formParams?.DATA_RESOURCE_TL) data.DATA_RESOURCE_TL = paras.formParams['DATA_RESOURCE_TL'];

  if (data.TYPE !== '进厂'){
    data.trainDis = false;
  }

  console.log('148data.paras', paras);
  console.log('148data.DATA_RESOURCE_M', paras.formParams['DATA_RESOURCE_M']);


  console.log('formPartition',formPartition.value);

  const initialResult = await erFormHelper.Initialize(formPartition.value, formName.value, '', initializeService);
  if (initialResult.flag >= 0) {
    // 画面工具类初始化成功后将画面渲染条件设置为1
    initializeFlag.value = 1;

    nextTick(async () => {
      if (data.trainDis){
        // data.grid2.options.dataSource?.pageSize(200);
        erFormHelper.setGridEditable('gridView2',false);
      }
      // 获取画面上的主要控件信息

      // 设置每页记录数为200
      // data.grid3.options.dataSource?.pageSize(200);
      // data.grid1.options.dataSource?.pageSize(200);
      erFormHelper.setGridEditable('gridView3',false);
      setTimeout(() => {
        //查询要添加的分析项目列
        queryAnalysisPro();
        //设置工具栏位置
        // erFormHelper.setGridToolbarPosition('gridView1', 'bottom');
      }, 500);
    });
  } else {
    erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
  }
};

//查询要显示的分析项目&判定项目
const queryAnalysisPro = async () => {
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.addColumn('FORM_CODE');
  block.addRow({FORM_CODE:data.MAP_CODE});
  inInfo.addBlock(block);

  const outInfo = await erFormHelper.callService('qmir21_inq0', inInfo, true, true);
  //const customColumns = [];
  const analysisData = outInfo.blocks['Table0'].data;
  console.log("🚀 ~ queryAnalysisPro ~ analysisData:", analysisData)
  const determineData = outInfo.blocks['Table1'].data;
  console.log("🚀 ~ queryAnalysisPro ~ determineData:", determineData)

  if (determineData.length > 0){
    //查询判定项目的下拉选数据
    const inInfo = new EI.EIInfo();
    const block = new EI.EiBlock('Table0');
    block.addColumn('CODE_CLASS');
    block.addRow({CODE_CLASS:'IRQ3'});
    inInfo.addBlock(block);

    const outInfo = await erFormHelper.callService('gcir_tep0002', inInfo, true, true);
    data.determineDs = outInfo.blocks['IRQ3'].data;
  }
  //分析项目
  for (let a of analysisData || []) {
    //给返回分析项目重新编号前缀Q拼接compareField规则表的长度(长度是递增的)
    const fieldId = 'Q'+data.compareField.length;
    data.compareField.push({
      fieldCode:fieldId,
      fieldDesc:a.ANALYSE_ITEM_CODE,
      fieldType:a.ANALYSE_ITEM_TYPE == 'N' ? 'number' : 'string'
    });
    const customColumn: any = {
      field: '',
      title: '',
      hidden: false,
      width: 90,
     // default:0,
    };
    customColumn.field = fieldId;
    console.log('customColumns111',fieldId)
    resultCodes.push(fieldId)      ;
    console.log('resultCodes',resultCodes)

    customColumn.headerName = a.ANALYSE_ITEM_REMARK as string;
    customColumns.value.push(customColumn);
    console.log('customColumns',customColumns.value)
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
    // if (a.ANALYSE_ITEM_TYPE == 'N'){
    //   Reflect.set(customColumn,'decimals',a.DECIMAL_DIGIT)
    //   Reflect.set(customColumn,'aggregate','sum')
    // }
    // //给grid1的options加列配置
    // customColumns.push(customColumn)
  }

  // for (let d of determineData || []) {
  //   //给返回分析项目重新编号前缀Q拼接compareField规则表的长度(长度是递增的)
  //   const fieldId = 'Q'+data.compareField.length;
  //   data.compareField.push({
  //     fieldCode:fieldId,
  //     fieldDesc:d.STD_JDG_TYPE,
  //     fieldType:'string'
  //   })
  //   let customColumn = {
  //     field: fieldId,
  //     title: d.SHOW_REMARK,
  //     width: 120,
  //     locked: false,
  //     defaultValue: '',
  //     addToDataSource:true,
  //     editable: function () {
  //       return true;
  //     },
  //     type: 'string',
  //     hidden:false,
  //     template: (dataRow: { [x: string]: any }) => {
  //       //显示的描述
  //       let cellText = '';
  //       //根据代码找到对应的描述
  //       for (let d of data.determineDs) {
  //         if (dataRow[fieldId] == d['CODE']){
  //           cellText = d['CODE_DESC_1_CONTENT'];
  //           break;
  //         }
  //       }
  //       return cellText;
  //     },
  //     // editor: function (container: string | JQuery<HTMLElement> | JQuery.TypeOrArray<Element | DocumentFragment>, options: { field: string; }) {//选择值
  //     //   kendo.jQuery('<input name="' + options.field + '"/>')
  //     //       .appendTo(container)
  //     //       .kendoDropDownList(
  //     //           {
  //     //             dataTextField: "CODE_DESC_1_CONTENT",
  //     //             dataValueField: "CODE",
  //     //             dataSource: data.determineDs,
  //     //             valuePrimitive: true
  //     //           }
  //     //       );
  //     // }
  //   }
  //   //给grid1的options加列配置
  //   customColumns.push(customColumn)
  // }
  customColumns.value.shift();
  erFormHelper.addGridColumn("gridView1",customColumns.value);
  //data.gridOptions['customColumns'] = customColumns;
}


//查询
const queryInfo = async () => {
  const layoutValue: any = erFormHelper.getAllControlValue('LayoutGroupFilter');
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  layoutValue.INDEX_FROM = 0
  layoutValue.RETURN_NUM = 1000
  layoutValue.MAP_CODE = data.MAP_CODE
  layoutValue.DATA_RESOURCE_M = data.DATA_RESOURCE_M
  layoutValue.DATA_RESOURCE_AP = data.DATA_RESOURCE_AP
  layoutValue.DATA_RESOURCE_P = data.DATA_RESOURCE_P
  layoutValue.DATA_RESOURCE_TL = data.DATA_RESOURCE_TL
  block.pushData(layoutValue,true);
  inInfo.addBlock(block);

  const outInfo = await erFormHelper.callService('qmir21_inq', inInfo, true, true);
  const dataRes:any = outInfo.blocks['Table0'].data;//所有的未处理数据
  console.log("🚀 ~ dataRes:", dataRes)
  if (dataRes.length > 0){
    //提取列数据
    //const customColumns = dataRes.reduce((acc:any, cur:any) => {
    const Columns = dataRes.reduce((acc:any, cur:any) => {
      // 排除 ANALYSE_ITEM_CODE 为空或未定义的情况
      if (cur.ANALYSE_ITEM_CODE == null) {
        return acc;
      }
      if (!data.compareField.some((cfItem:any) => cfItem.fieldDesc === cur.ANALYSE_ITEM_CODE) && !acc.hash[cur.ANALYSE_ITEM_CODE]) {
        acc.hash[cur.ANALYSE_ITEM_CODE] = true;
        //给返回分析项目重新编号前缀Q拼接compareField规则表的长度(长度是递增的)
        const fieldId = 'Q'+data.compareField.length;
        data.compareField.push({
          fieldCode:fieldId,
          fieldDesc:cur.ANALYSE_ITEM_CODE,
          fieldType:cur.DATA_TYPE == 'N' ? 'number' : 'string'
        })
        const customColumn: any = {
          field: '',
          title: '',
          width: 90,
          hidden: false, //列是否隐藏
          sortable: true, //可排序
          type: "value",
        };
        customColumn.field = fieldId;
        resultCodes.push(fieldId);//存放第一行的数，解决低代码问题
        customColumn.headerName = cur.ANALYSE_ITEM_DESC;//显示中文
        if (cur.DATA_TYPE == 'N'){
          Reflect.set(customColumn,'aggregate','sum')
        }
        acc.result.push(customColumn);
        customColumns.value.push(customColumn);
      }

      return acc;
    }, { result: [], hash: {} }).result;
    erFormHelper.addGridColumn("gridView1",customColumns.value);//----------------添加查询出来的动态列
    console.log("🚀 ~ Columns ~ customColumns:", customColumns);
    //data.gridOptions['customColumns'] = data.gridOptions['customColumns'].concat(customColumns.value);

    //处理grid数据
    const result = new Map(); // 使用 Map 数据结构存储结果
    for (const d of dataRes) {
      const { SAMPLE_NO, DATA_TYPE, ANALYSIS_VALUE_TEXT, ANALYSIS_VALUE, ANALYSE_ITEM_CODE, ...rest } = d;
      const analysisValue = DATA_TYPE === 'C' ? ANALYSIS_VALUE_TEXT : ANALYSIS_VALUE;

      if (!result.has(SAMPLE_NO)) {
        // 如果当前样本号还不存在，则创建新的对象并插入到 Map 中
        const newObj:any = { SAMPLE_NO, ...rest };
        const matchingField = Array.prototype.find.call(data.compareField, (field) => field.fieldDesc === ANALYSE_ITEM_CODE);
        if (matchingField) {
          // 如果当前属性与 compareField 中的 fieldDesc 匹配，则将属性名改为对应的 fieldCode
          newObj[matchingField.fieldCode] = analysisValue;
        } else {
          // 否则，使用 ANALYSE_ITEM_CODE 作为属性名
          newObj[ANALYSE_ITEM_CODE] = analysisValue;
        }
        result.set(SAMPLE_NO, newObj);
      } else {
        // 否则，在原有对象上添加新的属性
        const existingObj = result.get(SAMPLE_NO);
        const matchingField = Array.prototype.find.call(data.compareField, (field) => field.fieldDesc === ANALYSE_ITEM_CODE);
        if (matchingField) {
          existingObj[matchingField.fieldCode] = analysisValue;
        } else {
          existingObj[ANALYSE_ITEM_CODE] = analysisValue;
        }
      }
    }
    // 将 Map 转换为数组
    const resultArray = Array.from(result.values());
    console.log("🚀 ~ // ~ resultArray:", resultArray)

    //解决低代码问题，动态列必须第一行所有数据都存在
    if(resultArray.length>0){
      //给所有的动态列塞默认值
      for (let key of resultCodes) {
        resultCodes[key]=' ';//塞入空格
      }
      mergedObjAll=Object.assign({}, resultCodes, resultCodes);//塞默认值的动态列
      console.log("🚀 mergedObjAll:", mergedObjAll)

      resultArray[0]=Object.assign({},mergedObjAll, resultArray[0]);//原始第一行与有默认值的动态列合并
      console.log("🚀 resultArray-new:", resultArray)
/*      const obj2={YJQ:0};
      const mergedObj=Object.assign({}, resultArray0, obj2);//塞值后的第一行
      console.log("🚀 mergedObj:", mergedObj)
      resultArray[0]=mergedObj;//把新的第一行换到原数据的第一行
      console.log("🚀 resultArray-new:", resultArray)*/
    }

    //gridKey.value = erFormHelper.getGuid();
    nextTick(() => {
      // data.grid1 = erFormHelper.getGrid('gridView1');
      // data.grid1.options.dataSource?.pageSize(200);
      //给grid1绑定事件beforeEdit
      // data.grid1.bind('beforeEdit', (e: any) => {
      //   //判断如果不是新增行并且不是编辑状态就阻止默认行为
      //   if (!e.model.isNew() && !data.grid1EditDis) {
      //     e.preventDefault();
      //   }
      // })
      erFormHelper.messageInfo(`查询完成,共查询到[${resultArray.length}]条数据`)
      // erFormHelper.mergeDataToDataSource(resultArray, data.grid1.options.dataSource,true);
      //erFormHelper.mergeDataToDataTable(resultArray, data.grid1.options.dataSource,true);
      erFormHelper.mergeDataToGrid(resultArray,'gridView1');
    })
    // 设置表格列不可编辑
    erFormHelper.setGridEditable('gridView1',false);
    erFormHelper.setGridEditable('gridView2',false);
    erFormHelper.setGridEditable('gridView3',false);
  }else {
    erFormHelper.messageInfo(`查询完成,共查询到[${dataRes.length}]条数据`)
    erFormHelper.mergeDataToGrid(dataRes,'gridView1');
  }
  console.log("🚀 ~ //customColumns ~ customColumns:", customColumns)
}



//F2查询
const F2_DO = async (e: any) => {
  //获取标签卡组件对象
  // const tabStrip = tabRef.value.kendoWidget();
  //获取当前激活的标签卡title
  //  const title = 'tabStrip.tabGroup.children(".k-state-active").text()';
  const tabs = tabActiveKey.value;
  console.log('tabs',tabs)
  if (tabs == 'tab1'){
    await queryInfo();
  }
  if (tabs == 'tab2'){
    if (!data.clickData){
      erFormHelper.messageWarning('试样号不能为空!')
      return;
    }
    const total = await queryTrain();
    erFormHelper.messageInfo(`查询完成,共查询到[${total}]条数据`)
  }
  if (tabs == 'tab3'){
    if (!data.clickData){
      erFormHelper.messageWarning('试样号不能为空!')
      return;
    }
    const total = await queryAbnormal();
    erFormHelper.messageInfo(`查询完成,共查询到[${total}]条数据`)
  }
};

//F3新增确认
const F3_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView1",(): boolean =>{
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
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1',true,false);

  //数据对象的所有属性名称
  const keys = Object.keys(bd[0]);
  //添加页面号&&根据字段对照表处理数据
  for (let b of bd) {
    b.MAP_CODE = data.MAP_CODE;
    //遍历字段对照表
    for (const cf of data.compareField) {
      //判断keys中是否包含当前字段对照对象的fieldCode
      if (keys.includes(cf.fieldCode)){
        if (cf.fieldType == 'number' && b[cf.fieldCode] == null){
          b[cf.fieldCode] = -9999
        }
        //在原数据对象中添加属性,key为字段对照对象fieldDesc value是根据字段对照对象的fieldCode取原数据对象的值
        b[cf.fieldDesc] = b[cf.fieldCode]
        //最后删除原数据对象原来的属性
        delete b[cf.fieldCode]
      }
    }
  }
  block.pushData(bd,true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir21_ins', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    erFormHelper.setGridToolbarVisible('gridView1', {
      addrow: false,
      copyrow: false,
      delete: false,
      cancel: false,
    });
    if (data.TYPE == '进厂'){
      data.trainTabDis = !data.trainTabDis;
    }
    data.abnormalDis = !data.abnormalDis;
    // 查询最新数据
    await queryInfo();
  }else {
    return false;
  }
};
//F3新增维护
const F3_PRE_DO = async (e: any) => {
  if (data.TYPE == '进厂'){
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  //erFormHelper.setKendoTabStripSelectFirst(tabRef.value.kendoWidget())
  //显示新增操作工具
  erFormHelper.setGridToolbarVisible('gridView1', {
    addrow: true,
    copyrow: true,
    delete: true,
    cancel: true,
    excel: true
  });
  //新增行
  erFormHelper.addRowToGrid('gridView1',true,false);
  //设置可编辑
  erFormHelper.setGridEditable('gridView1',true);
  mode= "F3"
};
//F3新增取消
const F3_CANCEL = async (e: any) => {
  if (data.TYPE == '进厂'){
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  //显示新增操作工具
  erFormHelper.setGridToolbarVisible('gridView1', {
    addrow: false,
    copyrow: false,
    delete: false,
    cancel: false,
    excel: true
  });
  await queryInfo();
};
//F4修改确认
const F4_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView1",(): boolean =>{
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
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1',true);

  //数据对象的所有属性名称
  const keys = Object.keys(bd[0]);
  //添加页面号&&根据字段对照表处理数据
  for (let b of bd) {
    b.MAP_CODE = data.MAP_CODE;
    //遍历字段对照表
    for (const cf of data.compareField) {
      //判断keys中是否包含当前字段对照对象的fieldCode
      if (keys.includes(cf.fieldCode)){
        if (cf.fieldType == 'number' && b[cf.fieldCode] == null){
          b[cf.fieldCode] = -9999
        }
        //在原数据对象中添加属性,key为字段对照对象fieldDesc value是根据字段对照对象的fieldCode取原数据对象的值
        b[cf.fieldDesc] = b[cf.fieldCode]
        //最后删除原数据对象原来的属性
        delete b[cf.fieldCode]
      }
    }
  }
  block.pushData(bd,true);
  inInfo.addBlock(block);

  // 调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir21_upd', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    if (data.TYPE == '进厂'){
      data.trainTabDis = !data.trainTabDis;
    }
    data.abnormalDis = !data.abnormalDis;
    // 查询最新数据
    await queryInfo();
    data.grid1EditDis = false;
  }else {
    return false;
  }
};
//F4修改维护
const F4_PRE_DO = async (e: any) => {
  if (data.TYPE == '进厂'){
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  // erFormHelper.setKendoTabStripSelectFirst(tabRef.value.kendoWidget());
  data.grid1EditDis = true;
  //设置可编辑
  erFormHelper.setGridEditable('gridView1',true);
  mode= ""
};
//F4修改取消
const F4_CANCEL = async (e: any) => {
  if (data.TYPE == '进厂'){
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  await queryInfo();
  data.grid1EditDis = false;
};
//F5删除确认
const F5_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1',true);

  //数据对象的所有属性名称
  const keys = Object.keys(bd[0]);
  //添加页面号&&根据字段对照表处理数据
  for (let b of bd) {
    //遍历字段对照表
    for (const cf of data.compareField) {
      //判断keys中是否包含当前字段对照对象的fieldCode
      if (keys.includes(cf.fieldCode)){
        //在原数据对象中添加属性,key为字段对照对象fieldDesc value是根据字段对照对象的fieldCode取原数据对象的值
        b[cf.fieldDesc] = b[cf.fieldCode]
        //最后删除原数据对象原来的属性
        delete b[cf.fieldCode]
      }
    }
  }

  block.pushData(bd,true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir21_del', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    if (data.TYPE == '进厂'){
      data.trainTabDis = !data.trainTabDis;
    }
    data.abnormalDis = !data.abnormalDis;
    // 查询最新数据
    await queryInfo();
  }else {
    return false;
  }
};
//F5删除维护
const F5_PRE_DO = async (e: any) => {
  if (data.TYPE == '进厂'){
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  //erFormHelper.setKendoTabStripSelectFirst(tabRef.value.kendoWidget())
};
//F5删除取消
const F5_CANCEL = async (e: any) => {
  if (data.TYPE == '进厂'){
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  await queryInfo();
};
//F6质量判定确认
const F6_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1',true);
  block.pushData(bd,true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir21_pd', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
  }else {
    return false;
  }
};
//F6质量判定维护
const F6_PRE_DO = async (e: any) => {
};
//F6质量判定取消
const F6_CANCEL = async (e: any) => {
  await queryInfo();
};
//F12质量异议确认
const F12_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView1",(): boolean =>{
    return true;
  });
  if (erFormHelper.getGridSelectRows('gridView1').length != 1) {
    erFormHelper.messageWarning('质量异议要求选择且仅能一条数据,请检查选择数据!');
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkRequiredInput('LayoutGroupFilter2')) {
    erFormHelper.messageWarning('质量异议原因及备注不可以为空！请填写后再提交!');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1',true);

  //数据对象的所有属性名称
  const keys = Object.keys(bd[0]);
  //添加质量异议
  for (let b of bd) {
    b.RMA_DESCRIPTION = erFormHelper.getControlValue('LayoutGroupFilter2', 'RMA_DESCRIPTION');
    //遍历字段对照表
    for (const cf of data.compareField) {
      //判断keys中是否包含当前字段对照对象的fieldCode
      if (keys.includes(cf.fieldCode)){
        //在原数据对象中添加属性,key为字段对照对象fieldDesc value是根据字段对照对象的fieldCode取原数据对象的值
        b[cf.fieldDesc] = b[cf.fieldCode]
        //最后删除原数据对象原来的属性
        delete b[cf.fieldCode]
      }
    }
    await queryInfo();
  }

  block.pushData(bd,true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir21_yy', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    if (data.TYPE == '进厂'){
      data.trainTabDis = !data.trainTabDis;
    }
    data.abnormalDis = !data.abnormalDis;
    data.yyDis = false;
  }else {
    return false;
  }
};
//F12质量异议维护
const F12_PRE_DO = async (e: any) => {
  if (data.TYPE == '进厂'){
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  data.yyDis = true;
  erFormHelper.setControlValue('LayoutGroupFilter2', 'RMA_DESCRIPTION', '');//清空质量异议内容
  //清空数据
  //erFormHelper.setKendoUiWidgetEmptyValue('LayoutGroupFilter2', 'SAMPLE_NO');//试样号
  //设置可编辑
  // erFormHelper.setGridEditable('gridView1',true);
  // erFormHelper.setKendoTabStripSelectFirst(tabRef.value.kendoWidget())
};
//F12质量异议取消
const F12_CANCEL = async (e: any) => {
  if (data.TYPE == '进厂'){
    data.trainTabDis = !data.trainTabDis;
  }
  data.abnormalDis = !data.abnormalDis;
  data.yyDis = false;
  await queryInfo();
};
//切换标签时主动调查询
const changeTab = (key: any) => {
  console.log('changeTab进来了',key);
  if (key == "tab2") {
    queryTrain();
  }else if (key == "tab3") {
    queryAbnormal();
  }
};
//grid1焦点行事件
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
  data.clickData = e.data
  console.log("🚀 ~ gridView1Click ~ e:", e.data)
  if (e.data?.get('id') === '') {
    return;
  }
  if (e.data?.get('INSPECT_BATCH_NO') === '') {
    return;
  }
  if (data.TYPE == '进厂'){
    await queryTrain();
  }
  await queryAbnormal();
};


//查询车次清单
const queryTrain = async () => {
  console.log("执行了queryTrain",1);
  console.log("data.clickData",data.clickData);
  if (!data.clickData){
    erFormHelper.mergeDataToGrid([], 'gridView2');
    return;
  }
  console.log("执行了queryTrain",2);
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.addColumn('INSPECT_BATCH_NO');
  block.addRow({INSPECT_BATCH_NO:data.clickData.INSPECT_BATCH_NO});//批次号--暂定根据批次号查询
  inInfo.addBlock(block);

  const outInfo = await erFormHelper.callService('qmir21_inq2', inInfo, true, true);
  console.log("执行了queryTrain结果",outInfo);
  erFormHelper.mergeDataToGrid(outInfo.blocks['Table0'], 'gridView2');
  return outInfo.blocks['Table0'].data.length;
}

//查询判定异常数据
const queryAbnormal = async () => {
  if (!data.clickData){
    erFormHelper.mergeDataToGrid([], 'gridView3');
    return;
  }
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.addColumn('SAMPLE_NO');
  block.addRow({SAMPLE_NO:data.clickData.SAMPLE_NO});
  inInfo.addBlock(block);

  const outInfo = await erFormHelper.callService('qmir21_inq1', inInfo, true, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['Table0'], 'gridView3');
  return outInfo.blocks['Table0'].data.length;
}
//F9复样/增样--确认
const F9_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
  inInfo.addBlock(bd, 'Table0');
  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir27_fy', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
  } else {
    return false;
  }
  // 查询最新数据
  queryInfo();
};
//F9复样/增样--维护
const F9_PRE_DO = async (e: any) => {
};
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

