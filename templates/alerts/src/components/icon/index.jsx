import iconAlkaline from '../../assets/image/alkaline.svg';
import iconBiological from '../../assets/image/biological.svg';
import iconChemical from '../../assets/image/chemical.svg';
import iconCo2 from '../../assets/image/co2.svg';
import iconCross from '../../assets/image/cross.svg';
import iconDeath from '../../assets/image/death.svg';
import iconElectrical from '../../assets/image/electrical.svg';
import iconExplosion from '../../assets/image/explosion.svg';
import iconFire from '../../assets/image/fire.svg';
import iconFrost from '../../assets/image/frost.svg';
import iconHeat from '../../assets/image/heat.svg';
import iconMagnetism from '../../assets/image/magnetism.svg';
import iconRadiation from '../../assets/image/radiation.svg';
import iconRadio from '../../assets/image/radio.svg';
import iconWarning from '../../assets/image/warning.svg';
import './style.sass';

// Mapeando os nomes dos ícones para os arquivos SVG importados
const icons = {
  alkaline: iconAlkaline,
  biological: iconBiological,
  chemical: iconChemical,
  co2: iconCo2,
  cross: iconCross,
  death: iconDeath,
  electrical: iconElectrical,
  explosion: iconExplosion,
  fire: iconFire,
  frost: iconFrost,
  heat: iconHeat,
  magnetism: iconMagnetism,
  radiation: iconRadiation,
  radio: iconRadio,
  warning: iconWarning,
};

export default function Icon({ name }) {
  // Verifica se o ícone existe no mapa
  const iconSrc = icons[name];

  // Se o ícone for encontrado, renderiza a imagem
  if (iconSrc) {
    return <img src={iconSrc} alt={name} className="icon" />;
  }

  // Se o ícone não for encontrado, renderiza um aviso
  return <span>Icon not found</span>;
}
