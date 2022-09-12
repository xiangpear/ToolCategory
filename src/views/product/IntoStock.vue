<template>
    <div id="intostork">
        <div class="select">
            <el-form :model="formInline" :inline="true">
                <el-form-item label="单据号">
                    <el-input v-model="formInline.instockIdentifier" placeholder="单据号" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="操作人">
                    <el-input v-model="formInline.userName" placeholder="操作人" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="所属仓库">
                    <el-select v-model="formInline.instockStorehouseId" placeholder="所属仓库" size="mini">
                        <el-option :label="item.storehouseName" :value="item.storehouseId" v-for="item in storehouseList" :key="item.storehouseId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="入库时间" prop="rangeDate">
                    <el-date-picker
                        :default-time="['00:00:00', '23:59:59']"
                        v-model="formInline.selecteTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        class="el-date-picker"
                        size="mini"
                        @change="intoStockTime"
                    />
                </el-form-item>
                <el-form-item class="operation">
                    <el-button type="primary" round size="small" icon="el-icon-download" @click="templateDownload">模板下载</el-button>
                    <el-button type="primary" round size="small" icon="el-icon-upload2" @click="importClick">导入</el-button>
                    <el-button type="primary" round size="small" icon="el-icon-plus" @click="addIntoStock">入库</el-button>
                    <el-button type="primary" round size="small" icon="el-icon-search" @click="conditionSelece">查询</el-button>
                    <el-button round size="small" icon="el-icon-refresh-left" @click="resetHandle">重置</el-button>
                    <!-- <el-button type="primary" round>导出</el-button> -->
                </el-form-item>
            </el-form>
        </div>
        <safe-table
            :props="props"
            :isShowCheck="false"
            :pagination="pagination(IntoStockInfo.total, IntoStockInfo.size, IntoStockInfo.current)"
            :tableData="IntoStockInfo.records"
            @handleDetail="handleDetail"
            :handleSizeChange="handleSizeChange"
            :handleCurrentChange="handleCurrentChange"
        ></safe-table>

        <into-stock-detail
            :detailData="detailData"
            :detailDialogVisible="detailDialogVisible"
            @handleClose="handleClose"
            :detailInfo="intoStockDetailInfo"
            :handleSizeChange="handleSizeChangeStockInfo"
            :handleCurrentChange="handleCurrentChangeStockInfo"
        ></into-stock-detail>

        <safe-dialog :dialogVisible="addIntoStockDialog" :isShowClose="false">
            <div slot="top">
                <div class="title">
                    <span></span>入库
                    <div class="hr"></div>
                </div>
            </div>
            <div slot="center">
                <into-stock-table @cancelIntoStock="closeIntoStockDia" @confirmClick="confirmhandle" :DataArr="DateArr" :outerAddIntoStockStoreId="ruleForm.addImportStockStoreId"></into-stock-table>
            </div>
        </safe-dialog>

        <!-- 导入的弹框 -->
        <safe-dialog :dialogVisible="importDialog" dialogWidth="400px" :isShowClose="false">
            <div slot="top">
                <div class="title">批量导入</div>
            </div>
            <div slot="center">
                <el-form :model="ruleForm" :rules="rules" ref="formName" class="demo-ruleForm" inline>
                    <el-form-item prop="addImportStockStoreId" label="入库仓库">
                        <el-select v-model="ruleForm.addImportStockStoreId" placeholder="入库仓库">
                            <el-option :label="item.storehouseName" :value="item.storehouseId" v-for="item in storehouseList" :key="item.storehouseId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="bottom" class="importBootom">
                <span class="tipsInfo">只能上传xls/xlsx文件</span>
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    action
                    accept=".xlsx , .xls"
                    :file-list="fileList"
                    :auto-upload="false"
                    :on-change="handleUpload"
                    :on-exceed="exceedLimit"
                    :disabled="isDisabled"
                    :on-remove="handleUploadRemove"
                >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload" :disabled="uploadDisableBtn">上传</el-button>
                    <el-button type="info" plain size="small" @click="uploadCancel">取消</el-button>
                </el-upload>
            </div>
        </safe-dialog>
    </div>
</template>

<script>
import safeTable from "@/components/table/index.vue";
import safeDialog from "@/components/dialog/dialog.vue";
import intoStockTable from "./childrenComp/intoStockTable.vue";
import { getIntoStockIndex, getIntoStockdetailInfo, getTemplateDownload } from "@/api/product/intoStock";
// import { getStockStoreList } from "@/api/product/stock";
import selectMixin from "./mixin/select.js";
import storeHouse from "./mixin/getStorehouseList";
import IntoStockDetail from "./childrenComp/intoStockDetail.vue";
import { read, utils } from "xlsx";
import format from "date-format";

export default {
    components: { safeTable, IntoStockDetail, safeDialog, intoStockTable },
    data() {
        return {
            requestParam: {
                pageSize: 10,
                pageNo: 1,
            },
            formInline: {
                instockIdentifier: undefined,
                userName: undefined,
                instockStorehouseId: undefined,
                selecteTime: undefined,
                startTime: undefined,
                endTime: undefined,
            },
            props: [
                {
                    lable: "单据号",
                    prop: "instockIdentifier",
                },
                {
                    lable: "操作人",
                    prop: "userName",
                },
                {
                    lable: "所属仓库",
                    prop: "storeHouse",
                },
                {
                    lable: "入库时间",
                    prop: "createdTime",
                },
            ],
            ruleForm: {
                addImportStockStoreId: "",
            },
            rules: {
                addImportStockStoreId: [{ required: true, message: "请选择仓库", trigger: "blur" }],
            },
            IntoStockInfo: {},
            detailDialogVisible: false,
            detailData: {},
            detailParams: { pageSize: 10, pageNo: 1, instockId: null },
            intoStockDetailInfo: {},
            addIntoStockDialog: false,
            addIntoStockStoreId: null,
            importDialog: false,
            fileList: [],
            file: null,
            DateArr: [],
            uploadDisableBtn: true,
        };
    },

    created() {
        this._getIntoStockIndex();
    },
    mixins: [selectMixin, storeHouse],

    methods: {
        //验证表单
        validate() {
            this.$refs.formName.validate((valid) => {
                if (!valid) {
                    return;
                }
            });
        },

        //处理文件导入
        async submitUpload() {
            this.validate();
            if (!this.ruleForm.addImportStockStoreId) return;
            if (!this.file) return;
            //将文件中的数据处理成json格式的数组对象
            this.DateArr = [];
            try {
                let data = await this.readFile(this.file);
                let workbook = read(data, { type: "binary", cellDates: true });
                let worksheet = workbook.Sheets[workbook.SheetNames[0]];
                data = utils.sheet_to_json(worksheet);
                let character = {
                    toolCategoryName: {
                        propName: "工器具类型名称（必填）",
                        type: "string",
                    },
                    itemUnit: {
                        propName: "计量单位（必填）",
                        type: "string",
                    },
                    testTime: {
                        propName: "试验周期（月）必填",
                        type: "number",
                    },
                    useTime: {
                        propName: "使用周期（月）必填",
                        type: "number",
                    },
                    model: {
                        propName: "规格型号（必填）",
                        type: "string",
                    },
                    lastInspectionTime: {
                        propName: "上次试验日期（必填）",
                        type: "date",
                    },
                    toolAttribute: {
                        propName: "器具类型",
                        type: "string",
                    },
                    factory: {
                        propName: "生产厂家",
                        type: "string",
                    },
                    produceTime: {
                        propName: "生产日期",
                        type: "date",
                    },
                    produceNumber: {
                        propName: "生产编码",
                        type: "string",
                    },
                    toolNumbers: {
                        propName: "入库数量（必填）",
                        type: "number",
                    },
                };
                //item是代表的data中的每一项，key是代表的character中的每一个属性名
                //用于处理列名是汉字的问题，把它转成对应的属性
                data.forEach((item) => {
                    let obj = {};
                    for (let key in character) {
                        if (!character.hasOwnProperty(key)) break;
                        let v = character[key]; //v是一个包含propName和type的对象
                        let propName = v.propName; //propName是中文名字
                        let type = v.type; //type是string或者number等
                        v = item[propName] || "";
                        type === "string" ? (v = String(v)) : null;
                        type === "number" ? (v = Number(v)) : null;
                        type === "date" ? (v = format("yyyy-MM-dd", v)) : null;
                        obj[key] = v;
                    }
                    this.DateArr.push(obj);
                });
                this.addIntoStockDialog = true;
            } catch (err) {
                this.$message.error("传入的文件不能进行处理！请选择正确的文件");
            } finally {
                this.fileList = [];
                this.uploadDisableBtn = true;
            }
        },
        readFile(file) {
            return new Promise((resolve, reject) => {
                let reader = new FileReader();
                reader.readAsBinaryString(file);
                reader.onload = (e) => {
                    resolve(e.target.result);
                };
            });
        },
        handleUpload(file, fileList) {
            this.handleFunc(fileList);
        },
        handleUploadRemove(file, fileList) {
            this.handleFunc(fileList);
        },
        handleFunc(fileList) {
            this.uploadDisableBtn = fileList.length !== 1 ? true : false;
            if (fileList.length == 1) {
                this.file = fileList[0].raw;
            }
        },
        //超出文件上传时调用的函数
        exceedLimit() {
            // console.log("===");
        },
        uploadCancel() {
            this.importDialog = false;
        },

        //用于请求入库的首页的数据
        _getIntoStockIndex() {
            this.requestParam.param = this.formInline;
            // console.log(this.requestParam);
            getIntoStockIndex(this.requestParam)
                .then((res) => {
                    this.IntoStockInfo = res;
                })
                .catch((err) => {
                    this.$message.error("系统错误，请稍后重试！");
                });
        },

        //用于请求详情的表格数据
        _getIntoStockdetailInfo() {
            getIntoStockdetailInfo(this.detailParams)
                .then((res) => {
                    this.intoStockDetailInfo = res;
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        //调用请求的函数
        callRequestfunc() {
            this._getIntoStockIndex();
        },

        //监听入库时间选择的改变
        intoStockTime() {
            this.formInline.startTime = this.formInline.selecteTime[0];
            this.formInline.endTime = this.formInline.selecteTime[1];
        },

        //分页器
        //点击详情
        handleDetail(row) {
            this.detailDialogVisible = true;
            this.detailData = row;
            this.detailParams.instockId = +row.instockId;
            this._getIntoStockdetailInfo();
        },
        handleClose() {
            this.detailDialogVisible = false;
        },

        //分页
        pagination(total, pageSize, current) {
            return {
                total,
                pageNo: current,
                pageRange: [10, 20, 30, 50, 100],
                pageSize,
            };
        },

        //分页器改变
        //分页器的每页的条数改变时触发
        handleSizeChange(size) {
            let that = this;
            that.requestParam.pageSize = size;
            that._getIntoStockIndex();
        },
        //stock分页器的当前页改变时触发
        handleCurrentChange(page) {
            let that = this;
            that.requestParam.pageNo = page;
            that._getIntoStockIndex();
        },

        //stock详情页的分页器
        handleSizeChangeStockInfo(size) {
            this.detailParams.pageSize = size;
            this._getIntoStockdetailInfo();
        },

        handleCurrentChangeStockInfo(page) {
            this.detailParams.pageNo = page;
            this._getIntoStockdetailInfo();
        },

        //点击了入库按钮
        addIntoStock() {
            this.addIntoStockDialog = true;
        },
        closeIntoStockDia() {
            this.addIntoStockDialog = false;
            this.importDialog = false;
            this.$refs.upload.clearFiles();
        },

        //点击了入库的确认之后重新发起请求
        confirmhandle() {
            this._getIntoStockIndex();
        },

        //模板下载按钮的点击事件
        async templateDownload() {
            //调用请求函数，文件以二进制流的形式传输
            let res = await getTemplateDownload();
            let arr = [];
            arr.push(res);
            let link = document.createElement("a");
            // let newBlob = new Blob(arr, { type: "application/vnd.ms-excel;charset=utf-8" });
            console.log(res);
            link.href = URL.createObjectURL(res);
            link.download = "工器具库存导入模板";
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        },

        //导入按钮的点击事件
        importClick() {
            this.ruleForm.addImportStockStoreId = "";
            this.importDialog = true;
        },
    },
    computed: {
        isDisabled() {
            // console.log(this.$refs.upload);
            return false;
        },
    },
};
</script>

<style scoped>
#intostork {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

div {
    background-color: #fff;
}
.operation {
    float: right;
}
.el-form {
    overflow: hidden;
    position: relative;
}
.el-form-item {
    margin-bottom: 3px;
}
/* dialog */
.select {
    padding: 0 20px;
}
.diatop {
    display: flex;
    justify-content: space-between;
    position: relative;
    bottom: 20px;
    flex-flow: wrap;
}
.el-button--mini {
    position: relative;
    bottom: 12px;
}

/* 弹出框 */
.title {
    position: relative;
    bottom: 20px;
    font-size: 16px;
    width: 100%;
    display: block;
}

.title span {
    padding-left: 10px;
    border-left: 5px solid #78aef9;
}
.hr {
    border-bottom: 1px solid rgb(221, 221, 221);
    margin-top: 10px;
    width: 100%;
}

.titleInfo {
    width: 100%;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
}

/* 弹框 */
.title {
    position: relative;
    bottom: 20px;
    font-size: 16px;
    width: 100%;
    display: block;
}

.title span {
    padding-left: 10px;
    border-left: 5px solid #78aef9;
}
.hr {
    border-bottom: 1px solid rgb(221, 221, 221);
    margin-top: 10px;
    width: 100%;
}

/* 导入 */
.upload-demo {
    margin-top: 60px;
    /* margin-left: 30%; */
    /* float: right; */
    background-color: rgb(255, 255, 255, 0);
    position: relative;
    left: 150px;
}

::v-deep .el-upload-list__item {
    margin-left: -10px;
    width: 223px;
}

.importBootom {
    position: relative;
    margin-top: 90px;
}

.tipsInfo {
    position: absolute;
    right: 0;
    top: -25px;
    font-size: 12px;
}
</style>
