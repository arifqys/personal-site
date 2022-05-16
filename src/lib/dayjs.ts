import 'dayjs/locale/id';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale(`id`);
dayjs.extend(relativeTime);

export default dayjs;
