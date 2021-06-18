export default [
  {
    name: '考勤管理',
    cateGory: ['check_work_manage', 'check_work_result_message'],
    router: '',
    title: '考勤消息'
  },
  {
    name: '质量管理',
    cateGory: [
      'conctruction_manage',
      'quality_safety_rectify_message',
      'quality_safety_review_message',
      'quality_safety_inspect_message',
      'quality_safety_inspect_remind_message'
    ],
    router: '/pages/inspect/detail',
    title: '质量消息'
  },
  {
    name: '安全管理',
    cateGory: [
      'safety_manage',
      'safety_safety_rectify_task',
      'safety_safety_rectify_message',
      'safety_safety_review_message',
      'safety_safety_inspect_message',
      'safety_safety_inspect_remind_message'
    ],
    router: '/pages/safe/detail',
    title: '安全消息'
  },
  {
    name: '施工日志管理 ',
    cateGory: ['construction_daily_diary', 'daily_diary_submit_message', 'daily_diary_check_message'],
    router: '/pages/log/detail',
    title: '施工日志消息'
  },
  {
    name: '环境监测管理',
    router: '/pages/environmentalMonitoring/list',
    cateGory: ['environmental_monitoring_manage', 'environmental_monitoring_exceed_message'],
    title: '环境监测消息'
  },
  {
    name: '物资设备管理',
    router: '',
    cateGory: ['material_equipment_manage'],
    title: '物资设备消息'
  },
  {
    name: '材料库存详情',
    router: '/pages/material/inventory/detail',
    cateGory: ['material_input_message'],
    title: '材料入库消息'
  },
  {
    name: '材料入库',
    router: '/pages/material/receipt/detail',
    cateGory: ['material_input_message'],
    title: '材料入库消息'
  },
  {
    name: '材料出库',
    router: '/pages/material/stockOut/detail',
    cateGory: [' material_output_message'],
    title: '材料出库消息'
  },
  {
    name: '材料采购',
    router: '/pages/material/purchaseOrder/detail',
    cateGory: [
      'material_apply_message',
      'material_pass_message',
      'material_arrival_message',
      'material_inventory_message'
    ],
    title: '材料采购消息'
  },
  {
    name: '设备台账',
    router: '/pages/equipment/list/detail',
    cateGory: ['material_apply_message'],
    title: '设备台账消息'
  },
  {
    name: '设备保养',
    router: '/pages/equipment/maintenance/detailWaitMaintain',
    cateGory: [
      'equipment_maintenance_plan_message',
      'equipment_maintenance_complete__message',
      'equipment_maintenance_checked__message'
    ],
    title: '设备保养消息'
  },
  {
    name: '设备采购',
    router: '/pages/equipment/purchase/detail',
    cateGory: [
      'quipment_purchase_message',
      'equipment_purchase_pass_message',
      'equipment_purchase__arrival_message',
      'equipment_purchase__complete_message',
      'equipment_purchase__inventory_message'
    ],
    title: '设备采购消息'
  },
  {
    name: '设备租赁',
    router: '/pages/equipment/lease/detail',
    cateGory: [
      'equipment_purchase_message',
      'equipment_purchase_pass_message',
      'equipment_purchase__arrival_message',
      'equipment_purchase__complete_message',
      'equipment_purchase__inventory_message'
    ],
    title: '设备租赁消息'
  },
  {
    name: '设备进退场',
    router: '/pages/equipment/enterAndExit/enterDetail',
    cateGory: ['equipment_enter_message', 'equipment_exit_message'],
    title: '设备进退场消息'
  },
  {
    name: '设备故障维修',
    router: '/pages/equipment/Troubleshooting/detail',
    cateGory: ['equipment_repair_message', 'equipment_repair_pass_message', 'equipment_repair_complete_message'],
    title: '设备故障维修消息'
  },

  {
    name: '人员培训',
    router: 'pages/labour/labour-user-details',
    cateGory: ['personnel_training_manage', 'training_staff_result_message'],
    title: '人员培训消息'
  },
  {
    name: '进度管理',
    router: 'pages/schedule/detail',
    cateGory: ['process_manage'],
    title: '进度消息'
  },
  {
    router: 'pages/task/step-detail',
    name: '工序管理',
    cateGory: ['working_procedure_manage', 'working_procedure_plan_check_message'],
    title: '工序消息'
  },

  {
    router: 'pages/completion-epc/project-first-inspect/detail',
    name: '工程初检'
  },
  {
    router: 'pages/completion-epc/project-over-inspect/detail',
    name: '竣工验收'
  },
  {
    router: 'pages/recruit-manage-epc/tender/detail',
    name: '招标公告'
  },
  {
    router: 'pages/recruit-manage-epc/winning/detail',
    name: '中标资料'
  },
  {
    router: 'pages/project-approval-Epc/meeting-details',
    name: '立项会议'
  },
  {
    router: 'pages/contract/detail',
    name: '合同管理'
  }
]
