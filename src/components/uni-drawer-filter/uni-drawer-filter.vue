<template>
  <uni-drawer ref="drawer" class="drawer" mode="right" :width="580">
    <div class="header">
      <span>数据筛选</span>
      <span class="icon" @click="close">×</span>
    </div>
    <scroll-view class="scroll-roll" scroll-y>
      <div class="content">
        <!-- 验收类型 start -->
        <template v-if="type === 'qualityAcceptance'">
          <h6 class="label">{{ allTypeList.acceptanceType.name }}</h6>
          <uni-checkbox-button-group
            v-if="allTypeList.acceptanceType.list.length > 0"
            v-model.trim="formData.acceptanceType"
            join
            :options="allTypeList.acceptanceType.list"
          />
          <p class="item-line"></p>
        </template>
        <!-- 验收类型 end -->

        <!-- 紧要程度 start -->
        <!-- <template v-if="type === 'qualityInspect' || type === 'qualityAcceptance'">
          <h6 class="label">{{ allTypeList.urgencyDegree.name }}</h6>
          <uni-checkbox-button-group
join
            v-if="allTypeList.urgencyDegree.list.length > 0"
            v-model.trim="formData.urgencyDegree"
            :options="allTypeList.urgencyDegree.list"
          />
          <p class="item-line"></p>
        </template>-->
        <!-- 紧要程度 end -->

        <!-- 单体筛选 start -->
        <template v-if="type === 'qualityInspect' || type === 'qualitySecurity'">
          <h6 class="label">{{ allTypeList.entityId.name }}</h6>
          <uni-checkbox-button-group
            v-if="allTypeList.entityId.list.length > 0"
            v-model.trim="formData.entityId"
            join
            :options="allTypeList.entityId.list"
          />
          <p class="item-line"></p>
        </template>
        <!-- 单体筛选 end -->

        <!-- 楼层筛选 start -->
        <template v-if="type === 'qualityInspect' || type === 'qualitySecurity'">
          <h6 class="label">{{ allTypeList.floorIdList.name }}</h6>
          <uni-checkbox-button-group
            v-if="allTypeList.floorIdList.list.length > 0"
            v-model.trim="formData.floorIdList"
            join
            multiple
            :options="allTypeList.floorIdList.list"
          />
          <p class="item-line"></p>
        </template>
        <!-- 楼层筛选 end -->

        <!-- 测量筛选 start -->
        <template v-if="type === 'measure'">
          <h6 class="label">选择标准</h6>
          <uni-checkbox-button-group
            v-model.trim="formData.standardGroupId"
            class="column-2"
            join
            :options="allTypeList.measure.standardList"
            @change="formData.measureStandardIds = []"
          />
          <p class="item-line"></p>

          <template v-if="formData.standardGroupId">
            <h6 class="label">选择分项</h6>
            <uni-checkbox-button-group
              v-model="formData.measureStandardIds"
              join
              multiple
              :options="find(allTypeList.measure.standardList, { id: formData.standardGroupId }).children"
            />
            <p class="item-line"></p>
          </template>

          <template v-if="!isReMeasure">
            <h6 class="label">状态</h6>
            <uni-checkbox-button-group v-model="formData.status" join :options="allTypeList.measure.statusList" />
            <p class="item-line"></p>
          </template>
        </template>

        <!-- 测量筛选 end -->

        <!-- 合同列表，招采方式筛选 start -->
        <template v-if="type === 'agreement'">
          <h6 class="label">{{ allTypeList.agreement.name }}</h6>
          <uni-checkbox-button-group
            v-if="allTypeList.agreement.list.length > 0"
            v-model.trim="formData.agreementType"
            join
            :options="allTypeList.agreement.list"
          />
          <p class="item-line"></p>
        </template>
        <!-- 招采方式筛选 end -->
        <!-- 材料确认单 检验结果筛选 start -->
        <template v-if="type === 'materialConfirmationSheet'">
          <h6 class="label">{{ allTypeList.material.name }}</h6>
          <uni-checkbox-button-group
            v-if="allTypeList.material.list.length > 0"
            v-model.trim="formData.materialStatus"
            join
            :options="allTypeList.material.list"
          />
          <p class="item-line"></p>
        </template>
        <!-- 材料确认单 检验结果筛选 end -->
        <!-- 采购通知(甲方权限) 检验结果筛选 start -->
        <template v-if="type === 'materialProcurementParty'">
          <h6 class="label">{{ allTypeList.material.name }}</h6>
          <uni-checkbox-button-group
            v-if="allTypeList.material.partyList.length > 0"
            v-model.trim="formData.materialStatus"
            join
            :options="allTypeList.material.partyList"
          />
          <p class="item-line"></p>
        </template>
        <!-- 采购通知(甲方权限) 检验结果筛选 end -->
        <!-- 采购通知(供应商权限) 检验结果筛选 start -->
        <template v-if="type === 'materialProcurementSupplier'">
          <h6 class="label">{{ allTypeList.material.name }}</h6>
          <uni-checkbox-button-group
            v-if="allTypeList.material.supplierList.length > 0"
            v-model.trim="formData.materialStatus"
            join
            :options="allTypeList.material.supplierList"
          />
          <p class="item-line"></p>
        </template>
        <!-- 采购通知(供应商权限) 检验结果筛选 end -->

        <!-- 参与人员 start -->
        <template
          v-if="
            !['agreement'].includes(type) &&
              type !== 'materialConfirmationSheet' &&
              type !== 'materialProcurementParty' &&
              type !== 'measure'
          "
        >
          <h6 class="label">{{ allTypeList.checkUserIds.name }}</h6>
          <uni-select-user v-model.trim="formData[userKey]" multiple :mode="2" />
        </template>
        <!-- 参与人员 end -->
      </div>
    </scroll-view>
    <div class="foot">
      <uni-btn @click="reset">重置</uni-btn>
      <uni-btn type="primary" @click="submit">确定</uni-btn>
    </div>
  </uni-drawer>
</template>

<script>
import UniDrawer from '@/components/uni-drawer/uni-drawer'
import UniBtn from '@/components/uni-btn/uni-btn'
import { workingAPI } from '@/api/working'
import { find, isNull, isEmpty, cloneDeep } from 'lodash'
import toTree from '@/utils/toTree'
export default {
  name: 'UniDrawerFilter',
  components: { UniBtn, UniDrawer },
  props: {
    /*
    列表页类型
    qualityInspect 质量检查
    qualityAcceptance 质量验收
    qualitySecurity 安全检查
    */
    type: {
      type: String,
      default: 'qualityInspect'
    },
    //是否是实测实量复测
    isReMeasure: {
      type: Boolean,
      default: false
    },
    // 单体id
    entityId: {
      type: String,
      default: ''
    },
    // 楼层id集合
    floorId: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 人员双向绑定的key
    userKey: {
      type: String,
      default: 'checkUserIds'
    }
    /**
     *
     * */

    // filterInfo: {
    //   type: Object,
    //   default() {
    //     return {}
    //   }
    // }
  },
  data() {
    return {
      // 表单数据
      formData: {
        urgencyDegree: '',
        acceptanceType: '',
        entityId: '',
        floorIdList: '',
        checkUserIds: '',
        acceptanceManIds: '',
        agreementType: '',
        measureStandardIds: '',
        materialStatus: '' //材料确认单检验结果
      },
      formDataBack: {},
      entityIdAllList: [], // 所有单体列表
      // 所有类型数据
      allTypeList: {
        urgencyDegree: {
          name: '紧要程度',
          list: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '一般隐患',
              value: '1'
            },
            {
              label: '较大隐患',
              value: '2'
            },
            {
              label: '严重隐患',
              value: '3'
            },
            {
              label: '重大隐患',
              value: '4'
            }
          ]
        },
        acceptanceType: {
          name: '验收类型',
          list: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '检验批',
              value: '1'
            },
            {
              label: '隐蔽工程',
              value: '2'
            },
            {
              label: '分项工程',
              value: '5'
            },
            {
              label: '分部工程',
              value: '4'
            },
            {
              label: '单位工程',
              value: '3'
            }
          ]
        },
        entityId: {
          name: '单体筛选',
          list: []
        },
        floorIdList: {
          name: '楼层筛选',
          list: []
        },
        checkUserIds: {
          name: '参与人员',
          list: []
        },
        agreement: {
          name: '招采方式',
          list: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '招标',
              value: '1'
            },
            {
              label: '非招标',
              value: '2'
            }
          ]
        },
        material: {
          name: '检验结果',
          list: [
            {
              label: '全部',
              value: ''
            },
            {
              value: '0',
              label: '草稿'
            },
            {
              value: '1',
              label: '待审核'
            },
            {
              value: '2',
              label: '已通过'
            },
            {
              value: '3',
              label: '已驳回'
            }
          ],
          partyList: [
            {
              label: '全部',
              value: ''
            },
            {
              value: '0',
              label: '待通知'
            },
            {
              value: '1',
              label: '采购中'
            },
            {
              value: '2',
              label: '已完成'
            }
          ],
          supplierList: [
            {
              label: '全部',
              value: ''
            },
            {
              value: '1',
              label: '供货中'
            },
            {
              value: '2',
              label: '已完成'
            }
          ]
        },
        measure: {
          standardList: [],
          statusList: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '不合格',
              value: 0
            },
            {
              label: '合格',
              value: 1
            }
          ]
        }
      },
      nonessentialsArr: [
        'agreement',
        'materialConfirmationSheet',
        'materialProcurementParty',
        'materialProcurementSupplier',
        'qualityAcceptance',
        'measure'
      ], //不需要单体信息的type数组
      find
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  watch: {
    'formData.entityId'(entityId) {
      this.initFloor(entityId)
    }
  },
  mounted() {
    Object.assign(this.formDataBack, this.formData)
  },
  methods: {
    // 初始化
    init() {
      if (this.entityId) {
        this.formData.entityId = this.entityId
      }
      if (this.floorId && this.floorId.length > 0) {
        this.formData.floorIdList = this.floorId.join(',')
      }
    },
    // 初始化楼层数据
    initFloor(entityId) {
      this.allTypeList.floorIdList.list = []
      this.formData.floorIdList = Array.isArray(this.floorId) ? this.floorId.join(',') : ''
      if (!entityId) {
        return
      }
      let configId = find(this.entityIdAllList, { entityId }).configId
      this.getFloorList(configId)
    },
    // 项目下单体列表
    async getEntityList() {
      if (!this.projectId) {
        return
      }
      const result = await workingAPI.getEntityList(this.projectId, false)
      let datas = result.data || []
      let list = datas.sort(this.$utils.setSort('entityName'))
      let entityList = []
      list.map(item => {
        entityList.push({
          label: item.entityName,
          value: item.entityId
        })
      })
      this.entityIdAllList = list
      this.allTypeList.entityId.list = entityList
      this.init()
    },
    // 单体下楼层列表
    async getFloorList(configId) {
      if (!configId) {
        return
      }
      const result = await workingAPI.getFloorList(configId)
      let datas = result.data || []
      let list = []
      datas.map(item => {
        list.push({
          label: item.floorNum + '层',
          value: item.floorId
        })
      })
      this.allTypeList.floorIdList.list = list
    },
    refresh() {},
    // 打开模态框
    open() {
      if (!this.nonessentialsArr.includes(this.type)) {
        // 当单体信息不是必须时，无需获取单体楼层信息
        this.getEntityList()
      }
      // if (!isEmpty(this.filterInfo)) {
      //   console.log(111, this.filterInfo)
      //   for (let key in this.filterInfo) {
      //     this.formData[key] = this.filterInfo[key]
      //   }
      // }

      if (this.type === 'measure') {
        this.fly.safety.post('standard/library/list', { projectId: this.$store.state.project.projectId }).then(res => {
          res.data.forEach(e => {
            e.label = e.name
            e.value = e.id
          })
          this.allTypeList.measure.standardList = toTree(res.data)
        })
      }
      this.$refs.drawer.open()
    },
    // 关闭模态框
    close() {
      this.$refs.drawer.close()
    },
    getSelect(list) {},
    // 回调父级事件
    onChange() {
      let newFormData = {
        urgencyDegree: this.formData.urgencyDegree,
        acceptanceType: this.formData.acceptanceType,
        entityId: this.formData.entityId,
        floorIdList: this.formData.floorIdList ? this.formData.floorIdList.split(',') : [],
        checkUserIds: this.formData.checkUserIds ? this.formData.checkUserIds.split(',') : [],
        acceptanceManIds: this.formData.acceptanceManIds ? this.formData.acceptanceManIds.split(',') : [],
        agreementType: this.formData.agreementType ? this.formData.agreementType : null,
        materialStatus: this.formData.materialStatus ? this.formData.materialStatus : null,
        status: this.formData.status,
        measureStandardIds: this.formData.measureStandardIds.length ? this.formData.measureStandardIds.split(',') : null
      }
      this.$emit('submit', newFormData)
    },
    // 重置选项
    reset() {
      this.formData = _.cloneDeep(this.formDataBack)
      this.onChange()
      this.close()
    },
    // 确定
    submit() {
      this.onChange()
      this.close()
    }
  }
}
</script>

<style scoped lang="less">
@import './uni-drawer-filter.less';
</style>
