import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Text({ children, size = '16px', weight = '400', color = '#000000' }) {
  const style = {
    fontFamily: inter.style.fontFamily,
    fontSize: size,
    fontWeight: weight,
    color: color,
  };

  return <p style={style}>{children}</p>;
}