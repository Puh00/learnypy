import React, { useEffect, useState } from 'react';

import border from './Border.module.css';
import styles from './OutputBox.module.css';

const OutputBox = ({ output, output_box_ref }) => {
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (output.text.length > 0) {
      setHighlight(true);
      setTimeout(() => {
        setHighlight(false);
      }, 2000);
    } else {
      setHighlight(false);
    }
  }, [output]);

  return (
    <div className={`${styles.Container} ${border.Border}`}>
      <div className={`${styles.Inner}`}>
        <div
          className={`${styles.Output}`}
          data-testid="output-box"
          aria-label="Output"
          ref={output_box_ref}
          tabIndex={0}>
          {output.text}
        </div>
        <div className={`${styles.Shadow} ${highlight ? styles.fadeIn : styles.fadeOut}`} />
      </div>
    </div>
  );
};

export default OutputBox;
