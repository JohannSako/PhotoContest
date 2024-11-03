import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Text({ children, size = '16px', weight = '400', color = '#000000', style = {} }) {
  const defaultStyle = {
    fontFamily: inter.style.fontFamily,
    fontSize: size,
    fontWeight: weight,
    color: color,
  };

  const combinedStyle = { ...defaultStyle, ...style };

  return <p style={combinedStyle}>{children}</p>;
}