<template>
  <xr-ef-form @ready="efFormReady" :f2-do="F2_DO"
              @closeDialog="closeDialog" :in-dialog-form-name="'XQMIR13POP'">
    <template v-if="initializeFlag === 1">
      <er-layout :er-form-helper-prop="erFormHelper" :config-id="'LayoutGroupFilter'"></er-layout>
      <v-splitter style="height: 100%" class="default-theme">
        <v-splitter-pane size="80">
          <xr-ef-form-base>
            <xr-ef-panel title="检验委托数据" padding="0 0 5px 5px">
              <template #customButtonSlot>

              </template>
              <template #contentSlot>
                <er-grid @erGridReady="erGrid1Ready" :er-form-helper-prop="erFormHelper" :config-id="'gridView1'"
                  @click="gridView1Click" :options="{ enableClick: true }">
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
              <er-grid @erGridReady="erGrid1Ready" :er-form-helper-prop="erFormHelper" :config-id="'gridView2'">
              </er-grid>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
      </v-splitter>
    </template>
  </xr-ef-form>
</template>



<script lang="ts" setup: (props, { emit })>
import {
  defineComponent,
  onMounted,
  ref,
  nextTick,
  getCurrentInstance,
  reactive
} from "vue";

import { EI } from "EIX/ei";
import { ER } from "ERX/Er";
import erGrid from "ERX/ErGrid";
import xrEfPanel from "EFX/xrEfPanel";
import xrEfForm from "EFX/xrEfForm";
import { resolve } from "path";
import erLayout from 'ERX/ErLayout';
import { Grid } from 'ant-design-vue';

export default defineComponent({
  name: "XQMIR13POP",
  components: { erLayout, erGrid, xrEfForm, xrEfPanel },
  props: {
    openInDialog: {
      type: Boolean,
      default: false,
    }
  },

  // 1.父画面传递数据-注册emit事件
  emits: ["getChildInfo"],
  setup: (props, { emit }) => {

    // 获取画面的分区信息及设置画面初始化service
    const formPartition = ref("");
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    const erFormHelper = new ER.FormHelper();
    const initializeService = "qmir_form_get";

    console.log("传入参数:", props);

    //页面变量
    const data: any = reactive({
      grid1: Grid,
      grid2: Grid,
      gridToolbar1: [],
      clickData: {}
    });

    // 变量定义
    let formName = "XQMIR13POP";
    const initializeFlag = ref(0);
    let BASE_RESOURCE = ""; // 数据区分
    // 查询条件父容器
    const parentComQuery = ref<HTMLElement | null>();

    let gridView1!: any;
    let gridView2!: any;

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition.value, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
          F2_DO(null);
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    const efFormReady = async (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition.value = efFormInfo.value.formPartition;
      // 初始化低代码工具类
      initializePage();

    };

    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid("gridView1");
      gridView2 = erFormHelper.getGrid("gridView2");

      data.grid1 = erFormHelper.getGrid('gridView1');
      data.grid2 = erFormHelper.getGrid('gridView2');


      F2_DO(null);
    };

    //grid1行点击事件
    const gridView1Click = async (e: any) => {
      console.log(e.data?.get('WORK_SEQ_NO'));
      console.log(efFormIsReady.value);
      if (e.data?.get('WORK_SEQ_NO') === '') {
        return;
      }
      console.log(e.data);

      if (efFormIsReady.value == false) {
        return;
      }
      data.clickData = e.data
      await queryAnalysis(e.data?.get('WORK_SEQ_NO'));
    };


    //查询分析项目
    const queryAnalysis = async (workSeqNo: string) => {
      const inInfo = new EI.EIInfo();
      const block = new EI.EiBlock('Table0');
      block.addColumn('WORK_SEQ_NO');
      block.addRow({
        WORK_SEQ_NO: workSeqNo
      });
      inInfo.addBlock(block);
      const outInfo = await erFormHelper.callService('qmir13_inq1', inInfo, false, true);
      erFormHelper.mergeDataToGrid(outInfo.blocks['TQMIR14'], 'gridView2');
    }
    onMounted(() => {

    });

    const closeDialog = () => {
      console.log("168closeDialog");

      emit("getChildInfo", {
        info: erFormHelper.getGridSelectRowsAsBlock("gridView1"),
      });    
      

      console.log("传递完数据");
    };


    /**
     * F2 查询
     * @param e
     */
    //查询表格数据
    const queryInfo = async () => {
      // erFormHelper.queryDataByDataSource('gridView1', { filterConfigId: 'LayoutGroupFilter'});
      const layoutValue: any = erFormHelper.getAllControlValue('LayoutGroupFilter');
      const inInfo = new EI.EIInfo();
      const block = new EI.EiBlock('Table0');
      block.pushData(layoutValue, true);
      inInfo.addBlock(block);
      const outInfo = await erFormHelper.callService('qmir13_inq', inInfo, false, true, false, formPartition.value);
      console.log("🚀 ~ queryInfo ~ outInfo:", outInfo)
      erFormHelper.mergeDataToGrid(outInfo.getBlock(0), 'gridView1');
      erFormHelper.setGridEditable('gridView1', false);
      erFormHelper.setGridEditable('gridView2', false);
    };

    //F2查询
    const F2_DO = async (e: any) => {
      queryInfo();
    };
    return {
      erFormHelper,
      initializeFlag,
      erGrid1Ready,
      efFormReady,
      F2_DO,
      closeDialog,
      gridView1Click,
      data
    };
  },
});

</script>