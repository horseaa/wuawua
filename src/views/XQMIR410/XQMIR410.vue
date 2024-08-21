
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
                :f5-cancel="F5_CANCEL">
      <template v-if="initializeFlag === 1">
      <er-layout
                :er-form-helper-prop="erFormHelper"
                :config-id="'LayoutGroupFilter'"></er-layout>
      <xr-ef-panel title="数据区"
                   padding="0 5px 5px 5px"
                   :open-header-show="false">
        <template #customButtonSlot>

        </template>
        <template #contentSlot>
          <er-grid 
                  @erGridReady="erGrid1Ready"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'gridView1'"
                  :options="{enableClick:true}"
                  >
          </er-grid>
        </template>
      </xr-ef-panel>
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
    name: 'XQMIR410',
    components: { erLayout,erGrid, xrEfForm, xrEfPanel },
  };
  </script>

  <script lang="ts" setup>
  // 获取画面的分区信息及设置画面初始化service
  const initializeService = 'qmir_form_get';

  // 变量定义
  const formName = 'XQMIR410';
  const erFormHelper =new ER.FormHelper();
  const initializeFlag = ref(0);
  const efFormInfo = ref<{ [key: string]: any }>({});
  const efFormIsReady = ref(false);
  const formPartition = ref("");


  //页面变量
  const data:any = reactive({
    grid1:Grid,
    gridToolbar1:[],
    //div禁用样式
    disableStyle:{
      pointerEvents:'none',
      userSelect:'none',
      opacity:0.3,
      height:100+'%'
    },
    divDisable:false,
    clickData:{}
  });
  const erGrid1Ready = () => {
  data.grid1 = erFormHelper.getGrid('gridView1');
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
    // 调用后台服务service获取配置数据并实例化工具类--Initialize
    const initialResult = await erFormHelper.Initialize(formPartition.value, formName, '', initializeService);

    //判断初始化返回结果，若>=0表示正确获取初始化信息，否则报错
    if (initialResult.flag >= 0) {
      // 画面工具类初始化成功后将画面渲染条件设置为1
      initializeFlag.value = 1;
      erFormHelper.setGridToolbarVisible('gridView1', {
        addrow: false,
        copyrow: false,
        delete: false,
        cancel: false,
        excel: true
      });
      // 回调函数获取控件信息及设置定义事件等操作
      nextTick(() => {
        // 获取画面上的主要控件信息
        data.grid1 = erFormHelper.getGrid('gridView1');
        // 设置表格列不可编辑
        // erFormHelper.setGridEditable('gridView1',false);
      });
    } else {
      // 在页面上侧中间显示错误信息栏
      erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
    }
  };


/*  //查询表格数据
  const queryInfo = () => {
    erFormHelper.queryDataByDataSource('gridView1', { filterConfigId: 'LayoutGroupFilter'});
    erFormHelper.setGridEditable('gridView1',false);
  };*/
  //查询表格数据
  const queryInfo = async () => {
    const layoutValue: any = erFormHelper.getAllControlValue('LayoutGroupFilter');
    const inInfo = new EI.EIInfo();
    const block = new EI.EiBlock('Table0');
    block.pushData(layoutValue, true);
    inInfo.addBlock(block);
    const outInfo = await erFormHelper.callService('qmir4101_inq', inInfo, false, true, false);
    console.log("🚀 ~ queryInfo ~ outInfo:", outInfo)
    erFormHelper.mergeDataToGrid(outInfo.getBlock(0), 'gridView1');
    erFormHelper.setGridEditable('gridView1',false);

  };

  //F2查询
  const F2_DO = async (e: any) => {
    queryInfo();
  };


  //F3标准修改维护
  const F3_PRE_DO = async (e: any) => {
    //设置可编辑
    erFormHelper.setGridEditable('gridView1',true);
  };
  //F3标准修改取消
  const F3_CANCEL = async (e: any) => {
    queryInfo();
  };
  //F3标准修改确认
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
    const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
    const block = new EI.EiBlock('Table1');
    inInfo.addBlock(bd,'Table0');
    inInfo.addBlock(block);
    //调用后台服务保存数据
    const outInfo = await erFormHelper.callService('qmir4102_upd', inInfo, true, true);
    if (outInfo.sys.status >= 0) {
      // 设置表格列不可编辑
      erFormHelper.setGridEditable('gridView1',false);
      // 查询最新数据
      queryInfo();
    }else{
      return false;
    }
  };
  //F4提交维护
  const F4_PRE_DO = async (e: any) => {
    if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
      erFormHelper.messageWarning('至少选择一条数据');
      return false;
    }
  };
  //F4提交取消
  const F4_CANCEL = async (e: any) => {
    queryInfo();
  };
  //F4提交确认
  const F4_DO = async (e: any) => {
    //检验必输项
    if (!erFormHelper.checkGridInput('gridView1')) {
      return false;
    }
    const inInfo = new EI.EIInfo();
    const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
    const block = new EI.EiBlock('Table1');
    inInfo.addBlock(bd,'Table0');
    inInfo.addBlock(block);
    //调用后台服务保存数据
    const outInfo = await erFormHelper.callService('qmir4103_con', inInfo, true, true);
    if (outInfo.sys.status >= 0) {
      // 设置表格列不可编辑
      erFormHelper.setGridEditable('gridView1',false);
      // 查询最新数据
      queryInfo();
    }else{
      return false;
    }
  };

  //F5撤销维护
  const F5_PRE_DO = async (e: any) => {
    if (erFormHelper.getGridSelectRows('gridView1').length === 0) {
      erFormHelper.messageWarning('至少选择一条数据');
      return false;
    }
  };
  //F5撤销取消
  const F5_CANCEL = async (e: any) => {
    queryInfo();
  };
  //F5撤销确认
  const F5_DO = async (e: any) => {
    //检验必输项
    if (!erFormHelper.checkGridInput('gridView1')) {
      return false;
    }
    const inInfo = new EI.EIInfo();
    const bd = erFormHelper.getGridSelectRowsAsBlock('gridView1');
    const block = new EI.EiBlock('Table1');
    inInfo.addBlock(bd,'Table0');
    inInfo.addBlock(block);
    //调用后台服务保存数据
    const outInfo = await erFormHelper.callService('qmir4104_rec', inInfo, true, true);
    if (outInfo.sys.status >= 0) {
      // 设置表格列不可编辑
      erFormHelper.setGridEditable('gridView1',false);
      // 查询最新数据
      queryInfo();
    }else{
      return false;
    }
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