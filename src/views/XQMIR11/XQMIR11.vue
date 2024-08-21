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
    :f8-cancel="F8_CANCEL"
    :f9-do="F9_DO"
    :f9-pre-do="F9_PRE_DO"
    :f9-cancel="F9_CANCEL"
            :f10-do="F10_DO"
        :f10-pre-do="F10_PRE_DO"
        :f10-cancel="F10_CANCEL"
    :f11-do="F11_DO"
    :f11-pre-do="F11_PRE_DO"
    :f11-cancel="F11_CANCEL"

    :f12-do="F12_DO"
    :f12-pre-do="F12_PRE_DO"
    :f12-cancel="F12_CANCEL">
    <template v-if="initializeFlag === 1">
      <er-layout 
          :er-form-helper-prop="erFormHelper"
          :config-id="'LayoutGroupFilter'"></er-layout>
      <v-splitter style="height: 100%" class="default-theme">

        <v-splitter-pane size="55">
            <xr-ef-panel title="判定标准"
                        padding="0 0 0 5px">
              <template #customButtonSlot>

              </template>
              <template #contentSlot>
                <er-grid    @erGridReady="erGrid1Ready"
                            :er-form-helper-prop="erFormHelper"
                            :config-id="'gridView1'"
                            :toolbar-options="data.gridToolbar1"
                            @focus-changed="gridView1FocusChanged"
                            :options="{enableClick:true}"
                            @click="gridView1Click">
                </er-grid>
              </template>
            </xr-ef-panel>
        </v-splitter-pane>
        <v-splitter-pane  size="45">
            <xr-ef-panel title="判定标准包含的分析项目"
                        padding="0 5px 0 0">
              <template #customButtonSlot>

              </template>
              <template #contentSlot>
                <er-grid 
                            @erGridReady="erGrid1Ready"
                            :er-form-helper-prop="erFormHelper"
                            :toolbar-options="data.gridToolbar2"
                            @focus-changed="gridView2FocusChanged"
                            :config-id="'gridView2'">
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
// import {CMUtil} from "@/utils/CMUtil";
import erGrid from "ERX/ErGrid";
import xrEfPanel from "EFX/xrEfPanel";
import xrEfForm from "EFX/xrEfForm";
import { Ref, nextTick, onMounted, reactive, ref } from 'vue';
import { Grid } from 'ant-design-vue';

export default {
  name: 'XQMIR11',
  components: { erLayout,erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
const initializeService = 'qmir_form_get';

// 变量定义
const formName = ref('XQMIR11');
const erFormHelper =new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");
const filterCol: Ref<any> = ref();
  
//页面变量
const data:any = reactive({
  grid1:Grid,
  grid2:Grid,
  grid1EditDis:false,
  grid2EditDis:false,
  gridToolbar1:[],
  gridToolbar2:[],
  clickData:null,
  TYPE:'ALL',
  MAP_CODE:'QMIR11'
})

const erGrid1Ready = () => {
  data.grid1 = erFormHelper.getGrid('gridView1');
  data.grid2 = erFormHelper.getGrid('gridView2');
}

let mode = ""; // 当前操作的模式：主要用来区分是新增还是删除
const gridView1FocusChanged = (e: any) => {
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
};
const gridView2FocusChanged = (e: any) => {
  if (e) {
    if (e.rowChanged && e.data && mode== "F7") {
      // 判断是否是新增行
      if (e.data.isNew === true) {
        erFormHelper.setGridEditable('gridView2',true);
      } else {
        erFormHelper.setGridEditable('gridView2',false);
      }
    }
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
  if (paras.formParams?.form_name) formName.value = paras.formParams['form_name'];
  if (paras.formParams?.MAP_CODE) data.MAP_CODE = paras.formParams['MAP_CODE'];
  if (paras.formParams?.TYPE) data.TYPE = paras.formParams['TYPE'];

  const initialResult = await erFormHelper.Initialize(formPartition.value, formName.value, '', initializeService);
  if (initialResult.flag >= 0) {
    erFormHelper.setGridToolbarVisible('gridView1', {
        addrow: false,
        copyrow: false,
        delete: false,
        cancel: false,
        excel: true
      });
    erFormHelper.setGridToolbarVisible('gridView2', {
        addrow: false,
        copyrow: false,
        delete: false,
        cancel: false,
        excel: true
      });
    initializeFlag.value = 1;
    nextTick(() => {
      // 获取画面上的主要控件信息
      // 设置每页记录数为200
      // data.grid1.options.dataSource?.pageSize(200);
      // data.grid2.options.dataSource?.pageSize(200);
      //给grid1绑定事件beforeEdit
/*      data.grid1.bind('beforeEdit', (e: any) => {
        //判断如果不是新增行并且不是编辑状态就阻止默认行为
        if (!e.model.isNew() && !data.grid1EditDis) {
          e.preventDefault();
        }
      })
      //给grid2绑定事件beforeEdit
      data.grid2.bind('beforeEdit', (e: any) => {
        //判断如果不是新增行并且不是编辑状态就阻止默认行为
        if (!e.model.isNew() && !data.grid2EditDis) {
          e.preventDefault();
        }
      })*/
    });
  } else {
    erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
  }
};

//查询
const queryInfo = async () => {
  const layoutValue: any = erFormHelper.getAllControlValue('LayoutGroupFilter');
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  layoutValue.INDEX_FROM = 0
  layoutValue.RETURN_NUM = 10000
  layoutValue.MAP_CODE = data.MAP_CODE
  layoutValue.TYPE = data.TYPE
  block.pushData(layoutValue,true);
  inInfo.addBlock(block);

  const outInfo = await erFormHelper.callService('qmir11_inq', inInfo, true, true);
  erFormHelper.mergeDataToGrid(outInfo.blocks['Table0'].data,'gridView1');
  erFormHelper.messageInfo(`查询完成,共查询到[${outInfo.blocks['Table0'].data.length}]条数据`)
  erFormHelper.setGridEditable('gridView1',false);
  erFormHelper.setGridEditable('gridView2',false);
};

//F2查询
const F2_DO = async (e: any) => {
  await queryInfo();
};

//F3标准增确认
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
  for (const b of bd) {
    //b.EFFECT_DATE = CMUtil.formatDate(b.EFFECT_DATE,'yyyyMMdd');
  }
  block.pushData(bd,true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir11_ins', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    erFormHelper.setGridToolbarVisible('gridView1', {
        addrow: false,
        copyrow: false,
        delete: false,
        cancel: false,
      });
    // 查询最新数据
    await queryInfo();
  }else {
    return false;
  }
};
//F3标准增维护
const F3_PRE_DO = async (e: any) => {
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
//F3标准增取消
const F3_CANCEL = async (e: any) => {
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

//F4标准改确认
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
/*   for (const b of bd) {
    if (b.CHECK_FLAG != '1'){
      erFormHelper.messageWarning('状态不为编制中，不允许删除');
      return false;
    }
    //b.EFFECT_DATE = CMUtil.formatDate(b.EFFECT_DATE,'yyyyMMdd');
  } */
  block.pushData(bd,true);
  inInfo.addBlock(block);

  // 调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir11_upd', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
    data.grid1EditDis = false;
  }else {
    return false;
  }
};
//F4标准改维护
const F4_PRE_DO = async (e: any) => {
  data.grid1EditDis = true;
  //设置可编辑
  erFormHelper.setGridEditable('gridView1',true);
  mode= " "
};
//F4标准改取消
const F4_CANCEL = async (e: any) => {
  await queryInfo();
  data.grid1EditDis = false;
};

//F5标准删确认
const F5_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1',true);
  block.pushData(bd,true);
  inInfo.addBlock(block);

  // 调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir11_del', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
  }else {
    return false;
  }
};
//F5标准删维护
const F5_PRE_DO = async (e: any) => {};
//F5标准删取消
const F5_CANCEL = async (e: any) => {};

//F7项目增确认
const F7_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView2",(): boolean =>{
    return true;
  });
  if (erFormHelper.getGridSelectRows('gridView2').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkGridInput('gridView2')) {
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd1 = erFormHelper.getGridSelectRows('gridView2',true,false);
  for (const b1 of bd1) {
    b1.JDG_NEED_FLAG = b1.JDG_NEED_FLAG ? '1' : '0';
  }
  block.pushData(bd1,true);
  inInfo.addBlock(block);

  const block1 = new EI.EiBlock('Table1');
  block1.addColumn('WORK_SEQ_NO');
  block1.addRow({WORK_SEQ_NO:data.clickData.WORK_SEQ_NO});
  inInfo.addBlock(block1);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir11_ins1', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    erFormHelper.setGridToolbarVisible('gridView2',
        {
        addrow: false,
        copyrow: false,
        delete: false,
        cancel: false,
      });
      
    // 查询最新数据
    await queryAnalysis();
  }else {
    return false;
  }
};
//F7项目增维护
const F7_PRE_DO = async (e: any) => {
  if (data.clickData == null){
    erFormHelper.messageWarning('请单击要操作的标准!')
    return false;
  }
  if (data.clickData.CHECK_FLAG != '1'){
    erFormHelper.messageWarning('状态已是提交状态，不可进行维护!')
    return false;
  }
  //显示新增操作工具
  erFormHelper.setGridToolbarVisible('gridView2',
      {
        addrow: true,
        copyrow: true,
        delete: true,
        cancel: true,
        excel: true
      });
  //新增行
  erFormHelper.addRowToGrid('gridView2',true,false);
  //设置可编辑
  erFormHelper.setGridEditable('gridView2',true);
  mode= "F7"
};
//F7项目增取消
const F7_CANCEL = async (e: any) => {
  //显示新增操作工具
  erFormHelper.setGridToolbarVisible('gridView2',
      {
        addrow: false,
        copyrow: false,
        delete: false,
        cancel: false,
        excel: true
      });
  await queryAnalysis();
};

//F8项目改确认
const F8_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView2",(): boolean =>{
    return true;
  });
  if (erFormHelper.getGridSelectRows('gridView2').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkGridInput('gridView2')) {
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd1 = erFormHelper.getGridSelectRows('gridView2',true,false);
 /* for (const b1 of bd1) {
    b1.JDG_NEED_FLAG = b1.JDG_NEED_FLAG ? '1' : '0';
  }*/
  block.pushData(bd1,true);
  inInfo.addBlock(block);

  const block1 = new EI.EiBlock('Table1');
  block1.addColumn('WORK_SEQ_NO');
  block1.addRow({WORK_SEQ_NO:data.clickData.WORK_SEQ_NO});
  inInfo.addBlock(block1);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir11_upd1', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryAnalysis();
    data.grid2EditDis = false;
  }else {
    return false;
  }
};
//F8项目改维护
const F8_PRE_DO = async (e: any) => {
  if (data.clickData == null){
    erFormHelper.messageWarning('请单击要操作的标准!')
    return false;
  }
  if (data.clickData.CHECK_FLAG != '1'){
    erFormHelper.messageWarning('状态已是提交状态，不可进行维护!')
    return false;
  }
  data.grid2EditDis = true;
  //设置可编辑
  erFormHelper.setGridEditable('gridView2',true);
  mode= ""
};
//F8项目改取消
const F8_CANCEL = async (e: any) => {
  await queryAnalysis();
  data.grid2EditDis = false;
};

//F9项目删确认
const F9_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView2').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd1 = erFormHelper.getGridSelectRows('gridView2',true,false);
  for (const b1 of bd1) {
    b1.JDG_NEED_FLAG = b1.JDG_NEED_FLAG ? '1' : '0';
  }
  block.pushData(bd1,true);
  inInfo.addBlock(block);

  const block1 = new EI.EiBlock('Table1');
  block1.addColumn('WORK_SEQ_NO');
  block1.addRow({WORK_SEQ_NO:data.clickData.WORK_SEQ_NO});
  inInfo.addBlock(block1);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir11_del1', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryAnalysis();
  }else {
    return false;
  }
};
//F9项目删维护
const F9_PRE_DO = async (e: any) => {
  if (data.clickData == null){
    erFormHelper.messageWarning('请单击要操作的标准!')
    return false;
  }
  if (data.clickData.CHECK_FLAG != '1'){
    erFormHelper.messageWarning('状态已是提交状态，不可进行维护!')
    return false;
  }
};
//F9项目删取消
const F9_CANCEL = async (e: any) => {
  await queryAnalysis();
};
//F10作废确认
const F10_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1', true, false);
  block.pushData(bd, true);
  inInfo.addBlock(block);

  const block1 = new EI.EiBlock('Table1');
  block1.addColumn('CHECK_FLAG');
  block1.addRow({ CHECK_FLAG: 0 })
  inInfo.addBlock(block1);


  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir11_zf', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
  } else {
    return false;
  }
};
//F10作废维护
const F10_PRE_DO = async (e: any) => { };
//F10作废取消
const F10_CANCEL = async (e: any) => {
      // 查询最新数据
  await queryInfo();
 };
//F11提交确认
const F11_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1',true,false);
  for (let b of bd) {
    if (b.CHECK_FLAG == '2'){
      erFormHelper.messageWarning('状态已是提交状态，不可进行再次提交!')
      return false;
    }
    b.JDG_NEED_FLAG = b.JDG_NEED_FLAG ? '1' : '0';
    //b.EFFECT_DATE = CMUtil.formatDate(b.EFFECT_DATE,'yyyyMMdd');
  }
  block.pushData(bd,true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir11_snd', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
  }else {
    return false;
  }
};
//F11提交维护
const F11_PRE_DO = async (e: any) => {};
//F11提交取消
const F11_CANCEL = async (e: any) => {
      // 查询最新数据
  await queryInfo();
};

//F11收回确认
const F12_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
    erFormHelper.messageWarning('至少选择一条数据');
    return false;
  }

  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  const bd = erFormHelper.getGridSelectRows('gridView1',true,false);
  for (let b of bd) {
    b.JDG_NEED_FLAG = b.JDG_NEED_FLAG ? '1' : '0';
    //b.EFFECT_DATE = CMUtil.formatDate(b.EFFECT_DATE,'yyyyMMdd');
  }
  block.pushData(bd,true);
  inInfo.addBlock(block);

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService('qmir11_rcv', inInfo, true, true);
  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess('操作成功');
    // 查询最新数据
    await queryInfo();
  }else {
    return false;
  }
};
//F11收回维护
const F12_PRE_DO = async (e: any) => {};
//F11收回取消
const F12_CANCEL = async (e: any) => {
      // 查询最新数据
  await queryInfo();
};

//grid1点击事件
const gridView1Click = async (e: any) => {
  // if (e.data?.get('id') === '' || data.clickData && data.clickData.id == e.data?.get('id')) {
  //   return;
  // }
  //获取点击行
  filterCol.value = e.data?.get('MAT_CODE');
  console.log("🚀 ~ gridView1Click ~ filterCol.value:", filterCol.value)
  if (filterCol.value === undefined) {
    erFormHelper.messageWarning('请点击某一行数据!');
    return;
  }

  data.clickData = e.data;
  await queryAnalysis();
};

//查询分析项目
const queryAnalysis = async () => {
  const inInfo = new EI.EIInfo();
  const block = new EI.EiBlock('Table0');
  block.addColumn('WORK_SEQ_NO')
  block.addRow({WORK_SEQ_NO:data.clickData.WORK_SEQ_NO})
  inInfo.addBlock(block);

  const outInfo = await erFormHelper.callService('qmir11_inq1', inInfo, true, true);
  const dataRes = outInfo.blocks['Table0'].data;
  for (const res of dataRes || []) {
    res.JDG_NEED_FLAG = res.JDG_NEED_FLAG == '1';
  }
  erFormHelper.mergeDataToGrid(dataRes,'gridView2');
  erFormHelper.setGridEditable('gridView2',false);
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
