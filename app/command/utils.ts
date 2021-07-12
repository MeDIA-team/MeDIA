import 'dayjs/locale/ja'

import dayjs from 'dayjs'

dayjs.locale('ja')

export const logStdout = (message: unknown, expand?: boolean): void => {
  if (expand) {
    message = '\n' + JSON.stringify(message, null, '\t')
  }
  console.log(`[${dayjs().format('YYYY/MM/DD hh:mm:ss')}] ${message}`)
}

export const logStderr = (message: unknown, expand?: boolean): void => {
  if (expand) {
    message = '\n' + JSON.stringify(message, null, '\t')
  }
  console.error(`[${dayjs().format('YYYY/MM/DD hh:mm:ss')}] ${message}`)
}
