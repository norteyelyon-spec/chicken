import React from 'react';
import { Atom, Award, Compass, Cpu, Dna, FlaskConical } from 'lucide-react';

export const AVATAR_OPTIONS: {
  id: string;
  label: string;
  shortLabel: string;
  gradient: string;
  ring: string;
}[] = [
  { id: 'atom', label: 'Physics Atom', shortLabel: 'Physics', gradient: 'from-cyan-500/25 to-blue-600/25 text-cyan-300', ring: 'border-cyan-500/40' },
  { id: 'flask', label: 'Chemistry Flask', shortLabel: 'Chem', gradient: 'from-emerald-500/25 to-teal-600/25 text-emerald-300', ring: 'border-emerald-500/40' },
  { id: 'dna', label: 'Biology Helix', shortLabel: 'Biology', gradient: 'from-lime-500/25 to-emerald-600/25 text-lime-300', ring: 'border-lime-500/40' },
  { id: 'compass', label: 'Add Maths Compass', shortLabel: 'Maths', gradient: 'from-violet-500/25 to-indigo-600/25 text-violet-300', ring: 'border-violet-500/40' },
  { id: 'cpu', label: 'ICT Processor', shortLabel: 'ICT', gradient: 'from-blue-500/25 to-sky-600/25 text-blue-300', ring: 'border-blue-500/40' },
  { id: 'trophy', label: 'WASSCE Scholar', shortLabel: 'Scholar', gradient: 'from-amber-500/25 to-orange-600/25 text-amber-300', ring: 'border-amber-500/40' },
];

interface AvatarIconProps {
  avatarId: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({ avatarId, size = 'md' }) => {
  const option = AVATAR_OPTIONS.find((a) => a.id === avatarId) ?? AVATAR_OPTIONS[0];
  const sizeClass =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  const iconClass =
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';

  const renderGlyph = () => {
    switch (option.id) {
      case 'flask':
        return <FlaskConical className={iconClass} />;
      case 'dna':
        return <Dna className={iconClass} />;
      case 'compass':
        return <Compass className={iconClass} />;
      case 'cpu':
        return <Cpu className={iconClass} />;
      case 'trophy':
        return <Award className={iconClass} />;
      default:
        return <Atom className={iconClass} />;
    }
  };

  return (
    <div
      className={`${sizeClass} rounded-xl bg-gradient-to-br ${option.gradient} border ${option.ring} flex items-center justify-center shrink-0`}
      aria-hidden="true"
    >
      {renderGlyph()}
    </div>
  );
};
