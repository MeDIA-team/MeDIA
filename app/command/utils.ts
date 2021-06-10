import 'dayjs/locale/ja'
import dayjs from 'dayjs'
import Ajv from 'ajv'

dayjs.locale('ja')

export const logStdout = (message: any, expand?: boolean): void => {
  if (expand) {
    message = '\n' + JSON.stringify(message, null, '\t')
  }
  console.log(`[${dayjs().format('YYYY/MM/DD hh:mm:ss')}] ${message}`)
}

export const logStderr = (message: any, expand?: boolean): void => {
  if (expand) {
    message = '\n' + JSON.stringify(message, null, '\t')
  }
  console.error(`[${dayjs().format('YYYY/MM/DD hh:mm:ss')}] ${message}`)
}
