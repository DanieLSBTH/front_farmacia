// MovingBackground.js
import React from 'react';
import { useSpring, animated } from 'react-spring';

const MovingBackground = () => {
  const styles = useSpring({
    from: { background: '#FF5A5F' }, // Color inicial
    to: { background: '#FCA3A5' }, // Color final
    config: { duration: 3000 },
    loop: { reverse: true },
  });

  return (
    <animated.div
      style={{
        ...styles,
        width: '100%',
        height: '100%',
        position: 'fixed',
        zIndex: -1,
      }}
    />
  );
};

export default MovingBackground;
