import React, { useEffect, useState } from 'react';

import border from 'src/features/Border.module.css';
import styles from 'src/features/output-box/OutputBox.module.css';

const OutputBox = ({ output, output_box_ref }) => {
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (output.text.length > 0) {
      if (!highlight) {
        setHighlight(true);
        setTimeout(() => {
          setHighlight(false);
        }, 1000);
      }
    } else {
      setHighlight(false);
    }
  }, [output]);

  return (
    <div
      className={`${styles.Container} ${border.Border}`}
      data-testid="output-box"
      aria-label="Output"
      data-toggle="tooltip"
      title="Output"
      ref={output_box_ref}
      tabIndex={0}>
      <div className={`${styles.Inner}`}>
        <div className={`${styles.Output}`}>{output.text}</div>
        <div className={`${styles.Highlight} ${highlight ? styles.FadeIn : styles.FadeOut}`} />
      </div>
    </div>
  );
};

export default OutputBox;
