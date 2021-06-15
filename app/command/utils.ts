import dayjs from 'dayjs'
import 'dayjs/locale/ja'

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
