import { formatTime } from './format-event-date';

/** { kind, text } shown in the status chip, or null when there is no status. */
export default function buildChipLabel(status, { t, timeFormat }) {
  if (!status) return null;
  if (status.kind === 'soon') {
    return { kind: 'soon', text: `${t(status.day === 'today' ? 'Today' : 'Tomorrow')}, ${formatTime(status.at, timeFormat)}` };
  }
  if (status.kind === 'live') {
    const until = status.until ? ` · ${t('until')} ${formatTime(status.until, timeFormat)}` : '';
    return { kind: 'live', text: `${t('In progress')}${until}` };
  }
  return { kind: 'ended', text: t('Ended') };
}
