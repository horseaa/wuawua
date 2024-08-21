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
      :f7-cancel="F7_CANCEL"
      :f8-do="F8_DO"
      :f8-pre-do="F8_PRE_DO"
      :f8-cancel="F8_CANCEL">
    <template v-if="initializeFlag === 1">
      <v-splitter style="height: 100%" class="default-theme">
        <v-splitter-pane>
          <er-layout
              style="margin: 0"
              :er-form-helper-prop="erFormHelper"
              :config-id="'LayoutGroupFilter'"></er-layout>
          <xr-ef-panel title="查询结果"
                       padding="0 5px 5px 5px"
                       style="height:88%">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <er-grid
                  @erGridReady="erGrid1Ready"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'gridView1'"
                  @focus-changed="gridView1FocusChanged"
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
                       style="height:88%">
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
                       style="height:88%">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <er-grid
                  @erGridReady="erGrid1Ready"
                  :er-form-helper-prop="erFormHelper"
                  @focus-changed="gridView3FocusChanged"
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
  name: 'XQMIR012',
  components: { erLayout,erGrid, xrEfForm, xrEfPanel },
};
</script>

<script lang="ts" setup>
// 获取画面的分区信息及设置画面初始化service
const initializeService = 'qmir_form_get';

// 变量定义
const formName = 'XQMIR012';
const erFormHelper =new ER.FormHelper();
const initializeFlag = ref(0);
const efFormInfo = ref<{ [key: string]: any }>({});
const efFormIsReady = ref(false);
const formPartition = ref("");

let grid1!:any;
let grid2!:any;
let grid3!:any;
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
const gridView3FocusChanged = (e: any) => {
  if (e) {
    if (e.rowChanged && e.data && mode== "F6") {
      // 判断是否是新增行
      if (e.data.isNew === true) {
        erFormHelper.setGridEditable('gridView3',true);
      } else {
        erFormHelper.setGridEditable('gridView3',false);
      }
    }
  }
};
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
      //LayoutGroupFilter2过滤按钮事件
      const filterBtn1 = erFormHelper.getControl('LayoutGroupFilter2','FILTER');
      filterBtn1 && filterBtn1.bind('click', (e: ButtonType) => queryRelation());
      //LayoutGroupFilter3过滤按钮事件
      const filterBtn2 = erFormHelper.getControl('LayoutGroupFilter3','FILTER');
      filterBtn2 && filterBtn2.bind('click', (e: ButtonType) => queryRelation());

      //LayoutGroupFilter2不包含按钮事件
      const notContain = erFormHelper.getControl('LayoutGroupFilter2','NOT_CONTAIN');
      notContain && notContain.bind('click', (e: ButtonType) => updateRelation(false));
      //LayoutGroupFilter3包含按钮事件
      const contain = erFormHelper.getControl('LayoutGroupFilter3','CONTAIN');
      contain && contain.bind('click', (e: ButtonType) => updateRelation(true));

      nextTick(()=>{//下拉框允许输入
        //CMUtil.dropInupt(erFormHelper,'LayoutGroupFilter','DATA_RESOURCE');
          // 设置表格列不可编辑
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
}

//F2查询
const F2_DO = async (e: any) => {
  await queryT1();
  mode = " ";
  erFormHelper.setGridEditable('gridView1',false);
  erFormHelper.setGridEditable('gridView2',false);
  erFormHelper.setGridEditable('gridView3',false);
};

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
      "qmir00_ins",
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
    queryT1();
  } else {
    return false;
  }
  mode = " ";
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
  queryT1();
  mode = " ";
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
  const bd = erFormHelper.getGridSelectRowsAsBlock("gridView1");
  inInfo.addBlock(bd, "Table0");

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
      "qmir00_upd",
      inInfo,
      true,
      true
  );

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess("操作成功");
    // 设置表格列不可编辑
    erFormHelper.setGridEditable("gridView1", false);
    // 查询最新数据
    queryT1();
  } else {
    return false;
  }
};
//F4修改维护
const F4_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable("gridView1", true);
  mode = "";
};
//F4修改取消
const F4_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable("gridView1", false);
  queryT1();
};

//F5删除确认
const F5_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows("gridView1").length === 0) {
    erFormHelper.messageWarning("至少选择一条数据");
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock("gridView1");
  inInfo.addBlock(bd, "Table0");

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
      "qmir00_del",
      inInfo,
      true,
      true
  );

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess("操作成功");
    // 查询最新数据
    queryT1();
  } else {
    return false;
  }
};
//F5删除维护
const F5_PRE_DO = async (e: any) => {
};
//F5删除取消
const F5_CANCEL = async (e: any) => {
  queryT1();
};

//F6新增确定
const F6_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView3", (): boolean => {
    return true;
  });
  if (erFormHelper.getGridSelectRows("gridView3").length === 0) {
    erFormHelper.messageWarning("至少选择一条数据");
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkGridInput("gridView3")) {
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock("gridView3");
  inInfo.addBlock(bd, "Table0");

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
      "qmir01_ins",
      inInfo,
      true,
      true
  );

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess("操作成功");
    erFormHelper.setGridToolbarVisible("gridView3", {
      addrow: false,
      copyrow: false,
      delete: false,
      cancel: false,
    });
    // 设置表格列不可编辑
    erFormHelper.setGridEditable("gridView3", false);
  } else {
    return false;
  }
  mode = " ";
  await queryRelation();
};
//F6新增维护
const F6_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable("gridView3", true);
  //显示新增操作工具
  erFormHelper.setGridToolbarVisible("gridView3", {
    addrow: true,
    copyrow: true,
    delete: true,
    cancel: true,
    excel: true,
  });
  //新增行
  erFormHelper.addRowToGrid("gridView3", true, false);
  mode = "F6";
};
//F6新增取消
const F6_CANCEL = async (e: any) => {
  erFormHelper.setGridToolbarVisible("gridView3", {
    addrow: false,
    copyrow: false,
    delete: false,
    cancel: false,
  });
  // 设置表格列不可编辑
  erFormHelper.setGridEditable("gridView3", false);
  await queryRelation();
};

//F7修改确认
const F7_DO = async (e: any) => {
  //结束 Grid 的编辑状态,否则无法取到最后一个焦点单元格的焦点
  erFormHelper.stopGridEditing("gridView3", (): boolean => {
    return true;
  });
  if (erFormHelper.getGridSelectRows("gridView3").length === 0) {
    erFormHelper.messageWarning("至少选择一条数据");
    return false;
  }

  //检验必输项
  if (!erFormHelper.checkGridInput("gridView3")) {
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock("gridView3");
  inInfo.addBlock(bd, "Table0");

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
      "qmir01_upd",
      inInfo,
      true,
      true
  );

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess("操作成功");
    // 设置表格列不可编辑
    erFormHelper.setGridEditable("gridView3", false);
    // 查询最新数据
    await queryRelation();
  } else {
    return false;
  }
  mode = " ";
};
//F7修改维护
const F7_PRE_DO = async (e: any) => {
  //设置可编辑
  erFormHelper.setGridEditable("gridView3", true);
  mode = "";
};
//F7修改取消
const F7_CANCEL = async (e: any) => {
  // 设置表格列不可编辑
  erFormHelper.setGridEditable("gridView3", false);
  await queryRelation();
};

//F5删除确认
const F8_DO = async (e: any) => {
  if (erFormHelper.getGridSelectRows("gridView3").length === 0) {
    erFormHelper.messageWarning("至少选择一条数据");
    return false;
  }

  const inInfo = new EI.EIInfo();
  const bd = erFormHelper.getGridSelectRowsAsBlock("gridView3");
  inInfo.addBlock(bd, "Table0");

  //调用后台服务保存数据
  const outInfo = await erFormHelper.callService(
      "qmir01_del",
      inInfo,
      true,
      true
  );

  if (outInfo.sys.status >= 0) {
    erFormHelper.messageSuccess("操作成功");
    // 查询最新数据
    await queryRelation();
  } else {
    return false;
  }
};
//F8删除维护
const F8_PRE_DO = async (e: any) => {
};
//F8删除取消
const F8_CANCEL = async (e: any) => {
  await queryRelation();
};













//grid1的单击事件
const gridView1Click = async (e: any) => {
  if (e.data?.get('id') === '') {
    return;
  }
  filterCol.value = e.data?.get('DATA_RESOURCE');
  if (mode == " ") {
    await queryRelation();
  }
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
