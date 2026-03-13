import { motion } from 'framer-motion';
import { type CardId } from '@/data/bento';

export const ProjectIcon = ({ id, accent }: { id: CardId; accent: string }) => {
  switch (id) {
    case 'f1': return (
        <div className="flex gap-[3px]">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      );
    case 'spotify': return (
        <div className="flex gap-[2px] items-end h-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-[3px] rounded-sm origin-bottom"
              style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }}
              animate={{ height: ['30%', '100%', '40%'] }}
              transition={{
                duration: 0.5 + i * 0.1,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      );
    case 'sql': return (
        <motion.div
          animate={{ opacity: [1, 0.3, 1, 1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, times: [0, 0.1, 0.2, 0.8, 0.9, 1] }}
          className="flex flex-col gap-[2px]"
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-3 h-[2px] rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }} />
          ))}
        </motion.div>
      );
    case 'litestore': return (
        <div className="relative w-3 h-3 flex items-center justify-center">
          <motion.div
            className="absolute w-3 h-3 border-[1.5px] rounded-sm"
            style={{ borderColor: accent, filter: `drop-shadow(0 0 4px ${accent})` }}
            animate={{ rotate: 180 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 border-[1px] rounded-sm"
            style={{ borderColor: accent }}
            animate={{ rotate: -180 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </div>
      );
    case 'hr': return (
        <div className="relative flex items-center justify-center w-3 h-3">
          <span className="w-1.5 h-1.5 rounded-full z-10" style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }} />
          <motion.div
            className="absolute inset-[-4px] rounded-full border"
            style={{ borderColor: accent }}
            animate={{ scale: [0.5, 1.5], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
        </div>
      );
  }
};
