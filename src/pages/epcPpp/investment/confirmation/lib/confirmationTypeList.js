export const confirmationTypeList = [
  {
    label: '建设费用确认单',
    value: 1,
    color: '#0079FE'
  },
  {
    label: '总投资确认单',
    value: 2,
    color: '#FF8040'
  }
]
export const getConfirmationTypeByValue = value => _.find(confirmationTypeList, { value })?.label ?? ''
export const getConfirmationTypeColorByValue = value => _.find(confirmationTypeList, { value })?.color ?? ''
