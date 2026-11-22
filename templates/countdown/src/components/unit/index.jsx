import './style.sass';

/** One unit of the timer (days, hours, minutes or seconds): its digits in boxes and its label under them. */
function Unit({ digits, label, color }) {
  return (
    <div className="unit">
      <div className="unit__digits">
        {digits.map((value, index) => <span key={`${index}k${value}`} className="unit__digit">{value}</span>)}
      </div>
      <div className="unit__label"><p style={{ color }}>{label}</p></div>
    </div>
  );
}

export default Unit;
