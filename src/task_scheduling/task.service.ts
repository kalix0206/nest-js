import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  //   @Cron('time', options)
  @Cron('* * * * *', { name: 'cronTask' })
  //   @Cron(new Date(Date.now() + 3 * 1000)) // 앱이 실행되고 3초뒤 한번 실행
  //   @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_1AM)
  handleCron() {
    this.logger.log('Task Called');
  }

  @Interval('intervalTask', 3000)
  handleInterval() {
    this.logger.log('Task Called by interval');
  }

  @Timeout('timeoutTask', 5000)
  handleTimeout() {
    this.logger.log('Task Called by timeout');
  }
}

// * * * * *
// | | | | |
// | | | | day of week (요일, 0-7의 값을 가짐. 0과 7은 일요일)
// | | | month (월, 0-12의 값을 가짐. 0과 12는 12월)
// | | day of month (날, 1-31의 값을 가짐)
// | minute (분, 0-59의 값을 가짐)
// second (초, 0-59의 값을 가짐, 선택 사항)

// * * * * * - 초마다
// 45 * * * * - 매분 45초마다
// 0 10 * * * * - 매시간, 10분에
// 0 /30 9-17 * * - 오전 9시부터 오후 5시까지 30분마다
// 0 30 11 * * 1-5 - 월요일~금요일 오전 11시 30분에

// options = {
//     name,
//     timeZone,
//     utcOffeset,
//     unrefTimeout
// }
